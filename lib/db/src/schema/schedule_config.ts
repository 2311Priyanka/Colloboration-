import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scheduleConfigTable = pgTable("schedule_config", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  department: text("department").notNull().unique(),
  labStartTime: text("lab_start_time").notNull().default("08:30"),
  labEndTime: text("lab_end_time").notNull().default("16:30"),
  teaBreakStart: text("tea_break_start").notNull().default("10:30"),
  teaBreakEnd: text("tea_break_end").notNull().default("10:45"),
  lunchBreakStart: text("lunch_break_start").notNull().default("13:00"),
  lunchBreakEnd: text("lunch_break_end").notNull().default("14:00"),
  maxContinuousHours: integer("max_continuous_hours").notNull().default(2),
  maxWeeklyHours: integer("max_weekly_hours").notNull().default(20),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertScheduleConfigSchema = createInsertSchema(scheduleConfigTable).omit({ id: true, updatedAt: true });
export type InsertScheduleConfig = z.infer<typeof insertScheduleConfigSchema>;
export type ScheduleConfig = typeof scheduleConfigTable.$inferSelect;
