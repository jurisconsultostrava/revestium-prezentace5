import { pgTable, serial, integer, varchar, numeric, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(),
  amountGrams: numeric("amount_grams", { precision: 18, scale: 6 }).notNull(),
  priceEurPerGram: numeric("price_eur_per_gram", { precision: 18, scale: 6 }),
  totalEur: numeric("total_eur", { precision: 18, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  type: z.enum(["buy", "sell", "deposit", "withdrawal", "repo", "hypo"]),
  amountGrams: z.string().or(z.number()).transform(String),
});

export const selectTransactionSchema = createSelectSchema(transactionsTable);

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
