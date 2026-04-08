import { useState } from "react";
import { Search, SlidersHorizontal, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/common/Table";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import TransactionDrawer, { type AdminTransaction } from "../components/TransactionDrawer";

const MOCK_TRANSACTIONS: AdminTransaction[] = [
  { id: "TXN-7489201", orderId: "#ORD-9201", payer: "AgroCorp India", payee: "Ramesh Patil", amount: "₹12,450", method: "Bank Transfer", status: "Success", date: "Apr 8, 2026 10:45 AM", reference: "HDFC000123456" },
  { id: "TXN-7489198", orderId: "#ORD-9198", payer: "Green Valley", payee: "Suresh Jadhav", amount: "₹45,200", method: "UPI", status: "Pending", date: "Apr 8, 2026 09:12 AM" },
  { id: "TXN-7489195", orderId: "#ORD-9195", payer: "FarmTrade", payee: "Kisan Lal", amount: "₹8,900", method: "Credit Card", status: "Failed", date: "Apr 7, 2026 04:30 PM", reference: "CC_REJ_992" },
  { id: "TXN-7489192", orderId: "#ORD-9192", payer: "AgroTech", payee: "Manish Kumar", amount: "₹32,000", method: "Bank Transfer", status: "Success", date: "Apr 6, 2026 11:15 AM", reference: "SBIN0008899" },
  { id: "TXN-7489190", orderId: "#ORD-9190", payer: "SeedCo", payee: "Dnyaneshwar", amount: "₹88,000", method: "RTGS", status: "Success", date: "Apr 5, 2026 02:20 PM", reference: "RTGS_MH_5541" },
  { id: "TXN-7489188", orderId: "#ORD-9188", payer: "Naturals Ltd", payee: "Anil Singh", amount: "₹1,20,000", method: "Bank Transfer", status: "Pending", date: "Apr 4, 2026 10:00 AM" },
];

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(MOCK_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);

  // Filters
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(search.toLowerCase()) || 
      t.orderId.toLowerCase().includes(search.toLowerCase()) || 
      t.payer.toLowerCase().includes(search.toLowerCase()) ||
      t.payee.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedTransactions = filteredTransactions.slice(startIdx, endIdx);

  // Actions
  const handleMarkSuccess = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "Success" } : t));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Success": return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Pending": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Failed": return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default: return "bg-muted text-muted-foreground border border-border";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Transactions Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Audit all platform payments and settlements.</p>
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
              placeholder="Search by TXN ID, Order ID, Payer, or Payee..."
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/20 border border-border/50 text-sm font-bold text-muted-foreground whitespace-nowrap shrink-0">
              <SlidersHorizontal size={16} />
              <span>Status</span>
            </div>
            {["All", "Success", "Pending", "Failed"].map(s => (
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
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Transaction Details</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Entities (Payer &rarr; Payee)</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Method</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Amount</TableHead>
                  <TableHead className="text-center px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Status</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/20">
                {displayedTransactions.map((t) => (
                  <TableRow 
                    key={t.id} 
                    onClick={() => setSelectedTransaction(t)}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors">{t.id}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{t.orderId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-foreground/90">{t.payer}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">to {t.payee}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="font-semibold text-xs text-foreground/80">{t.method}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className="font-black text-sm text-primary">{t.amount}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-center">
                      <span className={`${getStatusClass(t.status)} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm`}>
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <span className="font-semibold text-xs text-muted-foreground/80">{t.date}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredTransactions.length === 0 && (
              <TableEmptyState description="No transactions match your search criteria." />
            )}
          </div>
          
          {filteredTransactions.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
              totalItems={filteredTransactions.length}
            />
          )}
        </div>
      </motion.div>

      {/* Drawer */}
      <TransactionDrawer
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onMarkSuccess={handleMarkSuccess}
      />

    </div>
  );
};

export default AdminTransactionsPage;
