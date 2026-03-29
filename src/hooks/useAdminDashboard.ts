import { useState } from "react";
import { 
  Users, 
  FileCheck, 
  CheckCircle, 
  Ban, 
  Building2, 
  Leaf 
} from "lucide-react";

// Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "BLOCKED";
  role: "FARMER" | "COMPANY";
  createdAt: string;
}

export interface KYCRequest {
  id: string;
  name: string;
  docType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

// Mock Data
const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Shubham", email: "shubham@gmail.com", status: "APPROVED", role: "FARMER", createdAt: "2024-03-20" },
  { id: "2", name: "Rahul", email: "rahul@gmail.com", status: "PENDING", role: "FARMER", createdAt: "2024-03-21" },
  { id: "3", name: "AgroCorp", email: "agro@gmail.com", status: "APPROVED", role: "COMPANY", createdAt: "2024-03-18" },
];

const MOCK_KYC: KYCRequest[] = [
  { id: "k1", name: "Shubham", docType: "Aadhar", status: "PENDING", submittedAt: "10 mins ago" },
  { id: "k2", name: "Rahul", docType: "PAN", status: "PENDING", submittedAt: "30 mins ago" },
];

export const useAdminDashboard = () => {
  const [users] = useState<AdminUser[]>(MOCK_USERS);
  const [kycRequests] = useState<KYCRequest[]>(MOCK_KYC);

  const stats = [
    { label: "Total Farmers", value: 1240, icon: Users, color: "primary", trend: { value: "12%", isUp: true } },
    { label: "Pending KYC", value: 42, icon: FileCheck, color: "yellow", trend: { value: "5%", isUp: false } }, // Changed warning to yellow for StatCard color prop
    { label: "Approved Users", value: 1150, icon: CheckCircle, color: "green", trend: { value: "8%", isUp: true } }, // Changed success to green
    { label: "Blocked Accounts", value: 12, icon: Ban, color: "red" }, // Changed destructive to red
    { label: "Partner Companies", value: 86, icon: Building2, color: "secondary" }, // Changed info to secondary
    { label: "Recent Leads", value: 312, icon: Leaf, color: "primary" }, 
  ];

  return {
    users,
    kycRequests,
    stats,
  };
};
