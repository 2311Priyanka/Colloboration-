import { pgTable, text, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable } from "./classes";
import { studentsTable } from "./students";
import { staffTable } from "./staff";

export const feedbackWindowsTable = pgTable("feedback_windows", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  opensAt: timestamp("opens_at").notNull().defaultNow(),
  closesAt: timestamp("closes_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const feedbackTable = pgTable("feedback", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  windowId: text("window_id").notNull().references(() => feedbackWindowsTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").references(() => studentsTable.id, { onDelete: "set null" }),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  sentiment: real("sentiment"),
  sentimentLabel: text("sentiment_label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeedbackWindowSchema = createInsertSchema(feedbackWindowsTable).omit({ id: true, createdAt: true });
export const insertFeedbackSchema = createInsertSchema(feedbackTable).omit({ id: true, createdAt: true });
export type FeedbackWindow = typeof feedbackWindowsTable.$inferSelect;
export type Feedback = typeof feedbackTable.$inferSelect;
