import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable } from "./classes";
import { staffTable } from "./staff";

export const notesTable = pgTable("notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notesTable.$inferSelect;
