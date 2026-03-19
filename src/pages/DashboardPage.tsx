import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import HodDashboard from "@/components/dashboards/HodDashboard";
import StaffDashboard from "@/components/dashboards/StaffDashboard";

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === "admin") return <AdminDashboard />;
  if (role === "hod") return <HodDashboard />;
  return <StaffDashboard />;
}
