import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Brain, Sparkles, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const todayClasses = [
  { time: "9:00 AM", subject: "Data Structures", room: "R101", type: "theory" as const },
  { time: "10:00 AM", subject: "AI Lab", room: "Lab 3", type: "lab" as const },
  { time: "11:00 AM", subject: "AI Lab", room: "Lab 3", type: "lab" as const },
  { time: "1:00 PM", subject: "DBMS", room: "R202", type: "theory" as const },
  { time: "3:00 PM", subject: "OS", room: "R105", type: "theory" as const },
];

export default function StaffDashboard() {
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening");
  }, []);

  const dayName = new Date().toLocaleDateString([], { weekday: "long" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">
          {greeting}, {profile?.full_name || "Faculty"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your schedule for {dayName}.</p>
      </div>

      {/* AI Insight */}
      <div className="glass-card-hover p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary glow">
          <Brain className="h-6 w-6 text-primary-foreground ai-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> For You
          </p>
          <p className="text-sm font-medium text-foreground">You have 2 class options for 1:00 PM – choose your preference.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Today's Classes", value: "5", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Free Periods", value: "2", icon: Clock, color: "text-success", bg: "bg-success/10" },
          { label: "This Week", value: "24", icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
        ].map((s) => (
          <div key={s.label} className="glass-card-hover p-4 swipe-card text-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} mx-auto mb-2`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold heading-display text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 heading-display">Today's Classes</h3>
        <div className="space-y-3">
          {todayClasses.map((cls, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-xl p-4 transition-all swipe-card ${
                cls.type === "lab"
                  ? "bg-success/5 border border-success/20 hover:bg-success/10"
                  : "bg-primary/5 border border-primary/20 hover:bg-primary/10"
              }`}
            >
              <div className="text-center min-w-[60px]">
                <p className="text-xs font-bold text-muted-foreground">{cls.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{cls.subject}</p>
                <p className="text-xs text-muted-foreground">{cls.room} · {cls.type === "lab" ? "Lab" : "Theory"}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
