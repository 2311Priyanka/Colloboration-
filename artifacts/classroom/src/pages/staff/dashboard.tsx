import { useAuth } from "@/contexts/auth-context";
import { useGetStaffTimetable, useGetSubjects } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO, isAfter, isBefore } from "date-fns";

export default function StaffDashboard() {
  const { user } = useAuth();
  const { data: timetable, isLoading: loadingTimetable } = useGetStaffTimetable();
  const { data: subjects, isLoading: loadingSubjects } = useGetSubjects();

  const todayStr = format(new Date(), 'EEEE').toUpperCase();
  const todaysClasses = timetable?.filter(t => t.day === todayStr) || [];
  
  // Naive next class logic
  const nextClass = todaysClasses.find(c => {
    const [hours, minutes] = c.startTime.split(':').map(Number);
    const classTime = new Date();
    classTime.setHours(hours, minutes, 0);
    return isAfter(classTime, new Date());
  }) || todaysClasses[0]; // fallback to first class if all done or none found

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1 text-lg">Here's your teaching overview for today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/staff/qr">
            <button className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
              Generate Attendance QR
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl shadow-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-white/90 text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextClass ? (
              <>
                <div className="text-3xl font-bold font-display">{nextClass.startTime}</div>
                <div className="text-white/80 mt-1 font-medium">{nextClass.subjectName} ({nextClass.subjectCode})</div>
                <div className="text-white/60 text-sm mt-1">Room: {nextClass.room} • {nextClass.className}</div>
              </>
            ) : (
              <div className="text-xl font-medium text-white/80">No more classes today.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> My Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-display text-foreground">
              {loadingSubjects ? "-" : subjects?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Active courses this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Weekly Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-display text-foreground">
              {timetable?.length ? timetable.length * 1 : 0} <span className="text-lg text-muted-foreground font-normal">hrs</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Based on allocated timetable</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-display">Today's Schedule</h2>
          <Link href="/staff/availability" className="text-sm font-medium text-primary hover:underline flex items-center">
            Mark Unavailable <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <Card>
          <div className="divide-y divide-border/50">
            {loadingTimetable ? (
              <div className="p-8 text-center text-muted-foreground">Loading schedule...</div>
            ) : todaysClasses.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <CalendarIcon className="w-12 h-12 text-muted mb-3" />
                <p>You have no classes scheduled for today.</p>
              </div>
            ) : (
              todaysClasses.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((slot, i) => (
                <div key={i} className="p-5 flex items-center gap-6 hover:bg-muted/30 transition-colors">
                  <div className="w-24 shrink-0 text-center">
                    <div className="text-lg font-bold text-foreground">{slot.startTime}</div>
                    <div className="text-xs text-muted-foreground">{slot.endTime}</div>
                  </div>
                  <div className="w-1 h-12 bg-primary/20 rounded-full shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{slot.subjectName}</h3>
                    <p className="text-sm text-muted-foreground">Class: {slot.className} • Room: {slot.room}</p>
                  </div>
                  <div>
                    <Badge variant={slot.subjectType === 'LAB' ? 'warning' : 'secondary'}>{slot.subjectType}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
