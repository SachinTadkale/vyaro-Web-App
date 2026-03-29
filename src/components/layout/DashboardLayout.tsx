import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/useAuthStore";

interface DashboardLayoutProps {
  role?: "ADMIN" | "COMPANY";
}

const DashboardLayout = ({ role: propRole }: DashboardLayoutProps) => {
  const user = useAuthStore((state) => state.user);
  
  // Use prop role if provided, else fallback to store role or default
  const role = propRole || user?.role || "COMPANY";

  return (
    <div className={`min-h-screen flex bg-background text-foreground transition-colors duration-200 ${role === 'ADMIN' ? 'admin-theme' : ''}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar role={role} user={user} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

