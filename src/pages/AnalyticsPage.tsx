import { StatCard } from '@/components/StatCard';
import { BarChart3, UserCheck, Heart, TrendingUp } from 'lucide-react';
import {
  workloadData, occupancyRate, sentimentTrend, staffMembers, classSessions, feedbackData
} from '@/lib/mock-data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const topicBreakdown = [
  { topic: 'Clarity', count: 45 },
  { topic: 'Pacing', count: 32 },
  { topic: 'Engagement', count: 28 },
  { topic: 'Assessment', count: 20 },
  { topic: 'Teaching Style', count: 38 },
];

const avgOccupancy = Math.round(occupancyRate.reduce((s, d) => s + d.rate, 0) / occupancyRate.length);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Department-wide performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Occupancy" value={`${avgOccupancy}%`} icon={UserCheck} variant="primary" />
        <StatCard title="Avg Sentiment" value="0.68" icon={TrendingUp} variant="secondary" />
        <StatCard title="Staff at Risk" value={staffMembers.filter(s => s.burnoutScore > 60).length} icon={Heart} variant="accent" />
        <StatCard title="Total Feedback" value={feedbackData.length * 12} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workloadData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="hours" fill="hsl(174, 84%, 32%)" radius={[6, 6, 0, 0]} name="Current Hours" />
              <Bar dataKey="max" fill="hsl(var(--border))" radius={[6, 6, 0, 0]} name="Max Allowed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={occupancyRate}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="rate" stroke="hsl(224, 76%, 33%)" fill="hsl(224, 76%, 33%)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Sentiment Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sentimentTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Dr. Ananya" stroke="#0D9488" strokeWidth={2} />
              <Line type="monotone" dataKey="Prof. Rajesh" stroke="#F97316" strokeWidth={2} />
              <Line type="monotone" dataKey="Prof. Vikram" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Feedback Topic Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={topicBreakdown}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Radar dataKey="count" stroke="hsl(174, 84%, 32%)" fill="hsl(174, 84%, 32%)" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
