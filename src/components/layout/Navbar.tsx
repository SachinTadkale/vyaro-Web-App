import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@/store/useAuthStore";
import { useAuthStore } from "@/store/useAuthStore";

type Props = {
  user: User | null;
};

const Navbar = ({ user }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("overview")) return "Overview";
    if (path.includes("kyc")) return "KYC Requests";
    if (path.includes("users")) return "Farmer Management";
    if (path.includes("companies")) return "Company Management";
    if (path.includes("leads")) return "Leads";
    if (path.includes("marketplace")) return "Marketplace";
    if (path.includes("products")) return "My Products";
    if (path.includes("notifications")) return "Notifications";
    if (path.includes("profile")) return "Profile";
    if (path.includes("dashboard")) return "Dashboard";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
          {user?.email || "User"}
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 text-sm font-medium bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
