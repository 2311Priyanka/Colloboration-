import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { AppLayout } from "@/components/layout";
import { UserRole } from "@workspace/api-client-react";

// Auth
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// Staff
import StaffDashboard from "@/pages/staff/dashboard";
import StaffSubjects from "@/pages/staff/subjects";
import StaffQR from "@/pages/staff/qr";
import StaffNotes from "@/pages/staff/notes";
import StaffStudents from "@/pages/staff/students";

// HOD
import HodDashboard from "@/pages/hod/dashboard";
import HodStaff from "@/pages/hod/staff";
import HodTimetable from "@/pages/hod/timetable";

// Student
import StudentDashboard from "@/pages/student/dashboard";
import StudentScan from "@/pages/student/scan";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, allowedRole, ...rest }: any) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Redirect to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Redirect to="/" />;
  
  return <Component {...rest} />;
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  if (user.role === UserRole.STAFF) return <Redirect to="/staff" />;
  if (user.role === UserRole.HOD) return <Redirect to="/hod" />;
  if (user.role === UserRole.STUDENT) return <Redirect to="/student" />;
  return <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/">
        <RootRedirect />
      </Route>

      <Route path="/staff*">
        <AppLayout>
          <Switch>
            <Route path="/staff"><ProtectedRoute component={StaffDashboard} allowedRole={UserRole.STAFF} /></Route>
            <Route path="/staff/subjects"><ProtectedRoute component={StaffSubjects} allowedRole={UserRole.STAFF} /></Route>
            <Route path="/staff/qr"><ProtectedRoute component={StaffQR} allowedRole={UserRole.STAFF} /></Route>
            <Route path="/staff/notes"><ProtectedRoute component={StaffNotes} allowedRole={UserRole.STAFF} /></Route>
            <Route path="/staff/availability"><ProtectedRoute component={() => <div>Availability Page Coming Soon</div>} allowedRole={UserRole.STAFF} /></Route>
            <Route path="/staff/students"><ProtectedRoute component={StaffStudents} allowedRole={UserRole.STAFF} /></Route>
          </Switch>
        </AppLayout>
      </Route>

      <Route path="/hod*">
        <AppLayout>
          <Switch>
            <Route path="/hod"><ProtectedRoute component={HodDashboard} allowedRole={UserRole.HOD} /></Route>
            <Route path="/hod/staff"><ProtectedRoute component={HodStaff} allowedRole={UserRole.HOD} /></Route>
            <Route path="/hod/timetable"><ProtectedRoute component={HodTimetable} allowedRole={UserRole.HOD} /></Route>
            <Route path="/hod/classes"><ProtectedRoute component={() => <div>Classes Management</div>} allowedRole={UserRole.HOD} /></Route>
            <Route path="/hod/feedback"><ProtectedRoute component={() => <div>Feedback Management</div>} allowedRole={UserRole.HOD} /></Route>
            <Route path="/hod/analytics"><ProtectedRoute component={() => <div>Deep Analytics</div>} allowedRole={UserRole.HOD} /></Route>
          </Switch>
        </AppLayout>
      </Route>

      <Route path="/student*">
        <AppLayout>
          <Switch>
            <Route path="/student"><ProtectedRoute component={StudentDashboard} allowedRole={UserRole.STUDENT} /></Route>
            <Route path="/student/scan"><ProtectedRoute component={StudentScan} allowedRole={UserRole.STUDENT} /></Route>
            <Route path="/student/attendance"><ProtectedRoute component={() => <div>Attendance History</div>} allowedRole={UserRole.STUDENT} /></Route>
            <Route path="/student/feedback"><ProtectedRoute component={() => <div>Submit Feedback</div>} allowedRole={UserRole.STUDENT} /></Route>
            <Route path="/student/notifications"><ProtectedRoute component={() => <div>Notifications</div>} allowedRole={UserRole.STUDENT} /></Route>
          </Switch>
        </AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
