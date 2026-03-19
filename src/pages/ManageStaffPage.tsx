import { useState, useEffect } from "react";
import { Search, Users, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface StaffProfile {
  user_id: string;
  full_name: string;
  email: string | null;
  department: string | null;
}

export default function ManageStaffPage() {
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "staff");
      if (!roles?.length) return;
      const staffIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, department").in("user_id", staffIds);
      if (profiles) setStaff(profiles as StaffProfile[]);
    };
    fetchStaff();
  }, []);

  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

  const filtered = staff.filter(s => {
    const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || s.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold heading-display gradient-text">Manage Staff</h1>
        <p className="text-sm text-muted-foreground mt-1">View and assign registered staff members.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 glass" />
        </div>
        {departments.length > 0 && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="h-10 pl-10 pr-8 appearance-none rounded-lg border border-input bg-background/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d!}>{d}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.user_id} className="glass-card-hover p-5 swipe-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {s.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{s.full_name || "Unnamed"}</p>
                <p className="text-xs text-muted-foreground truncate">{s.email}</p>
              </div>
            </div>
            {s.department && (
              <span className="inline-block mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {s.department}
              </span>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No staff registered yet.</p>
            <p className="text-xs text-muted-foreground">Staff will appear here after they sign up.</p>
          </div>
        )}
      </div>
    </div>
  );
}
