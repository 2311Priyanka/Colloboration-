import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classesTable = pgTable("classes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  department: text("department").notNull(),
  semester: integer("semester").notNull(),
  studentCount: integer("student_count").notNull(),
  classCode: text("class_code").notNull().unique().$defaultFn(() => Math.random().toString(36).substring(2, 8).toUpperCase()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClassSchema = createInsertSchema(classesTable).omit({ id: true, createdAt: true, classCode: true });
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classesTable.$inferSelect;
