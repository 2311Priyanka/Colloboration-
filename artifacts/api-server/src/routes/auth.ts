import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  staffTable,
  studentsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, hashPassword, comparePassword } from "../lib/auth.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Bad Request", message: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }

    let staffId: string | undefined;
    let studentId: string | undefined;
    if (user.role === "STAFF" || user.role === "HOD") {
      const [staff] = await db.select().from(staffTable).where(eq(staffTable.userId, user.id));
      staffId = staff?.id;
    } else if (user.role === "STUDENT") {
      const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, user.id));
      studentId = student?.id;
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email, staffId, studentId });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        staffId,
        studentId,
      },
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, department, phone, designation, year, section } = req.body;
    if (!email || !password || !name || !role || !department) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "Conflict", message: "Email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      email,
      password: hashedPassword,
      name,
      role,
      department,
      phone,
    }).returning();

    let staffId: string | undefined;
    let studentId: string | undefined;
    if (role === "STAFF" || role === "HOD") {
      const [staff] = await db.insert(staffTable).values({
        userId: user.id,
        designation: designation || "Lecturer",
        year: year ? Number(year) : null,
        section: section || null,
      }).returning();
      staffId = staff.id;
    } else if (role === "STUDENT") {
      const [student] = await db.insert(studentsTable).values({
        userId: user.id,
        year: year ? Number(year) : null,
        section: section || null,
      }).returning();
      studentId = student.id;
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email, staffId, studentId });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        staffId,
        studentId,
        year: year ? Number(year) : undefined,
        section: section || undefined,
      },
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
    if (!user) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      phone: user.phone,
      staffId: req.user!.staffId,
      studentId: req.user!.studentId,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
