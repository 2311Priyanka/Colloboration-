import { useAuth } from "@/contexts/auth-context";
import { useGetStudentClass, useGetTimetable, useGetNotifications } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bell, QrCode } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: myClass, isLoading: classLoading } = useGetStudentClass();
  const { data: timetable } = useGetTimetable(myClass?.id || "", { query: { enabled: !!myClass?.id } });
  const { data: notifications } = useGetNotifications();

  const todayStr = format(new Date(), 'EEEE').toUpperCase();
  const todaysClasses = timetable?.slots?.filter(t => t.day === todayStr) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-gradient-to-r from-primary to-accent rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
        <div>
          <h1 className="text-3xl font-display font-bold">Hello, {user?.name.split(' ')[0]} 🎓</h1>
          <p className="text-white/80 mt-2 text-lg">
            {classLoading ? "Loading class..." : myClass ? `${myClass.name} • ${myClass.department} Dept` : "You haven't joined a class yet."}
          </p>
        </div>
        <Link href="/student/scan">
          <button className="px-6 py-3 bg-white text-primary rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Scan Attendance
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysClasses.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border/50">
                    No classes scheduled for today. Enjoy your free time!
                  </div>
                ) : (
                  todaysClasses.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((slot, i) => (
                    <div key={i} className="flex p-4 border border-border/50 rounded-xl hover:border-primary/30 transition-colors bg-card">
                      <div className="w-20 shrink-0 font-bold font-display text-primary">{slot.startTime}</div>
                      <div className="flex-1 px-4 border-l border-border">
                        <p className="font-semibold text-foreground">{slot.subjectName}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Prof. {slot.staffName}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-mono bg-muted px-2 py-1 rounded">{slot.room}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /> Recent Updates</div>
                <Link href="/student/notifications" className="text-sm text-primary font-normal hover:underline">View all</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications?.slice(0, 4).map(notif => (
                  <div key={notif.id} className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-accent shrink-0" />
                    <div>
                      <p className="text-sm text-foreground leading-snug">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(notif.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
                {!notifications?.length && <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
