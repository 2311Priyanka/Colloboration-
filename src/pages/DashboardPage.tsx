import { useAuth } from '@/lib/auth-context';
import { Navigate } from 'react-router-dom';
import HodDashboard from './HodDashboard';
import StaffDashboard from './StaffDashboard';
import StudentDashboard from './StudentDashboard';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (user?.role === 'hod') return <HodDashboard />;
  if (user?.role === 'staff') return <StaffDashboard />;
  return <StudentDashboard />;
}
