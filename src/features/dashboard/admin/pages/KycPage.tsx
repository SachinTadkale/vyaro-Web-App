import { useState } from "react";
import KycTabs from "../components/kyc/KycTabs";
import KycTable from "../components/kyc/KycTable";
import KycDrawer from "../components/kyc/KycDrawer";
import ImageLightbox from "@/components/common/ImageLightbox";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

// --- MOCK DATA ---
const MOCK_FARMERS = [
  {
    id: "f1", name: "Ramesh Patil", email: "ramesh@patil.com", phone: "+91 98765 43210", gender: "Male",
    location: "Nashik, MH", state: "Maharashtra", district: "Nashik", village: "Vani", landArea: "5.2 Acres",
    docType: "AADHAR", docNumber: "1234 5678 9012", status: "PENDING", submittedAt: "10 mins ago",
    bankName: "State Bank of India", accHolder: "Ramesh P Patil", accNumber: "3456789012", ifsc: "SBIN0001234"
  },
  {
    id: "f2", name: "Suresh Jadhav", email: "suresh@jadhav.com", phone: "+91 91234 56780", gender: "Male",
    location: "Solapur, MH", state: "Maharashtra", district: "Solapur", village: "Karmala", landArea: "3.8 Acres",
    docType: "PAN", docNumber: "ABCDE1234F", status: "PENDING", submittedAt: "25 mins ago",
    bankName: "HDFC Bank", accHolder: "Suresh S Jadhav", accNumber: "9876543210", ifsc: "HDFC0004567"
  },
];

const MOCK_COMPANIES = [
  {
    id: "c1", companyName: "AgroTech Pvt Ltd", regNumber: "U01100MH2019PTC123456", gstNumber: "27AABCU9603R1ZX",
    email: "agrotech@farmzy.com", phone: "+91 22 2345 6789", location: "Pune, MH",
    state: "Maharashtra", district: "Pune", status: "PENDING", submittedAt: "1h ago"
  },
  {
    id: "c2", companyName: "SeedCo India", regNumber: "U01100KA2020PTC987654", gstNumber: "29AADCS1234F1Z5",
    email: "seedco@india.com", phone: "+91 80 4321 0987", location: "Bangalore, KA",
    state: "Karnataka", district: "Bangalore", status: "PENDING", submittedAt: "3h ago"
  },
];

const KycPage = () => {
  const [activeTab, setActiveTab] = useState<"farmers" | "companies">("farmers");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // const [rejectingId, setRejectingId] = useState<string | null>(null);

  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [companies, setCompanies] = useState(MOCK_COMPANIES);

  // Lightbox State
  const [lightbox, setLightbox] = useState({ open: false, src: "", title: "" });

  const handleView = (item: any) => {
    setSelectedRequest(item);
    setDrawerOpen(true);
  };

  const handleApprove = (id: string) => {
    // Simulating API call
    if (activeTab === "farmers") {
      setFarmers(old => old.map(u => u.id === id ? { ...u, status: "APPROVED" } : u));
    } else {
      setCompanies(old => old.map(c => c.id === id ? { ...c, status: "APPROVED" } : c));
    }
    // Update selected request for drawer feedback
    setSelectedRequest((prev: any) => prev ? { ...prev, status: "APPROVED" } : null);
  };

  // const initiateReject = (id: string) => {
  //   setRejectingId(id);
  // };

  // const confirmReject = () => {
  //   if (!rejectingId) return;

  //   if (activeTab === "farmers") {
  //     setFarmers(old => old.map(u => u.id === rejectingId ? { ...u, status: "REJECTED", reason: rejectionReason } : u));
  //   } else {
  //     setCompanies(old => old.map(c => c.id === rejectingId ? { ...c, status: "REJECTED", reason: rejectionReason } : c));
  //   }
  //   setSelectedRequest((prev: any) => prev ? { ...prev, status: "REJECTED", reason: rejectionReason } : null);

  //   // Close modal
  //   setRejectingId(null);
  //   setRejectionReason("");
  // };

  const openLightbox = (src: string, title: string) => {
    setLightbox({ open: true, src, title });
  };

  const farmerCount = farmers.filter(f => f.status === "PENDING").length;
  const companyCount = companies.filter(c => c.status === "PENDING").length;

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
          <input
            type="text"
            placeholder={`Search ${activeTab === "farmers" ? "farmer names" : "company registration"}...`}
            className="w-full bg-muted/20 border border-border/40 pl-9 pr-4 py-2 rounded-lg text-xs font-normal focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30"
          />
        </div>
        <KycTabs
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t)}
          counts={{ farmers: farmerCount, companies: companyCount }}
        />
      </div>

      {/* SCAN LAYER: TABLE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <KycTable
            type={activeTab}
            data={activeTab === "farmers" ? farmers : companies}
            onView={handleView}
          />
        </motion.div>
      </AnimatePresence>

      {/* INSPECTION LAYER: RIGHT DRAWER */}
      <KycDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={activeTab}
        data={selectedRequest}
        onApprove={handleApprove}
        onReject={() => {}} // Placeholder as rejection is handled in specific management pages now
        onViewDoc={openLightbox}
      />

      {/* FULL-SCREEN INSPECTION LAYER: LIGHTBOX */}
      <ImageLightbox
        open={lightbox.open}
        src={lightbox.src}
        title={lightbox.title}
        onClose={() => setLightbox(prev => ({ ...prev, open: false }))}
      />

    </div>
  );
};

export default KycPage;