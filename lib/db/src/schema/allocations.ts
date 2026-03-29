import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable } from "./classes";
import { staffTable } from "./staff";
import { subjectsTable } from "./subjects";
import { subjectTypeEnum } from "./subjects";

export const allocationsTable = pgTable("allocations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjectsTable.id, { onDelete: "cascade" }),
  type: subjectTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.classId, t.subjectId, t.type)]);

export const insertAllocationSchema = createInsertSchema(allocationsTable).omit({ id: true, createdAt: true });
export type InsertAllocation = z.infer<typeof insertAllocationSchema>;
export type Allocation = typeof allocationsTable.$inferSelect;
