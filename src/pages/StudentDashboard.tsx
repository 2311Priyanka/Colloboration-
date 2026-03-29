import { TimetableGrid } from '@/components/TimetableGrid';
import { StatCard } from '@/components/StatCard';
import { Calendar, UserCheck, MessageSquare, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const attendanceHistory = [
  { subject: 'Data Structures', attended: 28, total: 30, percent: 93 },
  { subject: 'Database Systems', attended: 25, total: 30, percent: 83 },
  { subject: 'Operating Systems', attended: 27, total: 30, percent: 90 },
  { subject: 'Web Development', attended: 22, total: 28, percent: 79 },
  { subject: 'Algorithms', attended: 29, total: 30, percent: 97 },
];

const reminders = [
  { text: 'Quiz tomorrow on Chapter 3. Bring lab manuals.', by: 'Dr. Ananya', time: '2 hrs ago' },
  { text: 'Submit DB project report by Friday 5 PM.', by: 'Prof. Rajesh', time: '1 day ago' },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Arjun Mehta · Section 2A · CSE, Semester 3</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Classes" value={4} icon={Calendar} variant="primary" />
        <StatCard title="Attendance" value="89%" icon={UserCheck} variant="secondary" />
        <StatCard title="Pending Feedback" value={1} icon={MessageSquare} variant="accent" />
        <StatCard title="Scan QR" value="Ready" icon={QrCode} />
      </div>

      {/* Reminders */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">📌 Upcoming Reminders</h3>
        <div className="space-y-2">
          {reminders.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-lg border border-border"
            >
              <p className="text-sm text-foreground">{r.text}</p>
              <p className="text-xs text-muted-foreground mt-1">— {r.by} · {r.time}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Attendance breakdown */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Attendance History</h3>
        <div className="space-y-3">
          {attendanceHistory.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground truncate">{a.subject}</span>
                  <span className={`text-xs font-semibold ${a.percent >= 85 ? 'text-success' : a.percent >= 75 ? 'text-warning' : 'text-destructive'}`}>
                    {a.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${a.percent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${a.percent >= 85 ? 'bg-success' : a.percent >= 75 ? 'bg-warning' : 'bg-destructive'}`}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{a.attended}/{a.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">My Timetable</h3>
        <TimetableGrid />
      </div>
    </div>
  );
}
