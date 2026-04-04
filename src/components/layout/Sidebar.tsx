import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

type Props = {
  role: string;
};

const Sidebar = ({ role }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const companyMenu = [
    { name: "Overview", path: "/dashboard/company/overview", symbol: "O" },
    { name: "Marketplace", path: "/dashboard/company/marketplace", symbol: "M" },
    { name: "My Products", path: "/dashboard/company/products", symbol: "P" },
    { name: "Notifications", path: "/dashboard/company/notifications", symbol: "N" },
    { name: "Profile", path: "/dashboard/company/profile", symbol: "U" },
  ];

  const menuItems = companyMenu;

  return (
    <aside className="hidden md:flex flex-col w-60 border-r fixed h-full z-20 bg-card border-border">
      {/* Brand */}
      <div className="px-5 py-4 flex items-center gap-2 border-b">
        <span className="text-lg font-bold text-foreground">FarmZy</span>
        <span className="text-xs font-bold px-2 py-1 bg-primary text-white rounded">{role}</span>
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
              isActive
                ? "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-primary text-white border border-primary"
                : "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground border border-transparent"
            }
          >
            {({ isActive }) => (
              <>
                <div className={isActive ? "text-white" : "text-muted-foreground"}>
                  {item.name === "Profile" && user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-6 h-6 object-cover rounded" />
                  ) : (
                    <span className="font-bold text-sm">{item.symbol}</span>
                  )}
                </div>
                <span className="text-xs">{item.name}</span>
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
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-xs font-medium text-destructive bg-destructive/20 border border-destructive"
        >
          <span className="text-base">↩</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
