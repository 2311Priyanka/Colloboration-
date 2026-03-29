import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { staffTable } from "./staff";

export const subjectTypeEnum = pgEnum("subject_type", ["THEORY", "LAB"]);

export const subjectsTable = pgTable("subjects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: subjectTypeEnum("type").notNull(),
  credits: integer("credits").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({ id: true, createdAt: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjectsTable.$inferSelect;
