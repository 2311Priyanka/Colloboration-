import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, BookOpen, QrCode, ClipboardList, CalendarOff, 
  Users, CalendarDays, MessageSquare, BarChart3, ScanLine, 
  Bell, LogOut, Menu, X, GraduationCap
} from "lucide-react";
import { UserRole } from "@workspace/api-client-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const getLinks = () => {
    switch (user.role) {
      case UserRole.STAFF:
        return [
          { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
          { href: "/staff/subjects", label: "Subjects", icon: BookOpen },
          { href: "/staff/qr", label: "QR Generator", icon: QrCode },
          { href: "/staff/notes", label: "Class Notes", icon: ClipboardList },
          { href: "/staff/students", label: "Students", icon: GraduationCap },
          { href: "/staff/availability", label: "Availability", icon: CalendarOff },
        ];
      case UserRole.HOD:
        return [
          { href: "/hod", label: "Overview", icon: LayoutDashboard },
          { href: "/hod/classes", label: "Classes", icon: BookOpen },
          { href: "/hod/staff", label: "Staff List", icon: Users },
          { href: "/hod/timetable", label: "Timetable", icon: CalendarDays },
          { href: "/hod/feedback", label: "Feedback", icon: MessageSquare },
          { href: "/hod/analytics", label: "Analytics", icon: BarChart3 },
        ];
      case UserRole.STUDENT:
        return [
          { href: "/student", label: "Dashboard", icon: LayoutDashboard },
          { href: "/student/attendance", label: "Attendance", icon: ClipboardList },
          { href: "/student/scan", label: "Scan QR", icon: ScanLine },
          { href: "/student/feedback", label: "Feedback", icon: MessageSquare },
          { href: "/student/notifications", label: "Notifications", icon: Bell },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border shadow-xl shadow-black/5 z-20 w-64">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
            SC
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">SmartClass</h1>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-sm text-destructive hover:bg-destructive/10 py-2.5 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full relative z-20">
        <SidebarContent />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/dashboard-pattern.png)`, backgroundSize: '400px' }}
        />
        
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <button 
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <Link href={`/${user.role.toLowerCase()}/notifications`}>
              <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
              </button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
