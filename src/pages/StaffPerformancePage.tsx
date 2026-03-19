import { BarChart3, Star, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const staffData = [
  { name: "Dr. Kumar", classes: 18, rating: 4.2, stress: 6, trend: "up" as const },
  { name: "Prof. Sharma", classes: 15, rating: 4.5, stress: 4, trend: "up" as const },
  { name: "Dr. Patel", classes: 20, rating: 3.8, stress: 8, trend: "down" as const },
  { name: "Prof. Singh", classes: 12, rating: 4.7, stress: 3, trend: "up" as const },
  { name: "Dr. Reddy", classes: 22, rating: 3.5, stress: 9, trend: "down" as const },
];

export default function StaffPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Staff Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Analytics based on student feedback and workload.</p>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold heading-display mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Workload Distribution
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="classes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Classes" />
              <Bar dataKey="stress" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Stress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {staffData.map((staff) => (
          <div key={staff.name} className="glass-card-hover p-5 swipe-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{staff.name}</p>
                <p className="text-xs text-muted-foreground">{staff.classes} classes this month</p>
              </div>
              {staff.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="text-sm font-bold text-foreground">{staff.rating}</span>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    staff.stress <= 4 ? "bg-success" : staff.stress <= 7 ? "bg-warning" : "bg-destructive"
                  }`}
                  style={{ width: `${staff.stress * 10}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">Stress: {staff.stress}/10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
