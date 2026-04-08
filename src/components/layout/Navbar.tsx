import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle, faSearch, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@/store/useAuthStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/utils";

type Props = {
  role: string;
  user: User | null;
};

const MOCK_SEARCH_DATA = [
  { id: 1, name: "Premium Wheat", category: "Grain" },
  { id: 2, name: "Basmati Rice", category: "Grain" },
  { id: 3, name: "Soybean Oil", category: "Liquid" },
  { id: 4, name: "Cotton Bales", category: "Textile" },
  { id: 5, name: "Organic Turmeric", category: "Spice" }
];

const Navbar = ({ role, user }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsProfileMenuOpen(false);
  };

  const handleNavigateTo = (path: string) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const filteredResults = MOCK_SEARCH_DATA.filter(p => 
    searchQuery && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

      {/* Actions & Search */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-3 h-3" />
            <input 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Search mock products..." 
              className="pl-8 pr-4 py-1.5 rounded-lg bg-muted/30 border border-transparent focus:border-primary/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-foreground transition-all w-64"
            />
          </div>
          
          {/* Search Dropdown */}
          {showResults && searchQuery && (
             <div className="absolute top-full mt-2 left-0 w-full bg-card border border-border shadow-lg rounded-xl overflow-hidden z-20">
               {filteredResults.length > 0 ? (
                 <div className="py-1">
                   {filteredResults.map(p => (
                     <div key={p.id} className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex justify-between items-center transition-colors">
                       <span className="text-xs font-bold text-foreground">{p.name}</span>
                       <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md uppercase">{p.category}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-3 text-center text-xs font-medium text-muted-foreground">No matches found</div>
               )}
             </div>
          )}
        </div>

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

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/30 border border-transparent transition-all cursor-pointer hover:bg-muted/50 text-left hover:border-border/50"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-normal text-foreground leading-tight">
                {role === "ADMIN" ? (user?.name || "System Administrator") : (user?.companyName || user?.name)}
              </p>
              <p className="text-[9px] text-muted-foreground font-normal uppercase tracking-tighter opacity-60">
                {user?.email}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary/60 border border-primary/10">
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
            </div>
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleNavigateTo(role === "ADMIN" ? "/dashboard/admin/profile" : "/dashboard/company/profile")}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors text-left"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigateTo(role === "ADMIN" ? "/dashboard/admin/settings" : "/dashboard/company/settings")}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors text-left"
                  >
                    <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-border/30 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
