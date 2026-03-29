import { Outlet } from "react-router-dom";
// import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  allowedRoles: ("ADMIN" | "COMPANY" | "FARMER")[];
}

const ProtectedRoute = ({ allowedRoles: _allowedRoles }: Props) => {
  // const { user, isAuthenticated } = useAuthStore();

  /* TEMPORARILY DISABLED FOR TESTING */
  /*
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "ADMIN" ? "/dashboard/admin/overview" : "/dashboard/company/overview";
    return <Navigate to={redirectPath} replace />;
  }
  */

  return <Outlet />;
};

export default ProtectedRoute;

