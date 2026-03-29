import { classSessions } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { UserCheck, Calendar } from 'lucide-react';

const occupied = classSessions.filter(s => s.isOccupied).length;
const total = classSessions.length;
const rate = Math.round((occupied / total) * 100);

export default function OccupancyPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Class Occupancy</h1>
        <p className="text-sm text-muted-foreground">100% occupancy guarantee — track and resolve gaps</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Occupancy Rate" value={`${rate}%`} icon={UserCheck} variant={rate === 100 ? 'secondary' : 'accent'} />
        <StatCard title="Total Sessions" value={total} icon={Calendar} />
        <StatCard title="Unoccupied" value={total - occupied} icon={AlertTriangle} variant={total - occupied > 0 ? 'danger' : 'default'} />
      </div>

      <div className="space-y-3">
        {classSessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-card rounded-xl p-4 shadow-sm border ${session.isOccupied ? 'border-border' : 'border-destructive/30 bg-destructive/5'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {session.isOccupied ? (
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {session.subject} — Section {session.classSection}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.staff} · {session.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{session.attendanceCount}/{session.totalStudents}</p>
                {!session.isOccupied && (
                  <span className="badge-danger text-[10px]">{session.reason}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
