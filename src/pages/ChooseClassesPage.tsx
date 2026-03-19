import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Mock data - in production, this comes from schedules table
const classOptions = [
  {
    day: "Monday",
    time: "9:00 AM",
    options: [
      { id: "1", subject: "Data Structures", room: "R101", class: "CSE-A" },
      { id: "2", subject: "Algorithms", room: "R205", class: "CSE-B" },
    ],
  },
  {
    day: "Monday",
    time: "1:00 PM",
    options: [
      { id: "3", subject: "DBMS", room: "R202", class: "CSE-A" },
      { id: "4", subject: "OS", room: "R301", class: "IT-A" },
    ],
  },
  {
    day: "Tuesday",
    time: "10:00 AM",
    options: [
      { id: "5", subject: "AI Lab", room: "Lab 3", class: "CSE-A" },
      { id: "6", subject: "ML Lab", room: "Lab 4", class: "CSE-B" },
    ],
  },
  {
    day: "Wednesday",
    time: "2:00 PM",
    options: [
      { id: "7", subject: "Computer Networks", room: "R301", class: "IT-A" },
    ],
  },
];

export default function ChooseClassesPage() {
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const handleChoose = (slotKey: string, optionId: string) => {
    setChosen(prev => ({ ...prev, [slotKey]: optionId }));
    toast.success("Class selected!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Choose Your Classes</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick your preferred class for each available slot.</p>
      </div>

      <div className="space-y-4">
        {classOptions.map((slot, i) => {
          const slotKey = `${slot.day}-${slot.time}`;
          return (
            <div key={i} className="glass-card p-5 slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{slot.day}</span>
                <span className="text-xs text-muted-foreground">{slot.time}</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {slot.options.map((opt) => {
                  const isChosen = chosen[slotKey] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleChoose(slotKey, opt.id)}
                      className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all swipe-card ${
                        isChosen
                          ? "bg-primary/10 border-2 border-primary shadow-md"
                          : "border border-border/50 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{opt.subject}</p>
                        <p className="text-xs text-muted-foreground">{opt.room} · {opt.class}</p>
                      </div>
                      {isChosen ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
