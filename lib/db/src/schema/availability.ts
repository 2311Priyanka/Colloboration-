import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { staffTable } from "./staff";

export const availabilityTable = pgTable("availability", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").notNull().default(false),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAvailabilitySchema = createInsertSchema(availabilityTable).omit({ id: true, createdAt: true });
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Availability = typeof availabilityTable.$inferSelect;
