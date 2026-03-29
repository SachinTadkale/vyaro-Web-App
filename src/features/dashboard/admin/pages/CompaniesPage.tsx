import { useState, useMemo } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  ChevronDown, 
  CheckCircle2, 
  Ban,
  Store
} from "lucide-react";
import type { Company } from "../types/admin.types";
import CompanyTable from "../components/CompanyTable";
import CompanyDrawer from "../components/CompanyDrawer";
import BlockModal from "../components/BlockModal";
import { cn } from "@/utils/utils";

// --- MOCK DATA ---
const MOCK_COMPANIES: Company[] = [
  {
    id: "c1",
    companyName: "AgroTech Solutions Pvt Ltd",
    email: "contact@agrotech.com",
    phone: "+91 22 4567 8901",
    location: "Pune, Maharashtra",
    gstNumber: "27AABCU9603R1ZX",
    regNumber: "U01100MH2019PTC123456",
    hqLocation: "Tech Park, Hinjewadi Phase 3, Pune - 411057",
    kycStatus: "VERIFIED",
    status: "ACTIVE",
    joinedDate: "Jan 20, 2024",
    activity: {
      totalOrders: 156,
      activeListings: 42,
      purchaseVolume: "₹12.5L"
    }
  },
  {
    id: "c2",
    companyName: "Green Valley Organics",
    email: "info@greenvalley.org",
    phone: "+91 80 9876 5432",
    location: "Bangalore, Karnataka",
    gstNumber: "29AADCS1234F1Z5",
    regNumber: "U01100KA2020PTC987654",
    hqLocation: "Electronic City, Bangalore - 560100",
    kycStatus: "PENDING",
    status: "ACTIVE",
    joinedDate: "Mar 02, 2024",
    activity: {
      totalOrders: 28,
      activeListings: 15,
      purchaseVolume: "₹4.2L"
    }
  },
  {
    id: "c3",
    companyName: "SeedCo India",
    email: "support@seedco.in",
    phone: "+91 40 2345 6789",
    location: "Hyderabad, Telangana",
    gstNumber: "36AAACS8321P1Z0",
    regNumber: "U01100TG2021PTC112233",
    hqLocation: "HITEC City, Hyderabad - 500081",
    kycStatus: "VERIFIED",
    status: "BLOCKED",
    joinedDate: "Feb 10, 2024",
    activity: {
      totalOrders: 0,
      activeListings: 0,
      purchaseVolume: "₹0"
    }
  },
  {
    id: "c4",
    companyName: "Bharat Fertilisers",
    email: "admin@bharatfert.com",
    phone: "+91 11 3456 7890",
    location: "New Delhi, Delhi",
    gstNumber: "07AAACB1234A1Z1",
    regNumber: "U01100DL2018PTC223344",
    hqLocation: "Okhla Industrial Area, New Delhi - 110020",
    kycStatus: "REJECTED",
    status: "ACTIVE",
    joinedDate: "Dec 15, 2023",
    activity: {
      totalOrders: 89,
      activeListings: 24,
      purchaseVolume: "₹8.9L"
    }
  }
];

const StatSummaryCard = ({ label, value, icon: Icon, colorClass }: any) => (
  <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all group shadow-sm">
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-muted/30 text-muted-foreground group-hover:bg-primary/5 transition-colors", colorClass)}>
      <Icon size={18} />
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-bold text-foreground tracking-tight">{value}</h3>
    </div>
  </div>
);

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // Drawer & Modal State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) || 
                           c.email.toLowerCase().includes(search.toLowerCase()) ||
                           c.gstNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter || c.kycStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, search, statusFilter]);

  const stats = {
    total: companies.length,
    verified: companies.filter(c => c.kycStatus === "VERIFIED").length,
    activeBuyers: companies.filter(c => c.status === "ACTIVE" && c.activity.totalOrders > 0).length,
    blocked: companies.filter(c => c.status === "BLOCKED").length,
  };

  const handleOpenDrawer = (company: Company) => {
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleVerify = () => {
    if (!selectedCompany) return;
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, kycStatus: "VERIFIED", status: "ACTIVE" } : c));
    setSelectedCompany(prev => prev ? { ...prev, kycStatus: "VERIFIED", status: "ACTIVE" } : null);
  };

  const initiateBlock = () => {
    setBlockModalOpen(true);
  };

  const handleConfirmBlock = (reason: string) => {
    if (!selectedCompany) return;
    setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, status: "BLOCKED" } : c));
    setSelectedCompany(prev => prev ? { ...prev, status: "BLOCKED" } : null);
    console.log(`Blocked ${selectedCompany.companyName} for: ${reason}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Top Section: Header & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Company Management</h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Oversee corporate partners and business buyers on the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatSummaryCard label="Total Companies" value={stats.total} icon={Building2} colorClass="text-primary/70" />
          <StatSummaryCard label="Verified" value={stats.verified} icon={CheckCircle2} colorClass="text-emerald-500" />
          <StatSummaryCard label="Active Buyers" value={stats.activeBuyers} icon={Store} colorClass="text-blue-500" />
          <StatSummaryCard label="Blocked" value={stats.blocked} icon={Ban} colorClass="text-red-500" />
        </div>
      </div>

      {/* 🔍 Filters Layer */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-card/50 border border-border/30 p-2 rounded-xl">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
          <input
            type="text"
            placeholder="Search by name, email or GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-white placeholder:text-muted-foreground/30"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: "ALL", label: "All Entities" },
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
            <ChevronDown size={10} />
          </button>
        </div>
      </div>

      {/* 📋 Table Layer */}
      <CompanyTable 
        companies={filteredCompanies} 
        onView={handleOpenDrawer}
      />

      {/* 👁 Inspection Drawer */}
      <CompanyDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        company={selectedCompany}
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
        title="Block Company"
        entityName={selectedCompany?.companyName || ""}
      />

    </div>
  );
};

export default CompaniesPage;