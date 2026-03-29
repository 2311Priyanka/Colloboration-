import { motion } from 'framer-motion';
import { StatCard } from '@/components/StatCard';
import { TimetableGrid } from '@/components/TimetableGrid';
import {
  Users, BookOpen, Calendar, AlertTriangle, UserCheck,
  Heart, BarChart3, TrendingUp
} from 'lucide-react';
import {
  staffMembers, classSections, classSessions, notifications,
  workloadData, roomUtilization, occupancyRate, sentimentTrend
} from '@/lib/mock-data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

const unoccupied = classSessions.filter(s => !s.isOccupied).length;
const burnoutAlerts = staffMembers.filter(s => s.burnoutScore > 60).length;

export default function HodDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your department's performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staffMembers.length} icon={Users} variant="primary" trend={{ value: 5, positive: true }} />
        <StatCard title="Active Classes" value={classSections.length} icon={BookOpen} variant="secondary" subtitle="4 sections" />
        <StatCard
          title="Unoccupied Classes"
          value={unoccupied}
          icon={AlertTriangle}
          variant={unoccupied > 0 ? 'accent' : 'default'}
          subtitle={unoccupied > 0 ? 'Action required!' : 'All occupied ✓'}
        />
        <StatCard title="Burnout Alerts" value={burnoutAlerts} icon={Heart} variant={burnoutAlerts > 0 ? 'danger' : 'default'} subtitle={`${burnoutAlerts} staff at risk`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Workload Distribution */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Staff Workload (hrs/week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workloadData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="hours" fill="hsl(174, 84%, 32%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="max" fill="hsl(var(--border))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Daily Occupancy Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={occupancyRate}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="rate" stroke="hsl(224, 76%, 33%)" fill="hsl(224, 76%, 33%)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment + Room util */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Student Sentiment Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sentimentTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Dr. Ananya" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Prof. Rajesh" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Prof. Suresh" stroke="#1E3A8A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Prof. Vikram" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Room Utilization</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roomUtilization} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {roomUtilization.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="badge-success text-xs">82% Occupied</span>
            <span className="badge-warning text-xs">18% Free</span>
          </div>
        </div>
      </div>

      {/* Burnout heatmap */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Staff Burnout Risk Monitor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {staffMembers.map(staff => {
            const level = staff.burnoutScore > 60 ? 'danger' : staff.burnoutScore > 30 ? 'warning' : 'success';
            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-lg p-3 flex items-center gap-3"
              >
                <div className={`h-10 w-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>
                  {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.weeklyHours}hrs/wk</p>
                </div>
                <div className="text-right">
                  <span className={`badge-${level} text-xs`}>
                    {staff.burnoutScore}/100
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {level === 'danger' ? '🔴 High' : level === 'warning' ? '🟡 Medium' : '🟢 Low'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent alerts */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Alerts</h3>
        <div className="space-y-2">
          {notifications.slice(0, 4).map(n => (
            <div key={n.id} className={`p-3 rounded-lg border ${!n.read ? 'bg-accent/5 border-accent/20' : 'border-border'}`}>
              <p className="text-sm text-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
