import { staffMembers } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Mail, BookOpen, Clock, Heart } from 'lucide-react';

export default function StaffListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Staff Directory</h1>
        <p className="text-sm text-muted-foreground">Manage faculty members and allocations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffMembers.map((staff, i) => {
          const burnoutLevel = staff.burnoutScore > 60 ? 'danger' : staff.burnoutScore > 30 ? 'warning' : 'success';
          return (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-full ${staff.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.designation} · {staff.department}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {staff.email}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {staff.subjects.map(s => (
                      <span key={s} className="badge-info text-[10px]">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {staff.weeklyHours}hrs/wk</span>
                    <span className={`flex items-center gap-1 badge-${burnoutLevel}`}>
                      <Heart className="h-3 w-3" /> Burnout: {staff.burnoutScore}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
