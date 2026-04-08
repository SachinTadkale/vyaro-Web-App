import { useState } from "react";
import { Search, SlidersHorizontal, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/common/Table";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import DisputeDrawer, { type AdminDispute } from "../components/DisputeDrawer";

const MOCK_DISPUTES: AdminDispute[] = [
  { id: "DSP-101", orderId: "ORD-9201", raisedBy: "Ramesh Patil", against: "AgroCorp India", reason: "Payment delayed by buyer", category: "Payment", status: "Open", date: "Apr 8, 2026", description: "The buyer AgroCorp India received the delivery 3 days ago but has not released the payment as per the platform escrow terms." },
  { id: "DSP-102", orderId: "ORD-9195", raisedBy: "FarmTrade", against: "Kisan Lal", reason: "Quality mismatch", category: "Quality", status: "In Review", date: "Apr 7, 2026", description: "The supplied soybeans have a moisture content of 14% instead of the agreed 10%. We cannot process this batch." },
  { id: "DSP-103", orderId: "ORD-9190", raisedBy: "SeedCo", against: "Dnyaneshwar", reason: "Short quantity delivered", category: "Logistics", status: "Resolved", date: "Apr 5, 2026", description: "Received only 95 MT instead of 100 MT order amount." },
  { id: "DSP-104", orderId: "ORD-9188", raisedBy: "Anil Singh", against: "Naturals Ltd", reason: "Unauthorized deductions", category: "Payment", status: "Rejected", date: "Apr 4, 2026", description: "Buyer deducted ₹5,000 for unloading which was not part of the contract." },
  { id: "DSP-105", orderId: "ORD-9180", raisedBy: "Vikram Reddy", against: "AgroTech", reason: "Transport damages", category: "Logistics", status: "Open", date: "Apr 2, 2026", description: "About 5 MT of sugarcane was damaged during transit due to improper tarping by buyer logistics." },
];

const AdminDisputesPage = () => {
  const [disputes, setDisputes] = useState<AdminDispute[]>(MOCK_DISPUTES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);

  // Filters
  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(search.toLowerCase()) || 
      d.orderId.toLowerCase().includes(search.toLowerCase()) || 
      d.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.against.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDisputes.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedDisputes = filteredDisputes.slice(startIdx, endIdx);

  // Actions
  const handleResolve = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "Resolved" } : d));
  };

  const handleReject = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "Rejected" } : d));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Open": 
      case "In Review": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default: return "bg-muted text-muted-foreground border border-border";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Disputes Console</h2>
          <p className="text-sm text-muted-foreground mt-1">Review, arbitrate, and resolve platform transaction conflicts.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              className="w-full bg-card border border-border/50 pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all hover:border-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Ticket ID, Order ID, or Entity..."
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/20 border border-border/50 text-sm font-bold text-muted-foreground whitespace-nowrap shrink-0">
              <SlidersHorizontal size={16} />
              <span>Status</span>
            </div>
            {["All", "Open", "In Review", "Resolved", "Rejected"].map(s => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shrink-0 transition-all shadow-sm ${
                  statusFilter === s 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="dashboard-card overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Ticket Details</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Linked Order</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Entities Involved</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Primary Reason</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Status</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/20">
                {displayedDisputes.map((d) => (
                  <TableRow 
                    key={d.id} 
                    onClick={() => setSelectedDispute(d)}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors">{d.id}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{d.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-mono font-bold text-sm text-primary/90">{d.orderId}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-foreground/90">{d.raisedBy}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/70">against {d.against}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-semibold text-xs text-rose-500/80 truncate max-w-[200px] block">{d.reason}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className={`${getStatusClass(d.status)} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm`}>
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <span className="font-semibold text-xs text-muted-foreground/80">{d.date}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredDisputes.length === 0 && (
              <TableEmptyState description="No disputes match your search criteria." />
            )}
          </div>
          
          {filteredDisputes.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
              totalItems={filteredDisputes.length}
            />
          )}
        </div>
      </motion.div>

      {/* Drawer */}
      <DisputeDrawer
        isOpen={!!selectedDispute}
        onClose={() => setSelectedDispute(null)}
        dispute={selectedDispute}
        onResolve={handleResolve}
        onReject={handleReject}
      />

    </div>
  );
};

export default AdminDisputesPage;
