import { useGetAnalyticsOverview, useGetAllStaff } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Activity, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

export default function HodDashboard() {
  const { data: stats, isLoading } = useGetAnalyticsOverview();
  const { data: staffList } = useGetAllStaff();

  const burnoutData = [
    { name: 'Low Risk', count: staffList?.filter(s => (s.burnoutScore || 0) <= 30).length || 0, color: '#22c55e' },
    { name: 'Med Risk', count: staffList?.filter(s => (s.burnoutScore || 0) > 30 && (s.burnoutScore || 0) <= 60).length || 0, color: '#eab308' },
    { name: 'High Risk', count: staffList?.filter(s => (s.burnoutScore || 0) > 60).length || 0, color: '#ef4444' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card className="overflow-hidden relative group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none" />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-4xl font-display font-bold text-foreground">
              {isLoading ? "-" : value}
            </p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend && <div className="mt-4 text-sm text-muted-foreground">{trend}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Department Overview</h1>
        <p className="text-muted-foreground mt-1">High-level metrics and staff health</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={stats?.totalStaff} icon={Users} trend="Active department members" />
        <StatCard title="Total Classes" value={stats?.totalClasses} icon={BookOpen} trend="Across all semesters" />
        <StatCard title="Students" value={stats?.totalStudents} icon={GraduationCap} trend="Enrolled this term" />
        <StatCard 
          title="Avg Satisfaction" 
          value={`${stats?.averageSatisfaction?.toFixed(1) || 0}/5`} 
          icon={Activity} 
          trend="Based on recent feedback" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Department Burnout Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={burnoutData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {burnoutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {stats?.highRiskStaff || 0} staff members are currently at high risk.
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Staff with Highest Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {staffList?.sort((a,b) => (b.weeklyHours || 0) - (a.weeklyHours || 0)).slice(0, 5).map(staff => (
                <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.designation || 'Staff Member'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-display">{staff.weeklyHours || 0} hrs</p>
                    <p className="text-xs text-muted-foreground">this week</p>
                  </div>
                </div>
              ))}
              {!staffList?.length && <div className="text-center text-muted-foreground p-4">No staff data available.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
