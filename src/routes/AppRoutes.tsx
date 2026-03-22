import { Routes, Route } from "react-router-dom";
import PageNotFound from "@/pages/Page_Not_Found/Page_Not_Found";
import AuthPage from "@/pages/auth/AuthPage";
import AdminLogin from "@/pages/auth/AdminLogin";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* Auth */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
