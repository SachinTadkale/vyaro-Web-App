import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

// Mock Data
const MOCK_ORDERS = [
  { id: "ORD-7391", product: "Premium Wheat", farmer: "Raju Rastogi", quantity: "500 KG", totalPrice: "₹15,000", status: "Pending", paymentStatus: "Unpaid" },
  { id: "ORD-8422", product: "Organic Turmeric", farmer: "Suresh Patil", quantity: "100 KG", totalPrice: "₹12,500", status: "Accepted", paymentStatus: "Paid" },
  { id: "ORD-9103", product: "Basmati Rice", farmer: "Amit Singh", quantity: "1000 KG", totalPrice: "₹85,000", status: "Delivered", paymentStatus: "Paid" },
  { id: "ORD-2044", product: "Cotton Bales", farmer: "Kisan Lal", quantity: "50 Bundle", totalPrice: "₹45,000", status: "Cancelled", paymentStatus: "Failed" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1 rounded-md border border-amber-500/20 uppercase tracking-widest shadow-sm">Pending</span>;
    case "Accepted":
      return <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-md border border-blue-500/20 uppercase tracking-widest shadow-sm">Accepted</span>;
    case "Delivered":
      return <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-md border border-green-500/20 uppercase tracking-widest shadow-sm">Delivered</span>;
    case "Cancelled":
      return <span className="bg-destructive/10 text-destructive text-[10px] font-black px-3 py-1 rounded-md border border-destructive/20 uppercase tracking-widest shadow-sm">Cancelled</span>;
    default:
      return <span className="bg-muted text-foreground text-[10px] font-black px-3 py-1 rounded-md border border-border uppercase tracking-widest shadow-sm">{status}</span>;
  }
};

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredOrders = MOCK_ORDERS.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase()) ||
    o.farmer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Orders Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Track and manage your agricultural procurement orders.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by ID, product, or farmer..."
          />
        </div>

        <div className="dashboard-card overflow-hidden bg-card border border-border rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Order ID</TableHead>
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Product</TableHead>
                <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Farmer</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Quantity</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Total Price</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Status</TableHead>
                <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Payment</TableHead>
                <TableHead className="text-right px-4 text-xs uppercase font-black tracking-widest w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No orders found.</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} onClick={() => navigate(`/dashboard/company/orders/${order.id}`)} className="group hover:bg-muted/50 transition-colors cursor-pointer">
                    <TableCell className="py-4 px-4 text-left font-bold text-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <ShoppingBag size={14} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{order.product}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-left text-sm font-semibold text-foreground/80">{order.farmer}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-sm font-black text-foreground">{order.quantity}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-sm font-black text-primary">{order.totalPrice}</TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {order.paymentStatus === "Paid" ? (
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-md border border-green-500/20 uppercase tracking-widest shadow-sm">Paid</span>
                      ) : order.paymentStatus === "Unpaid" ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/payments");
                          }}
                          className="text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span className="bg-destructive/10 text-destructive text-[10px] font-black px-3 py-1 rounded-md border border-destructive/20 uppercase tracking-widest shadow-sm">{order.paymentStatus}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-right">
                      <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm ml-auto">
                        <ChevronRight size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;
