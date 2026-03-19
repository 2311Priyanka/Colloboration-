import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TimetablePage from "./pages/TimetablePage";
import ManageClassesPage from "./pages/ManageClassesPage";
import ManageStaffPage from "./pages/ManageStaffPage";
import GenerateSchedulePage from "./pages/GenerateSchedulePage";
import ChooseClassesPage from "./pages/ChooseClassesPage";
import FeedbackPage from "./pages/FeedbackPage";
import ClassLogsPage from "./pages/ClassLogsPage";
import StaffPerformancePage from "./pages/StaffPerformancePage";
import FeedbackFormsPage from "./pages/FeedbackFormsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/manage-classes" element={<ManageClassesPage />} />
              <Route path="/manage-staff" element={<ManageStaffPage />} />
              <Route path="/generate-schedule" element={<GenerateSchedulePage />} />
              <Route path="/choose-classes" element={<ChooseClassesPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/class-logs" element={<ClassLogsPage />} />
              <Route path="/staff-performance" element={<StaffPerformancePage />} />
              <Route path="/feedback-forms" element={<FeedbackFormsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
