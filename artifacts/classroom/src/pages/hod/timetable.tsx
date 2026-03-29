import { useState } from "react";
import { useGetClasses, useGetTimetable, useGenerateTimetable } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export default function HodTimetable() {
  const { data: classes } = useGetClasses();
  const [selectedClass, setSelectedClass] = useState<string>("");
  
  const { data: timetable, isLoading, refetch } = useGetTimetable(selectedClass, {
    query: { enabled: !!selectedClass }
  });

  const { toast } = useToast();
  
  const generateMut = useGenerateTimetable({
    mutation: {
      onSuccess: () => {
        toast({ title: "Timetable generated successfully", description: "AI optimization applied." });
        refetch();
      }
    }
  });

  const handleGenerate = () => {
    if (!selectedClass) return;
    generateMut.mutate({
      classId: selectedClass,
      data: {
        labStartTime: "14:00",
        labEndTime: "17:00",
        maxContinuousHours: 2
      }
    });
  };

  const getSlot = (day: string, time: string) => {
    if (!timetable?.slots) return null;
    return timetable.slots.find(s => s.day === day && s.startTime.startsWith(time.split(':')[0]));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Timetable Management</h1>
          <p className="text-muted-foreground mt-1">View and generate AI-optimized schedules</p>
        </div>
        <div className="flex items-end gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Label className="mb-2 block">Select Class</Label>
            <select 
              className="flex h-11 w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
              value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="">-- Select --</option>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedClass || generateMut.isPending}
            className="shrink-0 h-11"
          >
            {generateMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Wand2 className="w-4 h-4 mr-2"/>}
            Auto-Generate
          </Button>
        </div>
      </div>

      {!selectedClass ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <Calendar className="w-16 h-16 opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-foreground">No Class Selected</h3>
            <p>Select a class to view its timetable or generate a new one.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-6 bg-muted/50 border-b border-border divide-x divide-border">
              <div className="p-4 text-center font-bold text-sm text-muted-foreground uppercase tracking-wider">Time</div>
              {DAYS.map(day => (
                <div key={day} className="p-4 text-center font-bold text-sm text-foreground">{day}</div>
              ))}
            </div>
            
            {/* Time Rows */}
            <div className="divide-y divide-border">
              {TIME_SLOTS.map(time => (
                <div key={time} className="grid grid-cols-6 divide-x divide-border">
                  <div className="p-4 flex items-center justify-center font-mono text-sm text-muted-foreground bg-muted/10">
                    {time}
                  </div>
                  {DAYS.map(day => {
                    const slot = getSlot(day, time);
                    return (
                      <div key={`${day}-${time}`} className="p-3 min-h-[100px] flex flex-col justify-center bg-card hover:bg-muted/20 transition-colors">
                        {slot ? (
                          <div className={`p-3 rounded-xl border ${slot.subjectType === 'LAB' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-primary/5 border-primary/20'} h-full flex flex-col justify-center`}>
                            <div className="font-bold text-sm text-foreground truncate">{slot.subjectName}</div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">{slot.staffName}</div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border">{slot.room}</span>
                              {slot.subjectType === 'LAB' && <span className="text-[10px] font-bold text-yellow-600">LAB</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground"><Plus className="w-3 h-3 mr-1"/> Add</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
