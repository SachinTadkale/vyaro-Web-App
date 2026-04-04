import { Routes, Route, Navigate } from "react-router-dom";
import EntryPage from "@/features/entry/entryPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import AdminLogin from "@/features/auth/pages/AdminLogin";
import AdminDashboard from "@/features/dashboard/admin/pages/AdminDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageNotFound from "@/app/routes/NotFound";

import CompanyDashboard from "@/features/dashboard/company/pages/CompanyDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/dashboard/company" element={<DashboardLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path=":tab" element={<CompanyDashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
