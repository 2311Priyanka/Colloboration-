// Mock data for ClassSync AI

export type UserRole = 'hod' | 'staff' | 'student';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
  weeklyHours: number;
  burnoutScore: number;
  avatarColor: string;
}

export interface ClassSection {
  id: string;
  name: string;
  department: string;
  semester: number;
  studentCount: number;
}

export interface TimetableSlot {
  time: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  room: string;
  staff: string;
  type: 'theory' | 'lab';
  classSection: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'swap' | 'absence' | 'feedback' | 'burnout' | 'occupancy';
  read: boolean;
  time: string;
}

export interface FeedbackEntry {
  id: string;
  staffName: string;
  classSection: string;
  rating: number;
  comment: string;
  sentiment: number;
  topics: string[];
  date: string;
}

export interface ClassSession {
  id: string;
  classSection: string;
  subject: string;
  staff: string;
  time: string;
  isOccupied: boolean;
  attendanceCount: number;
  totalStudents: number;
  reason?: string;
}

export const staffMembers: StaffMember[] = [
  { id: '1', name: 'Dr. Ananya Sharma', email: 'ananya@college.edu', department: 'CSE', designation: 'Associate Professor', subjects: ['Data Structures', 'Algorithms'], weeklyHours: 18, burnoutScore: 35, avatarColor: 'bg-primary' },
  { id: '2', name: 'Prof. Rajesh Kumar', email: 'rajesh@college.edu', department: 'CSE', designation: 'Assistant Professor', subjects: ['Database Systems', 'Web Dev'], weeklyHours: 22, burnoutScore: 72, avatarColor: 'bg-secondary' },
  { id: '3', name: 'Dr. Priya Nair', email: 'priya@college.edu', department: 'ECE', designation: 'Associate Professor', subjects: ['Digital Electronics', 'VLSI'], weeklyHours: 16, burnoutScore: 20, avatarColor: 'bg-accent' },
  { id: '4', name: 'Prof. Suresh Iyer', email: 'suresh@college.edu', department: 'CSE', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Networks'], weeklyHours: 20, burnoutScore: 55, avatarColor: 'bg-info' },
  { id: '5', name: 'Dr. Meera Patel', email: 'meera@college.edu', department: 'MECH', designation: 'Associate Professor', subjects: ['Thermodynamics', 'Fluid Mechanics'], weeklyHours: 14, burnoutScore: 15, avatarColor: 'bg-success' },
  { id: '6', name: 'Prof. Vikram Singh', email: 'vikram@college.edu', department: 'ECE', designation: 'Assistant Professor', subjects: ['Signal Processing', 'Communication'], weeklyHours: 24, burnoutScore: 85, avatarColor: 'bg-destructive' },
];

export const classSections: ClassSection[] = [
  { id: 'c1', name: '2A', department: 'CSE', semester: 3, studentCount: 60 },
  { id: 'c2', name: '2B', department: 'CSE', semester: 3, studentCount: 58 },
  { id: 'c3', name: '3A', department: 'ECE', semester: 5, studentCount: 55 },
  { id: 'c4', name: '1A', department: 'MECH', semester: 1, studentCount: 62 },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const weeklyTimetable: Record<string, TimetableSlot[]> = {
  Monday: [
    { time: '8:30', endTime: '9:30', subject: 'Data Structures', subjectCode: 'CS201', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
    { time: '9:30', endTime: '10:30', subject: 'Database Systems', subjectCode: 'CS301', room: '102', staff: 'Prof. Rajesh Kumar', type: 'theory', classSection: '2A' },
    { time: '11:00', endTime: '1:00', subject: 'Data Structures Lab', subjectCode: 'CS201L', room: 'Lab 1', staff: 'Dr. Ananya Sharma', type: 'lab', classSection: '2A' },
    { time: '2:00', endTime: '3:00', subject: 'Operating Systems', subjectCode: 'CS401', room: '201', staff: 'Prof. Suresh Iyer', type: 'theory', classSection: '2A' },
    { time: '3:00', endTime: '4:00', subject: 'Web Development', subjectCode: 'CS302', room: '103', staff: 'Prof. Rajesh Kumar', type: 'theory', classSection: '2A' },
  ],
  Tuesday: [
    { time: '8:30', endTime: '9:30', subject: 'Algorithms', subjectCode: 'CS202', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
    { time: '9:30', endTime: '10:30', subject: 'Networks', subjectCode: 'CS402', room: '202', staff: 'Prof. Suresh Iyer', type: 'theory', classSection: '2A' },
    { time: '11:00', endTime: '1:00', subject: 'Database Lab', subjectCode: 'CS301L', room: 'Lab 2', staff: 'Prof. Rajesh Kumar', type: 'lab', classSection: '2A' },
    { time: '2:00', endTime: '3:00', subject: 'Data Structures', subjectCode: 'CS201', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
  ],
  Wednesday: [
    { time: '8:30', endTime: '9:30', subject: 'Operating Systems', subjectCode: 'CS401', room: '201', staff: 'Prof. Suresh Iyer', type: 'theory', classSection: '2A' },
    { time: '9:30', endTime: '10:30', subject: 'Web Development', subjectCode: 'CS302', room: '103', staff: 'Prof. Rajesh Kumar', type: 'theory', classSection: '2A' },
    { time: '11:00', endTime: '12:00', subject: 'Algorithms', subjectCode: 'CS202', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
    { time: '2:00', endTime: '4:00', subject: 'OS Lab', subjectCode: 'CS401L', room: 'Lab 3', staff: 'Prof. Suresh Iyer', type: 'lab', classSection: '2A' },
  ],
  Thursday: [
    { time: '8:30', endTime: '10:30', subject: 'Web Dev Lab', subjectCode: 'CS302L', room: 'Lab 1', staff: 'Prof. Rajesh Kumar', type: 'lab', classSection: '2A' },
    { time: '11:00', endTime: '12:00', subject: 'Data Structures', subjectCode: 'CS201', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
    { time: '2:00', endTime: '3:00', subject: 'Networks', subjectCode: 'CS402', room: '202', staff: 'Prof. Suresh Iyer', type: 'theory', classSection: '2A' },
    { time: '3:00', endTime: '4:00', subject: 'Database Systems', subjectCode: 'CS301', room: '102', staff: 'Prof. Rajesh Kumar', type: 'theory', classSection: '2A' },
  ],
  Friday: [
    { time: '8:30', endTime: '9:30', subject: 'Algorithms', subjectCode: 'CS202', room: '101', staff: 'Dr. Ananya Sharma', type: 'theory', classSection: '2A' },
    { time: '9:30', endTime: '10:30', subject: 'Operating Systems', subjectCode: 'CS401', room: '201', staff: 'Prof. Suresh Iyer', type: 'theory', classSection: '2A' },
    { time: '11:00', endTime: '1:00', subject: 'Networks Lab', subjectCode: 'CS402L', room: 'Lab 2', staff: 'Prof. Suresh Iyer', type: 'lab', classSection: '2A' },
    { time: '2:00', endTime: '3:00', subject: 'Web Development', subjectCode: 'CS302', room: '103', staff: 'Prof. Rajesh Kumar', type: 'theory', classSection: '2A' },
  ],
};

export const notifications: Notification[] = [
  { id: '1', message: 'Class 2A (DS, Mon 10 AM) was NOT fully occupied. Reason: Low Enrollment', type: 'occupancy', read: false, time: '2 min ago' },
  { id: '2', message: 'Prof. Rajesh marked unavailable for Tue. Auto-substitute: Dr. Ananya assigned.', type: 'absence', read: false, time: '15 min ago' },
  { id: '3', message: 'Burnout alert: Prof. Vikram Singh risk score 85/100. Immediate action needed.', type: 'burnout', read: false, time: '1 hr ago' },
  { id: '4', message: 'Timetable v3 generated. 2 classes swapped for Section 2B.', type: 'swap', read: true, time: '3 hrs ago' },
  { id: '5', message: 'Feedback window open for Dr. Ananya (2A). 48hrs remaining.', type: 'feedback', read: true, time: '5 hrs ago' },
];

export const feedbackData: FeedbackEntry[] = [
  { id: '1', staffName: 'Dr. Ananya Sharma', classSection: '2A', rating: 4.5, comment: 'Very clear explanations. Sometimes pacing is too fast for complex topics.', sentiment: 0.82, topics: ['clarity', 'pacing'], date: '2026-03-28' },
  { id: '2', staffName: 'Prof. Rajesh Kumar', classSection: '2A', rating: 3.2, comment: 'Lectures feel monotonous. Need more practical examples and engagement.', sentiment: 0.38, topics: ['engagement', 'teaching style'], date: '2026-03-27' },
  { id: '3', staffName: 'Prof. Suresh Iyer', classSection: '2A', rating: 4.0, comment: 'Great at OS concepts but labs could use better documentation.', sentiment: 0.72, topics: ['clarity', 'assessment'], date: '2026-03-26' },
  { id: '4', staffName: 'Dr. Priya Nair', classSection: '3A', rating: 4.8, comment: 'Outstanding teaching! Makes digital electronics fun and interactive.', sentiment: 0.95, topics: ['engagement', 'teaching style'], date: '2026-03-25' },
  { id: '5', staffName: 'Prof. Vikram Singh', classSection: '3A', rating: 2.8, comment: 'Too many assignments. Feels burned out and sometimes unprepared.', sentiment: 0.25, topics: ['assessment', 'engagement'], date: '2026-03-24' },
];

export const classSessions: ClassSession[] = [
  { id: '1', classSection: '2A', subject: 'Data Structures', staff: 'Dr. Ananya', time: 'Mon 8:30 AM', isOccupied: true, attendanceCount: 58, totalStudents: 60 },
  { id: '2', classSection: '2A', subject: 'Database Systems', staff: 'Prof. Rajesh', time: 'Mon 9:30 AM', isOccupied: true, attendanceCount: 55, totalStudents: 60 },
  { id: '3', classSection: '2B', subject: 'Algorithms', staff: 'Dr. Ananya', time: 'Mon 11:00 AM', isOccupied: false, attendanceCount: 0, totalStudents: 58, reason: 'Staff Absent' },
  { id: '4', classSection: '3A', subject: 'Digital Electronics', staff: 'Dr. Priya', time: 'Mon 2:00 PM', isOccupied: true, attendanceCount: 54, totalStudents: 55 },
  { id: '5', classSection: '2A', subject: 'Web Dev', staff: 'Prof. Rajesh', time: 'Tue 9:30 AM', isOccupied: false, attendanceCount: 12, totalStudents: 60, reason: 'Low Enrollment' },
];

export const sentimentTrend = [
  { week: 'W1', 'Dr. Ananya': 0.85, 'Prof. Rajesh': 0.45, 'Prof. Suresh': 0.7, 'Dr. Priya': 0.92, 'Prof. Vikram': 0.35 },
  { week: 'W2', 'Dr. Ananya': 0.82, 'Prof. Rajesh': 0.42, 'Prof. Suresh': 0.68, 'Dr. Priya': 0.9, 'Prof. Vikram': 0.3 },
  { week: 'W3', 'Dr. Ananya': 0.88, 'Prof. Rajesh': 0.38, 'Prof. Suresh': 0.72, 'Dr. Priya': 0.95, 'Prof. Vikram': 0.28 },
  { week: 'W4', 'Dr. Ananya': 0.84, 'Prof. Rajesh': 0.4, 'Prof. Suresh': 0.75, 'Dr. Priya': 0.93, 'Prof. Vikram': 0.25 },
];

export const workloadData = staffMembers.map(s => ({
  name: s.name.split(' ').slice(-1)[0],
  hours: s.weeklyHours,
  max: 20,
}));

export const roomUtilization = [
  { name: 'Occupied', value: 82, fill: 'hsl(174, 84%, 32%)' },
  { name: 'Free', value: 18, fill: 'hsl(214, 20%, 90%)' },
];

export const occupancyRate = [
  { day: 'Mon', rate: 95 },
  { day: 'Tue', rate: 88 },
  { day: 'Wed', rate: 100 },
  { day: 'Thu', rate: 92 },
  { day: 'Fri', rate: 85 },
];
