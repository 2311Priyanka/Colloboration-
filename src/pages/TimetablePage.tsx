import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  time_slot: string;
  room: string | null;
  status: string | null;
  subject_id: string | null;
  staff_id: string | null;
}

export default function TimetablePage() {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    supabase.from("classes").select("id, name").then(({ data }) => {
      if (data?.length) {
        setClasses(data);
        setSelectedClass(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    supabase.from("schedules").select("*").eq("class_id", selectedClass).then(({ data }) => {
      if (data) setSchedules(data as ScheduleEntry[]);
    });
  }, [selectedClass]);

  const getEntry = (day: number, time: string) =>
    schedules.find(s => s.day_of_week === day && s.time_slot === time);

  const activeDays = classes.find(c => c.id === selectedClass) ? dayNames : dayNames.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">Weekly class schedule.</p>
        </div>
        {classes.length > 0 && (
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-primary/15 border border-primary/30" /> Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-success/15 border border-success/30" /> Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-warning/15 border border-warning/30" /> Vacant
        </span>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card/80 backdrop-blur-sm border-b border-r border-border/50 p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                  Time
                </th>
                {activeDays.map((day) => (
                  <th key={day} className="border-b border-border/50 p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, i) => (
                <tr key={time} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                  <td className="sticky left-0 z-10 bg-inherit border-r border-border/50 p-3 text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                    {time}
                  </td>
                  {activeDays.map((_, dayIdx) => {
                    const entry = getEntry(dayIdx + 1, time);
                    if (!entry) return <td key={dayIdx} className="p-2"><div className="h-10" /></td>;
                    const statusColor = entry.status === "occupied"
                      ? "bg-success/10 text-success border-success/20"
                      : entry.status === "vacant"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-primary/10 text-primary border-primary/20";
                    return (
                      <td key={dayIdx} className="p-2">
                        <div className={`rounded-xl px-3 py-2 text-xs font-medium border ${statusColor}`}>
                          <p className="font-semibold">{entry.room || "TBD"}</p>
                          <p className="mt-0.5 opacity-70 text-[10px] capitalize">{entry.status}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No schedule generated yet for this class.
        </div>
      )}
    </div>
  );
}
