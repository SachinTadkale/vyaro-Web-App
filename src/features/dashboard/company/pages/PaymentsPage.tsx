import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search, CreditCard, ArrowUpRight, CheckCircle, AlertCircle, Clock, X, FileText, Calendar, Wallet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

const MOCK_PAYMENTS = [
  { id: "PAY-10042", orderId: "ORD-9103", amount: "₹85,000", status: "SUCCESS", method: "Bank Transfer", date: "2026-04-01" },
  { id: "PAY-10043", orderId: "ORD-8422", amount: "₹12,500", status: "PENDING", method: "UPI", date: "2026-04-05" },
  { id: "PAY-10044", orderId: "ORD-2044", amount: "₹45,000", status: "FAILED", method: "Credit Card", date: "2026-03-28" },
  { id: "PAY-10045", orderId: "ORD-7391", amount: "₹15,000", status: "HELD / ESCROW", method: "Bank Transfer", date: "2026-04-06" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-md border border-green-500/20 uppercase tracking-widest shadow-sm">Success</span>;
    case "PENDING":
      return <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1 rounded-md border border-amber-500/20 uppercase tracking-widest shadow-sm">Pending</span>;
    case "FAILED":
      return <span className="bg-destructive/10 text-destructive text-[10px] font-black px-3 py-1 rounded-md border border-destructive/20 uppercase tracking-widest shadow-sm">Failed</span>;
    case "HELD / ESCROW":
      return <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-md border border-blue-500/20 uppercase tracking-widest shadow-sm whitespace-nowrap">Held / Escrow</span>;
    default:
      return <span className="bg-muted text-foreground text-[10px] font-black px-3 py-1 rounded-md border border-border uppercase tracking-widest shadow-sm">{status}</span>;
  }
};

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<typeof MOCK_PAYMENTS[0] | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const filteredPayments = payments.filter((p) =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;
    setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, status: "SUCCESS" } : p));
    setSelectedPayment(prev => prev ? { ...prev, status: "SUCCESS" } : null);
    setIsPaying(false);
    toast.success(`Payment for ${selectedPayment.id} confirmed locally.`);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setIsPaying(false);
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Payments & Settlements</h2>
          <p className="text-xs text-muted-foreground mt-1">Track incoming transactions, order payments, and bulk settlements.</p>
        </div>
        <button className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          Download Statement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Settled</p>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">₹2,45,000</p>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center mt-2"><ArrowUpRight size={10} className="mr-1" /> +14.2% from last month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Pending Processing</p>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">₹27,500</p>
          <p className="text-[10px] text-muted-foreground font-bold mt-2">2 transactions awaiting clearance</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Failed Transactions</p>
            <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">₹45,000</p>
          <p className="text-[10px] text-muted-foreground font-bold mt-2">Requires manual intervention</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by Transaction ID or Order ID..."
          />
        </div>

        <div className="dashboard-card overflow-hidden bg-card border border-border rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Payment ID</TableHead>
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Order ID</TableHead>
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Amount</TableHead>
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Method</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Date</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No payments found.</TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow 
                    key={payment.id} 
                    className="group hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <TableCell className="py-4 px-4 text-left font-bold text-foreground">
                      <div className="flex items-center gap-2">
                         <CreditCard size={14} className="text-muted-foreground" />
                         {payment.id}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-left">
                       <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
                          {payment.orderId}
                       </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-left text-sm font-black text-foreground">{payment.amount}</TableCell>
                    <TableCell className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground">{payment.method}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-xs font-medium text-foreground">{payment.date}</TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {getStatusBadge(payment.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
                 <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                   <FileText size={16} /> Payment Receipt
                 </h3>
                 <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors">
                   <X size={16} />
                 </button>
              </div>

              {isPaying ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-foreground">Select Payment Method</h4>
                    <p className="text-xs text-muted-foreground mt-1">Choose how you want to process this transaction.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 hover:border-primary hover:bg-primary/5 transition-colors focus-visible:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <Wallet size={24} className="text-primary mb-2" />
                      <span className="text-xs font-bold text-foreground">UPI / Wallet</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 hover:border-primary hover:bg-primary/5 transition-colors focus-visible:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <CreditCard size={24} className="text-primary mb-2" />
                      <span className="text-xs font-bold text-foreground">Credit Card</span>
                    </button>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button onClick={() => setIsPaying(false)} className="flex-1 text-xs font-black uppercase tracking-widest bg-muted text-foreground py-3 rounded-xl hover:bg-muted/80 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleConfirmPayment} className="flex-1 text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-6 space-y-6">
                    
                    <div className="flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Transaction ID</p>
                     <p className="text-xl font-black text-foreground">{selectedPayment.id}</p>
                   </div>
                   {getStatusBadge(selectedPayment.status)}
                </div>

                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5"><CreditCard size={10} /> Amount Paid</p>
                     <p className="text-lg font-black text-primary">{selectedPayment.amount}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={10} /> Date</p>
                     <p className="text-sm font-bold text-foreground mt-1">{selectedPayment.date}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-xs font-bold text-muted-foreground">Order ID</span>
                      <span className="text-xs font-black text-foreground bg-muted px-2 py-1 rounded-md">{selectedPayment.orderId}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-xs font-bold text-muted-foreground">Payment Method</span>
                      <span className="text-xs font-bold text-foreground">{selectedPayment.method}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-xs font-bold text-muted-foreground">Created At</span>
                      <span className="text-xs font-bold text-foreground">{selectedPayment.date} 09:41 AM</span>
                   </div>
                </div>

              </div>

                  <div className="p-5 border-t border-border bg-muted/20 flex gap-3">
                     {selectedPayment.status === "PENDING" && (
                       <button onClick={() => setIsPaying(true)} className="flex-1 text-xs font-black uppercase tracking-widest bg-amber-500 text-white py-3 rounded-xl shadow-sm hover:bg-amber-600 transition-colors border border-amber-600">
                          Pay Now
                       </button>
                     )}
                     <button className="flex-1 text-xs font-black uppercase tracking-widest bg-muted text-foreground border border-border py-3 rounded-xl shadow-sm hover:bg-muted/80 transition-colors">
                        Download Receipt
                     </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PaymentsPage;
