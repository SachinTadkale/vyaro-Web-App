import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  UserCheck, 
  Clock, 
  Ban
} from "lucide-react";
import type { Farmer } from "../types/admin.types";
import FarmerTable from "../components/FarmerTable";
import UserDrawer from "../components/UserDrawer";
import BlockModal from "../components/BlockModal";
import { cn } from "@/utils/utils";

// --- MOCK DATA ---
const MOCK_FARMERS: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Patil",
    email: "ramesh.patil@example.com",
    phone: "+91 98765 43210",
    gender: "Male",
    location: "Nashik, Maharashtra",
    address: "Plot 42, Vani Road, Nashik - 422003",
    state: "Maharashtra",
    district: "Nashik",
    village: "Vani",
    landArea: "5.2 Acres",
    bankInfo: {
      bankName: "State Bank of India",
      accountNumber: "345678901234",
      ifsc: "SBIN0001234"
    },
    kycStatus: "PENDING",
    status: "ACTIVE",
    joinedDate: "Mar 12, 2024",
    activity: {
      totalListings: 12,
      totalOrders: 45,
      lastActive: "2h ago"
    }
  },
  {
    id: "f2",
    name: "Suresh Jadhav",
    email: "suresh.j@agrimail.in",
    phone: "+91 91234 56780",
    gender: "Male",
    location: "Solapur, Maharashtra",
    address: "Gat No. 124, Karmala, Solapur - 413203",
    state: "Maharashtra",
    district: "Solapur",
    village: "Karmala",
    landArea: "3.8 Acres",
    bankInfo: {
      bankName: "HDFC Bank",
      accountNumber: "987654321098",
      ifsc: "HDFC0004567"
    },
    kycStatus: "VERIFIED",
    status: "ACTIVE",
    joinedDate: "Feb 28, 2024",
    activity: {
      totalListings: 8,
      totalOrders: 22,
      lastActive: "1d ago"
    }
  },
  {
    id: "f3",
    name: "Anjali Deshmukh",
    email: "anjali.d@farmzy.com",
    phone: "+91 88776 55443",
    gender: "Female",
    location: "Pune, Maharashtra",
    address: "Sector 7, Hadapsar, Pune - 411028",
    state: "Maharashtra",
    district: "Pune",
    village: "Hadapsar",
    landArea: "2.5 Acres",
    bankInfo: {
      bankName: "ICICI Bank",
      accountNumber: "112233445566",
      ifsc: "ICIC0001122"
    },
    kycStatus: "VERIFIED",
    status: "BLOCKED",
    joinedDate: "Jan 15, 2024",
    activity: {
      totalListings: 0,
      totalOrders: 0,
      lastActive: "3w ago"
    }
  },
  {
    id: "f4",
    name: "Mahesh Kumar",
    email: "mahesh.k@harvest.io",
    phone: "+91 77665 44332",
    gender: "Male",
    location: "Nagpur, Maharashtra",
    address: "Ward No. 3, Mouda, Nagpur - 441104",
    state: "Maharashtra",
    district: "Nagpur",
    village: "Mouda",
    landArea: "10.5 Acres",
    bankInfo: {
      bankName: "Bank of Baroda",
      accountNumber: "554433221100",
      ifsc: "BARB0MOUDAX"
    },
    kycStatus: "REJECTED",
    status: "ACTIVE",
    joinedDate: "Mar 05, 2024",
    activity: {
      totalListings: 2,
      totalOrders: 5,
      lastActive: "5h ago"
    }
  }
];

const StatSummaryCard = ({ label, value, icon: Icon, colorClass }: any) => (
  <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all group">
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-muted/30 text-muted-foreground group-hover:bg-primary/5 transition-colors", colorClass)}>
      <Icon size={18} />
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-bold text-foreground tracking-tight">{value}</h3>
    </div>
  </div>
);

const UsersPage = () => {
  const [farmers, setFarmers] = useState<Farmer[]>(MOCK_FARMERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // Drawer & Modal State
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                           f.email.toLowerCase().includes(search.toLowerCase()) ||
                           f.phone.includes(search);
      const matchesStatus = statusFilter === "ALL" || f.status === statusFilter || f.kycStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, search, statusFilter]);

  const stats = {
    total: farmers.length,
    verified: farmers.filter(f => f.kycStatus === "VERIFIED").length,
    pending: farmers.filter(f => f.kycStatus === "PENDING").length,
    blocked: farmers.filter(f => f.status === "BLOCKED").length,
  };

  const handleOpenDrawer = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setDrawerOpen(true);
  };

  const handleVerify = () => {
    if (!selectedFarmer) return;
    setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, kycStatus: "VERIFIED", status: "ACTIVE" } : f));
    setSelectedFarmer(prev => prev ? { ...prev, kycStatus: "VERIFIED", status: "ACTIVE" } : null);
  };

  const initiateBlock = () => {
    setBlockModalOpen(true);
  };

  const handleConfirmBlock = (reason: string) => {
    if (!selectedFarmer) return;
    setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, status: "BLOCKED" } : f));
    setSelectedFarmer(prev => prev ? { ...prev, status: "BLOCKED" } : null);
    console.log(`Blocked ${selectedFarmer.name} for: ${reason}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Top Section: Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Farmer Management</h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Monitor and moderate registered farmers across the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatSummaryCard label="Total Farmers" value={stats.total} icon={Users} colorClass="text-primary/70" />
          <StatSummaryCard label="Verified" value={stats.verified} icon={UserCheck} colorClass="text-emerald-500" />
          <StatSummaryCard label="Pending KYC" value={stats.pending} icon={Clock} colorClass="text-yellow-500" />
          <StatSummaryCard label="Blocked" value={stats.blocked} icon={Ban} colorClass="text-red-500" />
        </div>
      </div>

      {/* 🔍 Filters Layer */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-card/50 border border-border/30 p-2 rounded-xl">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-white placeholder:text-muted-foreground/30"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: "ALL", label: "All Users" },
            { id: "VERIFIED", label: "Verified" },
            { id: "PENDING", label: "Pending" },
            { id: "BLOCKED", label: "Blocked" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                statusFilter === tab.id 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "text-muted-foreground/40 border-transparent hover:text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 text-muted-foreground/40 hover:text-foreground hover:bg-muted/10 transition-all ml-auto">
            <Filter size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">More Filters</span>
            <ChevronDown size={10} />
          </button>
        </div>
      </div>

      {/* 📋 Table Layer */}
      <FarmerTable 
        farmers={filteredFarmers} 
        onView={handleOpenDrawer}
      />

      {/* 👁 Inspection Drawer */}
      <UserDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        farmer={selectedFarmer}
        onVerify={handleVerify}
        onBlock={initiateBlock}
        onFlag={() => {}}
        onRemove={() => {}}
      />

      {/* 🚫 Block Modal */}
      <BlockModal 
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleConfirmBlock}
        title="Block Farmer"
        entityName={selectedFarmer?.name || ""}
      />

    </div>
  );
};

export default UsersPage;
