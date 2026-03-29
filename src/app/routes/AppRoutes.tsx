import { Routes, Route, Navigate } from "react-router-dom";
import EntryPage from "@/features/entry/entryPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import AdminLogin from "@/features/auth/pages/AdminLogin";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageNotFound from "@/app/routes/NotFound";

// Admin Pages
import AdminDashboard from "@/features/dashboard/admin/pages/AdminDashboard";
import KycPage from "@/features/dashboard/admin/pages/KycPage";
import UsersPage from "@/features/dashboard/admin/pages/UsersPage";
import CompaniesPage from "@/features/dashboard/admin/pages/CompaniesPage";
import LeadsPage from "@/features/dashboard/admin/pages/LeadsPage";

// Company Pages
import CompanyDashboard from "@/features/dashboard/company/pages/CompanyDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<EntryPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* DASHBOARD ROOT (Role Protected) */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute allowedRoles={["ADMIN", "COMPANY"]} />}
      >
        {/* ADMIN AREA */}
        <Route path="admin" element={<DashboardLayout role="ADMIN" />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminDashboard />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="leads" element={<LeadsPage />} />
        </Route>

        {/* COMPANY AREA */}
        <Route path="company" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path=":tab" element={<CompanyDashboard />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
