import { Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Home from "@/pages/Public/Home/Home";
import PageNotFound from "@/pages/Page_Not_Found/Page_Not_Found";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/choose-role" element={<ChooseRole />} /> */}

      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
