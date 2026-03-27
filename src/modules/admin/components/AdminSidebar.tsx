import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faFileCircleCheck,
  faBuilding,
  faRightFromBracket,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  dark: boolean;
  setDark: (val: boolean) => void;
};

const AdminSidebar = ({ dark, setDark }: Props) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: faChartLine,
    },
    {
      name: "KYC Requests",
      path: "/admin/kyc",
      icon: faFileCircleCheck,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: faUsers,
    },
    {
      name: "Companies",
      path: "/admin/companies",
      icon: faBuilding,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col w-56 border-r fixed h-full z-20 transition-colors duration-300 ${
        dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100"
      }`}
    >
      {/* Logo + Theme */}
      <div
        className={`px-5 py-5 border-b flex items-center justify-between ${
          dark ? "border-white/10" : "border-gray-100"
        }`}
      >
        <span className="text-lg font-black tracking-tight text-white">
          Farm<span className="text-green-400">Zy</span>
        </span>

        <button
          onClick={() => setDark(!dark)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            dark
              ? "bg-white/10 text-white/60"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <FontAwesomeIcon icon={dark ? faSun : faMoon} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] text-gray-400 px-3 mb-2 font-bold uppercase">
          Admin Panel
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-green-500/15 text-green-400"
                  : dark
                  ? "text-white/50 hover:bg-white/5 hover:text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`px-4 py-4 border-t ${
          dark ? "border-white/10" : "border-gray-100"
        }`}
      >
        <button className="flex items-center gap-2 text-xs text-red-400 font-bold">
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;