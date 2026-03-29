import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/store/useAuthStore";
import { cn } from "@/utils/utils";

type Props = {
  role: string;
  user: User | null;
};

const Navbar = ({ role, user }: Props) => {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("overview")) return "Platform Insights";
    if (path.includes("kyc")) return "KYC Requests";
    if (path.includes("users")) return "Farmer Management";
    if (path.includes("companies")) return "Company Management";
    if (path.includes("leads")) return "Leads & Inquiries";
    if (path.includes("marketplace")) return "Marketplace";
    if (path.includes("products")) return "My Products";
    if (path.includes("notifications")) return "Notifications";
    if (path.includes("profile")) return "Account Settings";
    if (path.includes("dashboard")) return "Dashboard Overview";
    return "Dashboard";
  };

  const getSubtitle = () => {
    const path = location.pathname;
    const isAdmin = role === "ADMIN";
    
    if (isAdmin) {
      if (path.includes("overview")) return "Platform Growth & Real-time Analytics";
      if (path.includes("kyc")) return "Identity Verification & Trust Compliance";
      if (path.includes("users")) return "Farmer Registry & Compliance Management";
      if (path.includes("companies")) return "B2B Entity & Organizational Controls";
      if (path.includes("leads")) return "Market Demand & Signalling Signals";
      return "Platform Control Center";
    }

    if (path.includes("overview")) return "Business Intelligence Dashboard";
    if (path.includes("marketplace")) return "Global Commodity Trading Floor";
    if (path.includes("products")) return "Inventory & SKU Performance";
    return "FarmZy Business Console";
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between transition-colors duration-200">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-normal text-foreground transition-all duration-200 uppercase tracking-widest">
          {getTitle()}
        </h1>
        <p className="text-[10px] text-muted-foreground font-normal uppercase tracking-tight opacity-60">
          {getSubtitle()}
        </p>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className={cn(
            "relative w-9 h-9 rounded-lg flex items-center justify-center transition-all",
            "bg-muted/30 text-muted-foreground/60 hover:bg-muted hover:text-foreground border border-transparent hover:border-border/50"
          )}
        >
          <FontAwesomeIcon icon={faBell} size="sm" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/30 border border-transparent hover:border-border/50 transition-all cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-normal text-foreground leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[9px] text-muted-foreground font-normal uppercase tracking-tighter opacity-60">
              {user?.email || "user@farmzy.com"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary/60 border border-primary/10">
            <FontAwesomeIcon icon={faUserCircle} size="lg" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
