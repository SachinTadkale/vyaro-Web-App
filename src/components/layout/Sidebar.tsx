import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faFileCircleCheck,
  faBuilding,
  faRightFromBracket,
  faSun,
  faMoon,
  faSeedling,
  faStore,
  faBoxes,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/utils";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  role: string;
};

const Sidebar = ({ role }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const adminMenu = [
    { name: "Dashboard", path: "/dashboard/admin/overview", icon: faChartLine },
    { name: "KYC Requests", path: "/dashboard/admin/kyc", icon: faFileCircleCheck },
    { name: "Farmers", path: "/dashboard/admin/users", icon: faUsers },
    { name: "Companies", path: "/dashboard/admin/companies", icon: faBuilding },
    { name: "Leads", path: "/dashboard/admin/leads", icon: faSeedling },
  ];

  const companyMenu = [
    { name: "Overview", path: "/dashboard/company/overview", icon: faChartLine },
    { name: "Marketplace", path: "/dashboard/company/marketplace", icon: faStore },
    { name: "My Products", path: "/dashboard/company/products", icon: faBoxes },
    { name: "Notifications", path: "/dashboard/company/notifications", icon: faBell },
    { name: "Profile", path: "/dashboard/company/profile", icon: faUser },
  ];

  const menuItems = role === "ADMIN" ? adminMenu : companyMenu;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-60 border-r fixed h-full z-20 transition-all duration-200",
        "bg-card border-border shadow-sm"
      )}
    >
      {/* Brand + Theme Toggle */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-foreground">
            Farm<span className="text-primary">Zy</span>
          </span>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
            {role}
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} size="sm" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-muted-foreground px-3 mb-2 font-bold uppercase tracking-widest">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group outline-none",
                "border border-transparent hover:scale-[1.02] active:scale-95",
                isActive
                  ? "bg-primary/20 text-primary border-primary/30 shadow-none"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-border/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                <div className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center transition-colors px-0",
                  isActive ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                )}>
                  <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5" />
                </div>
                <span className={cn(
                  "transition-colors text-xs",
                  isActive ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile / Logout */}
      <div className="px-3 py-3 border-t border-border">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 group hover:scale-[1.02] active:scale-95"
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-destructive/10 text-destructive group-hover:bg-destructive/20 transition-colors">
            <FontAwesomeIcon icon={faRightFromBracket} className="w-3 h-3" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
