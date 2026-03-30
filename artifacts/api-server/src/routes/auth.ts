import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@workspace/db";
import { usersTable, insertUserSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res, next) => {
  try {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Ungültige Eingabe", details: parsed.error.flatten() });
      return;
    }

    const { password, ...rest } = parsed.data;
    const existing = await db.select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, rest.email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "E-Mail bereits registriert" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable)
      .values({ ...rest, passwordHash })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        company: usersTable.company,
        role: usersTable.role,
        verified: usersTable.verified,
        createdAt: usersTable.createdAt,
      });

    const token = signToken(user.id, user.role);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Ungültige Eingabe" });
      return;
    }

    const { email, password } = parsed.data;
    const [user] = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Ungültige Anmeldedaten" });
      return;
    }

    const token = signToken(user.id, user.role);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      company: usersTable.company,
      role: usersTable.role,
      verified: usersTable.verified,
      createdAt: usersTable.createdAt,
    })
      .from(usersTable)
      .where(eq(usersTable.id, req.userId!))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
