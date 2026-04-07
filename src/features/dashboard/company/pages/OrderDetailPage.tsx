import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Package, User, MapPin, CreditCard, Calendar, Truck, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

const MOCK_ORDERS = [
  { id: "ORD-7391", product: "Premium Wheat", farmer: "Raju Rastogi", quantity: "500 KG", totalPrice: "₹15,000", status: "Pending", date: "2026-04-06", location: "Pune, Maharashtra", paymentStatus: "Awaiting Confirmation", unitPrice: "₹30/KG" },
  { id: "ORD-8422", product: "Organic Turmeric", farmer: "Suresh Patil", quantity: "100 KG", totalPrice: "₹12,500", status: "Accepted", date: "2026-04-05", location: "Nashik, Maharashtra", paymentStatus: "Advance Paid", unitPrice: "₹125/KG" },
  { id: "ORD-9103", product: "Basmati Rice", farmer: "Amit Singh", quantity: "1000 KG", totalPrice: "₹85,000", status: "Delivered", date: "2026-04-01", location: "Karnal, Haryana", paymentStatus: "Settled", unitPrice: "₹85/KG" },
  { id: "ORD-2044", product: "Cotton Bales", farmer: "Kisan Lal", quantity: "50 Bundle", totalPrice: "₹45,000", status: "Cancelled", date: "2026-03-28", location: "Nagpur, Maharashtra", paymentStatus: "Refunded", unitPrice: "₹900/Bundle" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">Pending</span>;
    case "Accepted":
      return <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">Accepted</span>;
    case "Delivered":
      return <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">Delivered</span>;
    case "Cancelled":
      return <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest">Cancelled</span>;
    default:
      return <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-500/20 uppercase tracking-widest">{status}</span>;
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(() => MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0]);

  const handleStatusChange = (newStatus: string) => {
    setOrder(prev => ({ ...prev, status: newStatus }));
    toast.success(`Order status updated to ${newStatus}`);
  };

  const renderActionButtons = () => {
    switch (order.status) {
      case "Pending": // CREATED
        return (
          <button onClick={() => handleStatusChange("Cancelled")} className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl hover:bg-destructive/20 transition-colors shadow-sm">
            Cancel Order
          </button>
        );
      case "Accepted": // ACCEPTED
        return (
          <button onClick={() => handleStatusChange("Processing")} className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            Confirm Order
          </button>
        );
      case "Processing": // PROCESSING
        return (
          <button onClick={() => handleStatusChange("In_Transit")} className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            Mark as Dispatched
          </button>
        );
      case "In_Transit": // IN_TRANSIT
        return (
          <button onClick={() => handleStatusChange("Delivered")} className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm border border-green-600">
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  };

  const TIMELINE_STEPS = ["CREATED", "ACCEPTED", "CONFIRMED", "PROCESSING", "DISPATCHED", "IN_TRANSIT", "DELIVERED", "COMPLETED"];
  
  const currentStepIndex = (() => {
    switch (order.status) {
      case "Pending": return 0;
      case "Accepted": return 1;
      case "Confirmed": return 2;
      case "Processing": return 3;
      case "Dispatched": return 4;
      case "In_Transit": return 5;
      case "Delivered": return 7; // COMPLETED
      case "Cancelled": return -1;
      default: return 0;
    }
  })();
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="flex-1 space-y-6 pt-2 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/orders")} 
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-foreground border border-border"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
              Order {order.id} {getStatusBadge(order.status)}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><Calendar size={12} /> Placed on {order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {renderActionButtons()}
          <button
            onClick={() => navigate("/messages", {
              state: {
                farmerName: order.farmer,
                product: order.product,
                listingId: order.id,
              }
            })}
            className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-muted text-foreground border border-border rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors shadow-sm flex items-center gap-2"
          >
            <MessageSquare size={13} />
            Message Farmer
          </button>
          <button className="text-[11px] uppercase tracking-widest font-black px-5 py-2.5 bg-muted text-foreground border border-border rounded-xl hover:bg-muted/80 transition-colors shadow-sm">
            Download Invoice
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Order Timeline */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
              <Truck size={14} /> Tracking & Timeline
            </h3>
            <div className="flex justify-between items-center relative min-w-[600px] pb-2">
              {/* Background Line */}
              <div className="absolute top-3 left-0 w-full h-[2px] bg-muted -z-10 rounded-full"></div>
              
              {/* Active Line */}
              {!isCancelled && (
                <div 
                  className="absolute top-3 left-0 h-[2px] bg-primary -z-10 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                ></div>
              )}
              
              {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = !isCancelled && idx < currentStepIndex;
                const isCurrent = !isCancelled && idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center gap-3 w-16">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20' : isCurrent ? 'bg-background border-primary text-primary shadow-sm shadow-primary/20' : 'bg-background border-muted text-muted-foreground'}`}>
                      {isCompleted ? <CheckCircle size={10} strokeWidth={4} /> : (idx + 1)}
                    </div>
                    <span 
                      className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    >
                      {step.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
            {isCancelled && (
              <div className="mt-6 flex items-center justify-center p-3 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-xs font-bold uppercase tracking-widest">
                Order was Cancelled inside the system
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
              <Package size={14} /> Product Details
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
                  <TableHead className="text-[10px] uppercase font-black tracking-widest h-10 rounded-l-lg">Product Info</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black tracking-widest h-10">Rate</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black tracking-widest h-10">Quantity</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-black tracking-widest h-10 rounded-r-lg">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableCell className="py-4 px-2">
                    <span className="text-sm font-bold text-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">{order.product}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right text-xs font-semibold text-muted-foreground">{order.unitPrice}</TableCell>
                  <TableCell className="py-4 text-right text-sm font-black text-foreground">{order.quantity}</TableCell>
                  <TableCell className="py-4 text-right text-sm font-black text-primary">{order.totalPrice}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end mt-2 pt-5 border-t border-border/50">
              <div className="w-64 space-y-3">
                 <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                   <span>Subtotal</span>
                   <span className="text-foreground">{order.totalPrice}</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                   <span>Est. Shipping & Taxes</span>
                   <span>TBD</span>
                 </div>
                 <div className="flex justify-between text-lg font-black text-foreground pt-3 border-t border-border/50 mt-1">
                   <span>Total</span>
                   <span className="text-primary">{order.totalPrice}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
              <User size={14} /> Farmer Information
            </h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                {order.farmer.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{order.farmer}</p>
                <p className="text-[10px] text-green-500 flex items-center gap-1 font-bold uppercase tracking-widest mt-1"><CheckCircle size={10} /> Verified</p>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1"><MapPin size={10} /> Location</p>
               <p className="text-xs font-semibold text-foreground">{order.location}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
              <CreditCard size={14} /> Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Amount Due</p>
                <p className="text-2xl font-black text-foreground tracking-tight">{order.totalPrice}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Status</p>
                <span className="bg-muted/50 text-foreground text-xs font-bold px-3 py-1.5 rounded-lg border border-border/50">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;
