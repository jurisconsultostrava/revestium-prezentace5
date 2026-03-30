import { Router } from "express";
import { db } from "@workspace/db";
import { transactionsTable, insertTransactionSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/transactions", async (req: AuthRequest, res, next) => {
  try {
    const rows = await db.select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, req.userId!))
      .orderBy(desc(transactionsTable.createdAt))
      .limit(100);

    res.json({ transactions: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/transactions", async (req: AuthRequest, res, next) => {
  try {
    const parsed = insertTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Ungültige Eingabe", details: parsed.error.flatten() });
      return;
    }

    const [tx] = await db.insert(transactionsTable)
      .values({ ...parsed.data, userId: req.userId! })
      .returning();

    res.status(201).json({ transaction: tx });
  } catch (err) {
    next(err);
  }
});

router.get("/transactions/:id", async (req: AuthRequest, res, next) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id)) {
      res.status(400).json({ error: "Ungültige ID" });
      return;
    }

    const [tx] = await db.select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, id))
      .limit(1);

    if (!tx || tx.userId !== req.userId) {
      res.status(404).json({ error: "Transaktion nicht gefunden" });
      return;
    }

    res.json({ transaction: tx });
  } catch (err) {
    next(err);
  }
});

export default router;
