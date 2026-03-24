import { Routes, Route } from "react-router-dom";
import PageNotFound from "@/pages/Page_Not_Found/Page_Not_Found";
import AuthPage from "@/pages/auth/AuthPage";
import AdminLogin from "@/pages/auth/AdminLogin";
import EntryPage from "@/pages/entry";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CompanyDashboard from "@/pages/company/CompanyDashboard";

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
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/company/dashboard" element={<CompanyDashboard />} />
      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
