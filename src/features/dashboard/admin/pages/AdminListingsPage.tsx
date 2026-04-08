import { useState } from "react";
import { Search, SlidersHorizontal, Store } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/common/Table";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import ListingDrawer, { type DashboardListing } from "../components/ListingDrawer";

const MOCK_LISTINGS: DashboardListing[] = [
  { id: "LST-501", productName: "Premium Wheat", farmerName: "Raju Rastogi", category: "Grains", quantity: "500 MT", price: "₹2,200", location: "Pune, MH", status: "Active", date: "Apr 6, 2026", description: "High quality export grade wheat." },
  { id: "LST-502", productName: "Organic Turmeric", farmerName: "Suresh Patil", category: "Spices", quantity: "50 MT", price: "₹12,400", location: "Sangli, MH", status: "Pending", date: "Apr 7, 2026", description: "Farm fresh organic turmeric fingers." },
  { id: "LST-503", productName: "Basmati Rice", farmerName: "Amit Singh", category: "Grains", quantity: "200 MT", price: "₹4,500", location: "Karnal, HR", status: "Active", date: "Apr 5, 2026", description: "Aged basmati rice, 1121 variety." },
  { id: "LST-504", productName: "Cotton Bales", farmerName: "Kisan Lal", category: "Fibers", quantity: "100 MT", price: "₹6,800", location: "Nagpur, MH", status: "Rejected", date: "Apr 4, 2026", description: "Raw cotton directly from field." },
  { id: "LST-505", productName: "Soyabean", farmerName: "Vilas Rao", category: "Oilseeds", quantity: "300 MT", price: "₹4,100", location: "Indore, MP", status: "Pending", date: "Apr 8, 2026", description: "Cleaned soyabean ready for extraction." },
];

const AdminListingsPage = () => {
  const [listings, setListings] = useState<DashboardListing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedListing, setSelectedListing] = useState<DashboardListing | null>(null);

  // Filters
  const filteredListings = listings.filter(l => {
    const matchesSearch = 
      l.productName.toLowerCase().includes(search.toLowerCase()) || 
      l.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedListings = filteredListings.slice(startIdx, endIdx);

  // Actions
  const handleApprove = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "Active" } : l));
  };

  const handleReject = (id: string, reason: string) => {
    // In a real app, reason would be passed to API. Here we just update status.
    console.log(`Rejected ${id} for reason: ${reason}`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Pending": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default: return "bg-muted text-muted-foreground border border-border";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Marketplace Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and manage agricultural produce listed by farmers.</p>
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
              placeholder="Search by product, ID, farmer, or location..."
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/20 border border-border/50 text-sm font-bold text-muted-foreground whitespace-nowrap shrink-0">
              <SlidersHorizontal size={16} />
              <span>Status</span>
            </div>
            {["All", "Active", "Pending", "Rejected"].map(s => (
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
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Product</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Farmer</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Location</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Quantity</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Price</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Status</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/20">
                {displayedListings.map((l) => (
                  <TableRow 
                    key={l.id} 
                    onClick={() => setSelectedListing(l)}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Store size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground/90 group-hover:text-primary transition-colors">{l.productName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{l.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-semibold text-sm text-foreground/90">{l.farmerName}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-semibold text-xs text-foreground/80">{l.location}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className="font-bold text-sm text-foreground">{l.quantity}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className="font-black text-sm text-primary">{l.price}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className={`${getStatusClass(l.status)} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm`}>
                        {l.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <span className="font-semibold text-xs text-muted-foreground/80">{l.date}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredListings.length === 0 && (
              <TableEmptyState description="No listings match your search criteria." />
            )}
          </div>
          
          {filteredListings.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
              totalItems={filteredListings.length}
            />
          )}
        </div>
      </motion.div>

      {/* Drawer */}
      <ListingDrawer
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
        onApprove={handleApprove}
        onReject={handleReject}
      />

    </div>
  );
};

export default AdminListingsPage;
