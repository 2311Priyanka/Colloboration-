import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";
import { classesTable } from "./classes";

export const qrCodesTable = pgTable("qr_codes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text("token").notNull().unique(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  slotId: text("slot_id").notNull(),
  staffId: text("staff_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attendanceTable = pgTable("attendance", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  qrCodeId: text("qr_code_id").references(() => qrCodesTable.id),
  subjectName: text("subject_name"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodesTable).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({ id: true, timestamp: true });
export type QrCode = typeof qrCodesTable.$inferSelect;
export type Attendance = typeof attendanceTable.$inferSelect;
