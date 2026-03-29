import { db, usersTable, staffTable, studentsTable, subjectsTable, classesTable, allocationsTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding demo data...");

  const password = await bcrypt.hash("password123", 10);

  const [hod] = await db.insert(usersTable).values({
    email: "hod@college.edu",
    password,
    name: "Dr. Sarah Johnson",
    role: "HOD",
    department: "Computer Science",
    phone: "9876543210",
  }).onConflictDoNothing().returning();

  const [staff1] = await db.insert(usersTable).values({
    email: "staff1@college.edu",
    password,
    name: "Prof. Michael Chen",
    role: "STAFF",
    department: "Computer Science",
    phone: "9876543211",
  }).onConflictDoNothing().returning();

  const [staff2] = await db.insert(usersTable).values({
    email: "staff2@college.edu",
    password,
    name: "Dr. Priya Sharma",
    role: "STAFF",
    department: "Computer Science",
    phone: "9876543212",
  }).onConflictDoNothing().returning();

  const [student1] = await db.insert(usersTable).values({
    email: "student1@college.edu",
    password,
    name: "Alex Kumar",
    role: "STUDENT",
    department: "Computer Science",
  }).onConflictDoNothing().returning();

  const [student2] = await db.insert(usersTable).values({
    email: "student2@college.edu",
    password,
    name: "Priya Patel",
    role: "STUDENT",
    department: "Computer Science",
  }).onConflictDoNothing().returning();

  let hodStaff: any, staffRec1: any, staffRec2: any;

  if (hod) {
    [hodStaff] = await db.insert(staffTable).values({ userId: hod.id, designation: "Head of Department" }).onConflictDoNothing().returning();
  }
  if (staff1) {
    [staffRec1] = await db.insert(staffTable).values({ userId: staff1.id, designation: "Associate Professor" }).onConflictDoNothing().returning();
  }
  if (staff2) {
    [staffRec2] = await db.insert(staffTable).values({ userId: staff2.id, designation: "Assistant Professor" }).onConflictDoNothing().returning();
  }

  if (!staffRec1) {
    const s = await db.select().from(staffTable).leftJoin(usersTable, eq(usersTable.id, staffTable.userId)).where(eq(usersTable.email, "staff1@college.edu"));
    staffRec1 = s[0]?.staff;
  }
  if (!staffRec2) {
    const s = await db.select().from(staffTable).leftJoin(usersTable, eq(usersTable.id, staffTable.userId)).where(eq(usersTable.email, "staff2@college.edu"));
    staffRec2 = s[0]?.staff;
  }

  const subjects: any[] = [];
  if (staffRec1) {
    const s1 = await db.insert(subjectsTable).values([
      { staffId: staffRec1.id, name: "Data Structures", code: "CS301", type: "THEORY", credits: 4 },
      { staffId: staffRec1.id, name: "Data Structures Lab", code: "CS301L", type: "LAB", credits: 2 },
      { staffId: staffRec1.id, name: "Algorithms", code: "CS302", type: "THEORY", credits: 3 },
    ]).onConflictDoNothing().returning();
    subjects.push(...s1);
  }

  if (staffRec2) {
    const s2 = await db.insert(subjectsTable).values([
      { staffId: staffRec2.id, name: "Database Management", code: "CS303", type: "THEORY", credits: 4 },
      { staffId: staffRec2.id, name: "Database Lab", code: "CS303L", type: "LAB", credits: 2 },
      { staffId: staffRec2.id, name: "Computer Networks", code: "CS304", type: "THEORY", credits: 3 },
    ]).onConflictDoNothing().returning();
    subjects.push(...s2);
  }

  const [cls2A] = await db.insert(classesTable).values({
    name: "2A",
    department: "Computer Science",
    semester: 3,
    studentCount: 60,
    classCode: "CS2A24",
  }).onConflictDoNothing().returning();

  const [cls2B] = await db.insert(classesTable).values({
    name: "2B",
    department: "Computer Science",
    semester: 3,
    studentCount: 58,
    classCode: "CS2B24",
  }).onConflictDoNothing().returning();

  let existingCls2A = cls2A;
  if (!existingCls2A) {
    const c = await db.select().from(classesTable).where(eq(classesTable.classCode, "CS2A24"));
    existingCls2A = c[0];
  }

  if (existingCls2A && student1) {
    await db.insert(studentsTable).values({ userId: student1.id, classId: existingCls2A.id }).onConflictDoNothing();
  }
  if (existingCls2A && student2) {
    await db.insert(studentsTable).values({ userId: student2.id, classId: existingCls2A.id }).onConflictDoNothing();
  }

  if (existingCls2A && staffRec1 && subjects.length >= 2) {
    const dsSubject = subjects.find(s => s.code === "CS301");
    const dsLabSubject = subjects.find(s => s.code === "CS301L");
    const algoSubject = subjects.find(s => s.code === "CS302");
    const dbSubject = subjects.find(s => s.code === "CS303");

    if (dsSubject && staffRec1) {
      await db.insert(allocationsTable).values({
        classId: existingCls2A.id, staffId: staffRec1.id, subjectId: dsSubject.id, type: "THEORY"
      }).onConflictDoNothing();
    }
    if (dsLabSubject && staffRec1) {
      await db.insert(allocationsTable).values({
        classId: existingCls2A.id, staffId: staffRec1.id, subjectId: dsLabSubject.id, type: "LAB"
      }).onConflictDoNothing();
    }
    if (dbSubject && staffRec2) {
      await db.insert(allocationsTable).values({
        classId: existingCls2A.id, staffId: staffRec2.id, subjectId: dbSubject.id, type: "THEORY"
      }).onConflictDoNothing();
    }
  }

  if (student1) {
    await db.insert(notificationsTable).values({
      userId: student1.id,
      message: "Welcome to SmartClass! Join your class using code: CS2A24",
      type: "GENERAL",
    }).onConflictDoNothing();
  }

  if (hod) {
    await db.insert(notificationsTable).values({
      userId: hod.id,
      message: "New staff members have registered. Please review and allocate subjects.",
      type: "GENERAL",
    }).onConflictDoNothing();
  }

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo Credentials:");
  console.log("  HOD:     hod@college.edu     / password123");
  console.log("  Staff 1: staff1@college.edu  / password123");
  console.log("  Staff 2: staff2@college.edu  / password123");
  console.log("  Student: student1@college.edu / password123");
  console.log("  Student: student2@college.edu / password123");
  console.log("\n🏫 Class codes: CS2A24, CS2B24");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
