import { Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Home from "@/pages/Public/Home/Home";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/choose-role" element={<ChooseRole />} /> */}

      {/* Fallback */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-xl">
            Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;