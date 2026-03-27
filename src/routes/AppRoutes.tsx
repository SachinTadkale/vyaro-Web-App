import { Routes, Route } from "react-router-dom";
import PageNotFound from "@/pages/Page_Not_Found/Page_Not_Found";
import AuthPage from "@/modules/auth/pages/AuthPage";
import AdminLogin from "@/modules/auth/pages/AdminLogin";
import EntryPage from "@/pages/entry";
import AdminDashboard from "@/modules/admin/pages/AdminDashboard";
import CompanyDashboard from "@/modules/company/pages/CompanyDashboard";
import AdminLayout from "@/layouts/AdminLayout";
import KycPage from "@/modules/admin/pages/KycPage";
import UsersPage from "@/modules/admin/pages/UsersPage";
import CompaniesPage from "@/modules/admin/pages/CompaniesPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<EntryPage />} />
      {/* Auth */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Dashboard */}
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="kyc" element={<KycPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="companies" element={<CompaniesPage />} />
      </Route>

      <Route path="/company/dashboard" element={<CompanyDashboard />} />
      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
