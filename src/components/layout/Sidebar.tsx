import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const companyMenu = [
    { name: "Overview", path: "/dashboard/company/overview" },
    { name: "Marketplace", path: "/dashboard/company/marketplace" },
    { name: "My Products", path: "/dashboard/company/products" },
    { name: "Notifications", path: "/dashboard/company/notifications" },
    { name: "Profile", path: "/dashboard/company/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed h-full bg-card border-r border-border z-20">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-bold text-foreground">FarmZy</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">Company Account</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {companyMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
