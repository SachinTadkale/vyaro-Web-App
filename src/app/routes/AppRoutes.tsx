import { Routes, Route, Navigate } from "react-router-dom";
import EntryPage from "@/features/entry/entryPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageNotFound from "@/app/routes/NotFound";

// Company Pages
import CompanyDashboard from "@/features/dashboard/company/pages/CompanyDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<EntryPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* DASHBOARD ROUTES */}
      <Route path="/dashboard/company" element={<DashboardLayout role="COMPANY" />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path=":tab" element={<CompanyDashboard />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
