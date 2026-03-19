import { useState, useEffect } from "react";
import { Brain, Sparkles, Calendar, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ClassOption {
  id: string;
  name: string;
  schedule_days: number | null;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

export default function GenerateSchedulePage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    supabase.from("classes").select("id, name, schedule_days").then(({ data }) => {
      if (data) setClasses(data as ClassOption[]);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first.");
      return;
    }
    setGenerating(true);

    // Simulate AI schedule generation
    await new Promise(r => setTimeout(r, 3000));

    const cls = classes.find(c => c.id === selectedClass);
    const days = cls?.schedule_days || 5;
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Generate mock schedule entries
    const entries: any[] = [];
    for (let d = 1; d <= days; d++) {
      for (const slot of timeSlots) {
        if (slot === "12:00 PM") continue; // lunch break
        if (Math.random() > 0.7) continue; // some free periods
        entries.push({
          class_id: selectedClass,
          day_of_week: d,
          time_slot: slot,
          room: `R${100 + Math.floor(Math.random() * 300)}`,
          status: "scheduled",
        });
      }
    }

    // Delete old schedules for this class
    await supabase.from("schedules").delete().eq("class_id", selectedClass);

    if (entries.length > 0) {
      const { error } = await supabase.from("schedules").insert(entries);
      if (error) {
        toast.error("Failed to save schedule: " + error.message);
      } else {
        toast.success(`Schedule generated! ${entries.length} slots created.`);
        setGenerated(true);
      }
    }

    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Generate Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered timetable generation for your classes.</p>
      </div>

      <div className="glass-card p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold heading-display">AI Schedule Generator</h3>
            <p className="text-xs text-muted-foreground">Select a class and generate an optimized timetable.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Class</Label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="flex h-10 w-full appearance-none rounded-lg border border-input bg-background/60 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose a class...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.schedule_days || 5}-day)</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedClass}
            className="w-full gradient-primary text-primary-foreground"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AI is optimizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Schedule
              </>
            )}
          </Button>
        </div>

        {generated && (
          <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20 slide-up">
            <p className="text-sm font-medium text-success">✅ Schedule generated successfully!</p>
            <p className="text-xs text-muted-foreground mt-1">View it on the Timetable page. Staff can now choose their preferred slots.</p>
          </div>
        )}
      </div>
    </div>
  );
}
