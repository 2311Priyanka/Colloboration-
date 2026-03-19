import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";

const mockLogs = [
  { staff: "Dr. Kumar", subject: "Data Structures", class: "CSE-A", time: "9:00 AM", date: "Mar 18", status: "taken" as const },
  { staff: "Prof. Sharma", subject: "AI Lab", class: "CSE-B", time: "10:00 AM", date: "Mar 18", status: "taken" as const },
  { staff: "Dr. Patel", subject: "DBMS", class: "IT-A", time: "1:00 PM", date: "Mar 18", status: "pending" as const },
  { staff: "Prof. Singh", subject: "OS", class: "CSE-A", time: "3:00 PM", date: "Mar 18", status: "missed" as const },
  { staff: "Dr. Reddy", subject: "CN", class: "CSE-B", time: "2:00 PM", date: "Mar 17", status: "taken" as const },
  { staff: "Dr. Kumar", subject: "Algorithms", class: "IT-A", time: "11:00 AM", date: "Mar 17", status: "taken" as const },
];

const statusConfig = {
  taken: { label: "Taken", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { label: "Pending", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  missed: { label: "Missed", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function ClassLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Class Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Track class attendance and completion status.</p>
      </div>

      <div className="space-y-3">
        {mockLogs.map((log, i) => {
          const config = statusConfig[log.status];
          return (
            <div key={i} className="glass-card-hover p-4 flex items-center gap-4 swipe-card" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                <config.icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{log.staff}</p>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground">{log.subject}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{log.class} · {log.time} · {log.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
