import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "@/modules/admin/components/AdminSidebar";
import AdminTopbar from "@/modules/admin/components/AdminTopbar";

const AdminLayout = () => {
  const [dark, setDark] = useState(true);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        dark ? "bg-[#060d1f]" : "bg-[#F8F9FB]"
      }`}
    >
      {/* Sidebar */}
      <AdminSidebar dark={dark} setDark={setDark} />

      {/* Main Content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        
        {/* Topbar */}
        <AdminTopbar dark={dark} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;