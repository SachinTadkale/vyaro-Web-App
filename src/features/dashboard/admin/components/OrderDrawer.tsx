import { useState } from "react";
import {
  Receipt, ShoppingBag, Leaf,
  Building2, CheckCircle2, Ban, X,
  Clock, Truck
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

export interface AdminOrder {
  id: string;
  farmer: string;
  company: string;
  product: string;
  amount: string;
  status: "Pending" | "In Transit" | "Delivered" | "Cancelled" | "Disputed";
  date: string;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder | null;
  onMarkDelivered: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

const OrderDrawer = ({ isOpen, onClose, order, onMarkDelivered, onCancelOrder }: OrderDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");

  if (!order) return null;

  const statusLabel = order.status;

  const statusIcon = () => {
    switch (statusLabel) {
      case "Pending": return <Clock size={12} />;
      case "In Transit": return <Truck size={12} />;
      case "Delivered": return <CheckCircle2 size={12} />;
      case "Cancelled": return <Ban size={12} />;
      case "Disputed": return <X size={12} />;
      default: return null;
    }
  };

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    statusLabel === "Delivered" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    statusLabel === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    statusLabel === "In Transit" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
    statusLabel === "Cancelled" && "bg-muted/30 text-muted-foreground border-border/50",
    statusLabel === "Disputed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Order Details"
      description={`Reviewing logistics and payment details for ${order.id}`}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full">
          <div className="flex flex-wrap gap-2 justify-end w-full">
            {statusLabel !== "Delivered" && statusLabel !== "Cancelled" && (
              <Button
                variant="outline"
                onClick={() => {
                  onCancelOrder(order.id);
                  toast.success("Order marked as Cancelled.");
                  onClose();
                }}
                className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border-border/50 transition-all"
              >
                <Ban size={14} />
                Cancel Order
              </Button>
            )}
            
            {statusLabel !== "Delivered" && statusLabel !== "Cancelled" && (
              <Button
                onClick={() => {
                  onMarkDelivered(order.id);
                  toast.success("Order marked as Delivered.");
                  onClose();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
              >
                <CheckCircle2 size={14} />
                Mark Delivered
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6 mt-4">

        {/* ── 1. Header Card ── */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm">
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            statusLabel === "Delivered" && "bg-emerald-500",
            statusLabel === "Pending" && "bg-amber-500",
            statusLabel === "In Transit" && "bg-blue-500",
            statusLabel === "Cancelled" && "bg-muted-foreground",
            statusLabel === "Disputed" && "bg-rose-500"
          )} />

          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                <Receipt size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-foreground">{order.id}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{order.date}</span>
                </div>
              </div>
            </div>
            <div className={statusPillClass}>
              {statusIcon()}
              {statusLabel}
            </div>
          </div>
        </div>

        {/* ── 2. Tabs ── */}
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40">
          {[
            { id: "overview", label: "Overview details" },
            { id: "timeline", label: "Logistics Timeline" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "timeline")}
                className={cn(
                  "relative px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 flex-1",
                  active
                    ? "bg-card text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5 border-transparent"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── 3. Tab Content ── */}
        <div>
          {activeTab === "overview" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Order Info */}
              <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag size={12} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Product Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2 space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Item Description</p>
                    <p className="text-sm font-semibold text-foreground">{order.product}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Total Amount</p>
                    <p className="text-lg font-black text-primary">{order.amount}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Quantity</p>
                    <p className="text-sm font-semibold text-foreground">Based on contract</p>
                  </div>
                </div>
              </div>

              {/* Parties Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Leaf size={12} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Seller (Farmer)</h4>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Entity Name</p>
                    <p className="text-sm font-bold text-foreground">{order.farmer}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Building2 size={12} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Buyer (Company)</h4>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Entity Name</p>
                    <p className="text-sm font-bold text-foreground">{order.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                    <Truck size={20} />
                  </div>
                  <p className="text-sm font-bold text-foreground">Timeline details unavailable.</p>
                  <p className="text-xs text-muted-foreground/70">Sync with logistics partner is pending API integration.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default OrderDrawer;
