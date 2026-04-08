import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/common/Table";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import OrderDrawer, { type AdminOrder } from "../components/OrderDrawer";

const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  { id: "#ORD-9201", farmer: "Ramesh Patil", company: "AgroCorp India", product: "Premium Wheat - 500 MT", amount: "₹12,450", status: "Pending", date: "Today, 10:45 AM" },
  { id: "#ORD-9198", farmer: "Suresh Jadhav", company: "Green Valley", product: "Organic Turmeric - 50 MT", amount: "₹45,200", status: "In Transit", date: "Yesterday, 2:30 PM" },
  { id: "#ORD-9195", farmer: "Kisan Lal", company: "FarmTrade", product: "Soyabean - 200 MT", amount: "₹8,900", status: "Delivered", date: "Apr 5, 2026" },
  { id: "#ORD-9192", farmer: "Manish Kumar", company: "AgroTech", product: "Red Onions - 150 MT", amount: "₹32,000", status: "Disputed", date: "Apr 4, 2026" },
  { id: "#ORD-9190", farmer: "Dnyaneshwar", company: "SeedCo", product: "Cotton Bales - 100 MT", amount: "₹88,000", status: "Cancelled", date: "Apr 2, 2026" },
  { id: "#ORD-9188", farmer: "Anil Singh", company: "Naturals Ltd", product: "Basmati Rice - 800 MT", amount: "₹1,20,000", status: "Delivered", date: "Mar 30, 2026" },
  { id: "#ORD-9185", farmer: "Vikram Reddy", company: "FarmTrade", product: "Sugarcane - 1000 MT", amount: "₹95,000", status: "In Transit", date: "Mar 29, 2026" },
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Filters
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.product.toLowerCase().includes(search.toLowerCase()) || 
      o.farmer.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedOrders = filteredOrders.slice(startIdx, endIdx);

  // Actions
  const handleMarkDelivered = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Delivered" } : o));
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled" } : o));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "In Transit":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Cancelled":
        return "bg-muted/30 text-muted-foreground border border-border/50";
      case "Disputed":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground border border-border";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Orders Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor all platform trades and logistics.</p>
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
              placeholder="Search by ID, product, farmer, or company..."
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/20 border border-border/50 text-sm font-bold text-muted-foreground whitespace-nowrap shrink-0">
              <SlidersHorizontal size={16} />
              <span>Status</span>
            </div>
            {["All", "Pending", "In Transit", "Delivered", "Disputed", "Cancelled"].map(s => (
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
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Order ID</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Farmer</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Company</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Product Details</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Amount</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Status</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/20">
                {displayedOrders.map((o) => (
                  <TableRow 
                    key={o.id} 
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <TableCell className="py-4 px-5">
                      <span className="font-mono font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors">{o.id}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-bold text-sm text-foreground/90">{o.farmer}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-bold text-sm text-foreground/90">{o.company}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-semibold text-xs text-foreground/80">{o.product}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className="font-black text-sm text-primary">{o.amount}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className={`${getStatusClass(o.status)} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm`}>
                        {o.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <span className="font-semibold text-xs text-muted-foreground/80">{o.date}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredOrders.length === 0 && (
              <TableEmptyState description="No orders match your search criteria." />
            )}
          </div>
          
          {filteredOrders.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
              totalItems={filteredOrders.length}
            />
          )}
        </div>
      </motion.div>

      {/* Drawer */}
      <OrderDrawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onMarkDelivered={handleMarkDelivered}
        onCancelOrder={handleCancelOrder}
      />

    </div>
  );
};

export default AdminOrdersPage;
