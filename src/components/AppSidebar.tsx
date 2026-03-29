import { useAuth } from '@/lib/auth-context';
import { ClassSyncLogo } from './ClassSyncLogo';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard, Calendar, Users, BookOpen, MessageSquare,
  Bell, Settings, LogOut, BarChart3, UserCheck, AlertTriangle,
  QrCode, FileText, Heart
} from 'lucide-react';

const hodNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Timetable', url: '/timetable', icon: Calendar },
  { title: 'Staff', url: '/staff', icon: Users },
  { title: 'Classes', url: '/classes', icon: BookOpen },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
  { title: 'Burnout Monitor', url: '/burnout', icon: Heart },
  { title: 'Occupancy', url: '/occupancy', icon: UserCheck },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const staffNav = [
  { title: 'My Schedule', url: '/dashboard', icon: Calendar },
  { title: 'My Subjects', url: '/subjects', icon: BookOpen },
  { title: 'Attendance', url: '/attendance', icon: QrCode },
  { title: 'Class Notes', url: '/notes', icon: FileText },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const studentNav = [
  { title: 'My Timetable', url: '/dashboard', icon: Calendar },
  { title: 'Attendance', url: '/attendance', icon: UserCheck },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const navItems = user.role === 'hod' ? hodNav : user.role === 'staff' ? staffNav : studentNav;

  return (
    <aside className="w-64 min-h-screen flex flex-col gradient-hero text-sidebar-foreground">
      <div className="p-5 border-b border-sidebar-border">
        <ClassSyncLogo size="md" />
      </div>

      <div className="px-4 py-3 border-b border-sidebar-border">
        <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
          {user.role === 'hod' ? 'Head of Department' : user.role === 'staff' ? 'Faculty' : 'Student'}
        </p>
        <p className="text-sm font-semibold truncate mt-0.5">{user.name}</p>
        <p className="text-xs text-sidebar-foreground/60">{user.department}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/dashboard'}
            className="nav-item text-sidebar-foreground/80"
            activeClassName="active bg-sidebar-accent text-sidebar-primary"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="nav-item w-full text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
