import type { User } from "../types/admin.types";
import StatsGrid from "../components/dashboard/StatsGrid";
import KycSection from "../components/dashboard/KycSection";
import RecentUsers from "../components/dashboard/RecentUsers";
import RecentLeads from "../components/dashboard/RecentLeads";
import type { Lead } from "../types/lead.types";
import VerificationChart from "../components/dashboard/VerificationChart";
import RecentCompanies from "../components/dashboard/RecentCompanies";
import type { Company } from "@/modules/company/types/company.types";
import ActivityFeed from "../components/dashboard/ActivityFeed";

const AdminDashboard = () => {
  // 🔥 KYC USERS (for KycSection)
  const kycUsers = [
    {
      id: "1",
      name: "Shubham",
      email: "shubham@gmail.com",
      docType: "AADHAR",
      docNumber: "1234 5678 9012",
      phone: "9876543210",
      location: "Pune",
      status: "PENDING" as const,
    },
    {
      id: "2",
      name: "Rahul",
      email: "rahul@gmail.com",
      docType: "PAN",
      docNumber: "ABCDE1234F",
      phone: "9123456780",
      location: "Mumbai",
      status: "PENDING" as const,
    },
  ];

  // 🔥 RECENT USERS (for RecentUsers)
  const recentUsers: User[] = [
    {
      user_id: "1",
      name: "Shubham",
      email: "shubham@gmail.com",
      phone_no: "9876543210",
      address: "Pune",
      isBlocked: false,
      verificationStatus: "APPROVED",
      createdAt: new Date().toISOString(),
    },
    {
      user_id: "2",
      name: "Rahul",
      email: "rahul@gmail.com",
      phone_no: "9123456780",
      address: "Mumbai",
      isBlocked: false,
      verificationStatus: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];

  // 🔥 STATS
  const statsData = [
    {
      label: "Total Farmers",
      value: 12,
      color: "bg-blue-500",
      route: "/admin/users",
    },
    {
      label: "Pending KYC",
      value: 3,
      color: "bg-yellow-500",
      route: "/admin/kyc",
    },
    {
      label: "Approved",
      value: 7,
      color: "bg-green-500",
      route: "/admin/users",
    },
    {
      label: "Blocked",
      value: 2,
      color: "bg-red-500",
      route: "/admin/users",
    },
    {
      label: "Companies",
      value: 5,
      color: "bg-purple-500",
      route: "/admin/companies",
    },
    {
      label: "Leads",
      value: 18,
      color: "bg-orange-500",
      route: "/admin/leads",
    },
  ];

  // 🔥 LEADS
  const leads: Lead[] = [
    {
      id: "1",
      email: "farmer1@gmail.com",
      role: "FARMER",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      email: "company1@gmail.com",
      role: "COMPANY",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      email: "farmer2@gmail.com",
      role: "FARMER",
      createdAt: new Date().toISOString(),
    },
  ];

  // 🔥 VERIFICATION DATA
  const approved = 7;
  const pendingCount = 3;
  const blocked = 2;

  // 🔥 COMPANIES
  const companies: Company[] = [
    {
      id: "1",
      name: "AgroCorp",
      email: "agro@gmail.com",
      verificationStatus: "APPROVED",
    },
    {
      id: "2",
      name: "SeedCo",
      email: "seed@gmail.com",
      verificationStatus: "PENDING",
    },
    {
      id: "3",
      name: "FarmTrade",
      email: "trade@gmail.com",
      verificationStatus: "REJECTED",
    },
  ];

  const activities: {
    id: string;
    type: "USER" | "LEAD" | "COMPANY" | "KYC";
    message: string;
    time: string;
  }[] = [
    {
      id: "1",
      type: "USER",
      message: "New farmer registered",
      time: "2 min ago",
    },
    {
      id: "2",
      type: "LEAD",
      message: "New lead created (farmer1@gmail.com)",
      time: "5 min ago",
    },
    {
      id: "3",
      type: "COMPANY",
      message: "Company AgroCorp approved",
      time: "10 min ago",
    },
    {
      id: "4",
      type: "KYC",
      message: "KYC rejected for Rahul",
      time: "20 min ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 🔝 Stats */}
      <StatsGrid stats={statsData} />

      {/* 📊 Main Layout */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* ⬅️ LEFT */}
        <div className="lg:col-span-3 space-y-5">
          <KycSection users={kycUsers} />

          <ActivityFeed activities={activities} />
        </div>

        {/* ➡️ RIGHT */}
        <div className="lg:col-span-2 space-y-5">
          <VerificationChart
            approved={approved}
            pending={pendingCount}
            blocked={blocked}
          />

          <RecentUsers users={recentUsers} />

          <RecentLeads leads={leads} />

          <RecentCompanies companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
