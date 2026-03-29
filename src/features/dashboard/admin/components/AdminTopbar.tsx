import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  dark: boolean;
};

const AdminTopbar = ({ dark }: Props) => {
  return (
    <header
      className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 ${
        dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100"
      }`}
    >
      {/* LEFT: Title + Search */}
      <div className="flex items-center gap-4 w-full max-w-xl">
        {/* Title */}
        <h1
          className={`text-base font-black ${
            dark ? "text-white" : "text-gray-800"
          }`}
        >
          Admin Dashboard
        </h1>

        {/* Search */}
        {/* <div className="relative w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
              dark ? "text-white/40" : "text-gray-400"
            }`}
          />

          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-8 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 ${
              dark
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                : "bg-gray-50 border-gray-100 text-gray-700 placeholder:text-gray-400"
            }`}
          />
        </div> */}
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${
            dark
              ? "bg-white/5 text-white/70 hover:bg-white/10"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
            dark ? "bg-white/5" : "bg-gray-100"
          }`}
        >
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-lg text-green-400"
          />
          <span
            className={`text-xs font-bold ${
              dark ? "text-white" : "text-gray-800"
            }`}
          >
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
