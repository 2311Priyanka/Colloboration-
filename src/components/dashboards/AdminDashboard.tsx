import { useEffect, useState } from "react";
import { BookOpen, Users, Calendar, AlertTriangle, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const aiMessages = [
  "🔔 3 classes need staff assignment for next week.",
  "⚡ Schedule conflict detected in Room 301 – Thursday 2PM.",
  "📊 AI suggests redistributing Lab sessions for better balance.",
  "✅ Optimal schedule generated – 92% efficiency score.",
  "🧠 Staff burnout risk: 2 faculty members over 30hrs/week.",
];

export default function AdminDashboard() {
  const [aiMessage, setAiMessage] = useState(aiMessages[0]);
  const [stats, setStats] = useState({ classes: 0, staff: 0, schedules: 0, alerts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [classRes, staffRes] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        classes: classRes.count || 0,
        staff: staffRes.count || 0,
        schedules: 0,
        alerts: 2,
      });
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiMessage(aiMessages[Math.floor(Math.random() * aiMessages.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: "Total Classes", value: stats.classes, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
    { title: "Registered Staff", value: stats.staff, icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { title: "Schedules Active", value: stats.schedules, icon: Calendar, color: "text-success", bg: "bg-success/10" },
    { title: "Active Alerts", value: stats.alerts, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage classes, staff, and scheduling operations.</p>
      </div>

      {/* AI Insight */}
      <div className="glass-card-hover p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary glow">
          <Brain className="h-6 w-6 text-primary-foreground ai-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI Insight
          </p>
          <p className="text-sm font-medium text-foreground truncate">{aiMessage}</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="glass-card-hover p-5 swipe-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} mb-3`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-card-foreground heading-display">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 heading-display">Quick Actions</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {[
            { label: "Create New Class", desc: "Set up class with subjects & staff", href: "/manage-classes" },
            { label: "Add Staff Member", desc: "Register faculty to the system", href: "/manage-staff" },
            { label: "Generate Schedule", desc: "AI-powered timetable generation", href: "/generate-schedule" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="group rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
