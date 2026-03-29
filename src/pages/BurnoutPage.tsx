import { staffMembers } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/StatCard';
import { Heart, AlertTriangle, TrendingDown, Shield } from 'lucide-react';

const metrics = [
  { label: 'Weekly Hours', key: 'weeklyHours', threshold: 20, unit: 'hrs' },
];

export default function BurnoutPage() {
  const highRisk = staffMembers.filter(s => s.burnoutScore > 60);
  const medRisk = staffMembers.filter(s => s.burnoutScore > 30 && s.burnoutScore <= 60);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Burnout Monitor</h1>
        <p className="text-sm text-muted-foreground">AI-powered staff wellness tracking</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="High Risk" value={highRisk.length} icon={AlertTriangle} variant="danger" />
        <StatCard title="Medium Risk" value={medRisk.length} icon={Heart} variant="accent" />
        <StatCard title="Low Risk" value={staffMembers.length - highRisk.length - medRisk.length} icon={Shield} variant="secondary" />
        <StatCard title="Avg Score" value={Math.round(staffMembers.reduce((s, m) => s + m.burnoutScore, 0) / staffMembers.length)} icon={TrendingDown} />
      </div>

      <div className="space-y-3">
        {staffMembers
          .sort((a, b) => b.burnoutScore - a.burnoutScore)
          .map((staff, i) => {
            const level = staff.burnoutScore > 60 ? 'danger' : staff.burnoutScore > 30 ? 'warning' : 'success';
            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-card rounded-xl p-5 shadow-sm border ${level === 'danger' ? 'border-destructive/30' : 'border-border'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>
                      {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.department} · {staff.designation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${level === 'danger' ? 'text-destructive' : level === 'warning' ? 'text-warning' : 'text-success'}`}>
                      {staff.burnoutScore}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Risk Score</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${staff.burnoutScore}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${level === 'danger' ? 'bg-destructive' : level === 'warning' ? 'bg-warning' : 'bg-success'}`}
                  />
                </div>

                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>📚 {staff.weeklyHours} hrs/week</span>
                  <span>📖 {staff.subjects.length} subjects</span>
                  {level === 'danger' && <span className="text-destructive font-medium">⚠️ Immediate action needed</span>}
                </div>

                {level === 'danger' && (
                  <div className="mt-3 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-xs text-foreground">
                    <strong>AI Recommendation:</strong> Redistribute {Math.round(staff.weeklyHours - 16)} hours to available staff.
                    Consider temporary reduced load and wellness check-in.
                  </div>
                )}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
