import { useState, useEffect } from "react";
import { BookPlus, ChevronDown, Search, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ClassItem {
  id: string;
  name: string;
  department: string | null;
  semester: number | null;
  section: string | null;
  student_count: number | null;
  schedule_days: number | null;
  lunch_break_start: string | null;
  lunch_break_end: string | null;
  tea_break_start: string | null;
  tea_break_end: string | null;
}

export default function ManageClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", department: "", semester: "1", section: "A",
    student_count: "60", schedule_days: "5",
    lunch_break_start: "12:00 PM", lunch_break_end: "1:00 PM",
    tea_break_start: "3:00 PM", tea_break_end: "3:15 PM",
  });

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*").order("created_at", { ascending: false });
    if (data) setClasses(data as ClassItem[]);
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("classes").insert({
      name: form.name,
      department: form.department,
      semester: parseInt(form.semester),
      section: form.section,
      student_count: parseInt(form.student_count),
      schedule_days: parseInt(form.schedule_days),
      lunch_break_start: form.lunch_break_start,
      lunch_break_end: form.lunch_break_end,
      tea_break_start: form.tea_break_start,
      tea_break_end: form.tea_break_end,
      created_by: user?.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Class "${form.name}" created!`);
      setShowForm(false);
      setForm({ name: "", department: "", semester: "1", section: "A", student_count: "60", schedule_days: "5", lunch_break_start: "12:00 PM", lunch_break_end: "1:00 PM", tea_break_start: "3:00 PM", tea_break_end: "3:15 PM" });
      fetchClasses();
    }
  };

  const deleteClass = async (id: string) => {
    await supabase.from("classes").delete().eq("id", id);
    toast.success("Class deleted");
    fetchClasses();
  };

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Manage Classes</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and configure class sections.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground">
          <BookPlus className="h-4 w-4 mr-2" /> New Class
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-6 slide-up">
          <h3 className="text-base font-semibold mb-4 heading-display">Create New Class</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input placeholder="e.g., CSE-A Sem 3" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="glass" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input placeholder="e.g., Computer Science" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Input type="number" min="1" max="8" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Input value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>Student Count</Label>
              <Input type="number" value={form.student_count} onChange={e => setForm({...form, student_count: e.target.value})} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>Schedule Days</Label>
              <div className="relative">
                <select value={form.schedule_days} onChange={e => setForm({...form, schedule_days: e.target.value})} className="flex h-10 w-full appearance-none rounded-lg border border-input bg-background/60 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="5">5 Days (Mon–Fri)</option>
                  <option value="6">6 Days (Mon–Sat)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lunch Break</Label>
              <div className="flex gap-2">
                <Input value={form.lunch_break_start} onChange={e => setForm({...form, lunch_break_start: e.target.value})} placeholder="Start" className="glass" />
                <Input value={form.lunch_break_end} onChange={e => setForm({...form, lunch_break_end: e.target.value})} placeholder="End" className="glass" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tea Break</Label>
              <div className="flex gap-2">
                <Input value={form.tea_break_start} onChange={e => setForm({...form, tea_break_start: e.target.value})} placeholder="Start" className="glass" />
                <Input value={form.tea_break_end} onChange={e => setForm({...form, tea_break_end: e.target.value})} placeholder="End" className="glass" />
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" className="gradient-primary text-primary-foreground">Create Class</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 glass" />
      </div>

      {/* Class List */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cls) => (
          <div key={cls.id} className="glass-card-hover p-5 swipe-card">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{cls.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{cls.department || "No dept"} · Sem {cls.semester}</p>
              </div>
              <button onClick={() => deleteClass(cls.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-3 mt-3 text-[11px] text-muted-foreground">
              <span>{cls.student_count} students</span>
              <span>Section {cls.section}</span>
              <span>{cls.schedule_days}-day week</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            No classes found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
