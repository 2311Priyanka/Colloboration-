import { useEffect, useState } from "react";
import { BarChart3, Users, ClipboardList, AlertTriangle, Brain, Sparkles, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const performanceData = [
  { name: "Dr. Kumar", classes: 18, rating: 4.2 },
  { name: "Prof. Sharma", classes: 15, rating: 4.5 },
  { name: "Dr. Patel", classes: 20, rating: 3.8 },
  { name: "Prof. Singh", classes: 12, rating: 4.7 },
  { name: "Dr. Reddy", classes: 22, rating: 3.5 },
];

export default function HodDashboard() {
  const [aiMessage, setAiMessage] = useState("Prof. Kumar has 3 pending classes this week. Consider follow-up.");

  useEffect(() => {
    const msgs = [
      "Prof. Kumar has 3 pending classes this week. Consider follow-up.",
      "Student feedback dropped 15% for CS201 – review recommended.",
      "Dr. Patel stress level critical (9/10) – redistribute workload.",
      "2 staff members haven't chosen their Monday slots yet.",
    ];
    const interval = setInterval(() => {
      setAiMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Total Staff", value: "12", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Classes Taken", value: "87", icon: ClipboardList, color: "text-success", bg: "bg-success/10" },
    { title: "Pending Classes", value: "5", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { title: "Avg Rating", value: "4.1", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">HOD Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor staff performance and class attendance.</p>
      </div>

      {/* AI Insight */}
      <div className="glass-card-hover p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary glow">
          <Brain className="h-6 w-6 text-primary-foreground ai-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI Alert
          </p>
          <p className="text-sm font-medium text-foreground">{aiMessage}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.title} className="glass-card-hover p-5 swipe-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-3xl font-bold text-card-foreground heading-display">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.title}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 heading-display flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Staff Performance
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  backdropFilter: "blur(20px)",
                }}
              />
              <Bar dataKey="classes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Classes Taken" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
