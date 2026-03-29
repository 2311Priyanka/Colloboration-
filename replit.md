# Smart Classroom Management System
<!-- Last updated: year/section fields added to students + staff tables; staff students filter page at /staff/students -->

## Overview

A production-ready full-stack Smart Classroom Management System for colleges, supporting Staff, HOD (Head of Department), and Student roles.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Shadcn/UI + Recharts + QRCode.react
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── classroom/          # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Demo data seeder
└── ...
```

## Demo Credentials

- **HOD**: hod@college.edu / password123
- **Staff 1**: staff1@college.edu / password123
- **Staff 2**: staff2@college.edu / password123
- **Student**: student1@college.edu / password123
- **Student**: student2@college.edu / password123
- **Class codes**: CS2A24 (2A), CS2B24 (2B)

## Features

### User Roles
1. **Staff** — Manage subjects, view timetable, generate QR attendance codes, write class notes, mark unavailability
2. **HOD** — Dashboard with analytics, manage classes & staff, allocate subjects, generate timetables, view burnout analysis, open feedback windows
3. **Student** — View timetable & class info, scan QR for attendance, submit feedback, view notifications

### Key Features
- JWT Authentication with role-based access control
- Weekly timetable generation with constraint-based scheduling
- QR code attendance (2-minute expiry, single-use tokens)
- Staff burnout detection with risk scoring (0-100) and recommendations
- NLP-based student feedback sentiment analysis
- Real-time notifications system
- HOD analytics dashboard with workload, burnout heatmap, and satisfaction charts
- Staff availability/unavailability management with HOD alerts
- Class notes management per classroom

## Database Schema

Key tables: users, staff, students, subjects, classes, allocations, timetables, timetable_slots, attendance, qr_codes, notes, feedback, feedback_windows, notifications, availability, schedule_config

## API Routes

All routes under `/api`:
- `/auth/*` — login, register, me
- `/subjects/*` — CRUD for staff subjects
- `/classes/*` — class management and allocations
- `/timetable/*` — timetable generation and retrieval
- `/qr/*` — QR generation and scanning
- `/attendance/*` — attendance records
- `/notes/*` — class notes
- `/feedback/*` — feedback windows and submissions
- `/notifications/*` — notifications
- `/availability/*` — staff availability
- `/burnout/*` — burnout analysis
- `/analytics/*` — HOD analytics
- `/hod/*` — HOD-specific (staff list, schedule config)
- `/students/*` — student class joining
