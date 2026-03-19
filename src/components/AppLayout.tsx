import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookPlus,
  MessageSquare,
  LogOut,
  Brain,
  Menu,
  X,
  Bell,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const roleNavItems = {
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Manage Classes", url: "/manage-classes", icon: BookPlus },
    { title: "Manage Staff", url: "/manage-staff", icon: Users },
    { title: "Generate Schedule", url: "/generate-schedule", icon: Calendar },
    { title: "Timetable", url: "/timetable", icon: ClipboardList },
  ],
  hod: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Class Logs", url: "/class-logs", icon: ClipboardList },
    { title: "Staff Performance", url: "/staff-performance", icon: BarChart3 },
    { title: "Feedback Forms", url: "/feedback-forms", icon: MessageSquare },
    { title: "Timetable", url: "/timetable", icon: Calendar },
  ],
  staff: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Schedule", url: "/timetable", icon: Calendar },
    { title: "Choose Classes", url: "/choose-classes", icon: BookPlus },
    { title: "Feedback", url: "/feedback", icon: MessageSquare },
  ],
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, role, profile, loading } = useAuth();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = roleNavItems[role || "staff"] || roleNavItems.staff;

  const roleLabel = role === "admin" ? "Administrator" : role === "hod" ? "Head of Dept" : "Faculty";
  const roleColor = role === "admin" ? "bg-primary/15 text-primary" : role === "hod" ? "bg-accent/15 text-accent" : "bg-success/15 text-success";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col glass transition-all duration-300 ${
          sidebarOpen ? "w-[260px]" : isMobile ? "w-0 overflow-hidden" : "w-16 overflow-hidden"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <h1 className="text-sm font-bold text-sidebar-foreground heading-display tracking-tight">CSCAS</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Smart Scheduling</p>
            </div>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-border/50 fade-in">
            <p className="text-xs text-muted-foreground truncate">{profile?.full_name || "User"}</p>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColor}`}>
              {roleLabel}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                activeClassName=""
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="fade-in">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border/50 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 min-w-0 ${
          sidebarOpen && !isMobile ? "lg:ml-[260px]" : !isMobile ? "lg:ml-16" : ""
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 glass px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            {sidebarOpen && isMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <LiveClock />
        </header>

        <div className="p-4 lg:p-6 fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xs font-medium text-muted-foreground tabular-nums hidden sm:block">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      <span className="ml-2 text-muted-foreground/60">
        {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}
