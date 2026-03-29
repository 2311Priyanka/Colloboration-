import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable } from "./classes";
import { subjectsTable } from "./subjects";
import { staffTable } from "./staff";
import { subjectTypeEnum } from "./subjects";

export const dayEnum = pgEnum("day_of_week", ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);

export const timetablesTable = pgTable("timetables", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  classId: text("class_id").notNull().unique().references(() => classesTable.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const timetableSlotsTable = pgTable("timetable_slots", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  timetableId: text("timetable_id").notNull().references(() => timetablesTable.id, { onDelete: "cascade" }),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  day: dayEnum("day").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  subjectId: text("subject_id").references(() => subjectsTable.id, { onDelete: "set null" }),
  subjectType: subjectTypeEnum("subject_type"),
  room: text("room").notNull(),
  staffId: text("staff_id").references(() => staffTable.id, { onDelete: "set null" }),
});

export const insertTimetableSchema = createInsertSchema(timetablesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTimetableSlotSchema = createInsertSchema(timetableSlotsTable).omit({ id: true });
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetablesTable.$inferSelect;
export type TimetableSlot = typeof timetableSlotsTable.$inferSelect;
