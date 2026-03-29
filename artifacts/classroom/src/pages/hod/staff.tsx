import { useGetAllBurnout, useGetAllStaff } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, AlertCircle } from "lucide-react";

export default function HodStaffList() {
  const { data: staffList, isLoading } = useGetAllStaff();

  const getRiskBadge = (score: number = 0) => {
    if (score > 60) return <Badge variant="destructive" className="animate-pulse">High Risk ({score})</Badge>;
    if (score > 30) return <Badge variant="warning">Med Risk ({score})</Badge>;
    return <Badge variant="success">Low Risk ({score})</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Department Staff</h1>
        <p className="text-muted-foreground mt-1">Monitor workload and AI-calculated burnout risks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">Loading staff data...</div>
        ) : (
          staffList?.map((staff) => (
            <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 w-full bg-primary/10">
                <div 
                  className={`h-full ${
                    (staff.burnoutScore||0) > 60 ? 'bg-destructive' : (staff.burnoutScore||0) > 30 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${Math.min(staff.burnoutScore||0, 100)}%` }}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-xl text-secondary-foreground">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{staff.designation || 'Faculty'}</p>
                    </div>
                  </div>
                  {getRiskBadge(staff.burnoutScore)}
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2 opacity-70" /> {staff.email}
                  </div>
                  {staff.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2 opacity-70" /> {staff.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm font-medium text-foreground bg-muted/50 p-2 rounded-lg mt-2">
                    <Clock className="w-4 h-4 mr-2 text-primary" /> 
                    {staff.weeklyHours || 0} Hours Allocated This Week
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
