import { useState } from "react";
import { 
  Store, User, MapPin, 
  CheckCircle2, Ban, X, ShieldAlert, FileText, IndianRupee
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

export interface DashboardListing {
  id: string;
  productName: string;
  farmerName: string;
  category: string;
  quantity: string;
  price: string;
  location: string;
  status: "Active" | "Pending" | "Rejected";
  date: string;
  description?: string;
}

interface ListingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listing: DashboardListing | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const ListingDrawer = ({ isOpen, onClose, listing, onApprove, onReject }: ListingDrawerProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  if (!listing) return null;

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting this listing.");
      return;
    }
    onReject(listing.id, rejectReason);
    toast.success("Listing rejected successfully.");
    setIsRejecting(false);
    setRejectReason("");
    onClose();
  };

  const statusLabel = listing.status;

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    statusLabel === "Active" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    statusLabel === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    statusLabel === "Rejected" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  return (
    <Drawer
      open={isOpen}
      onClose={() => {
        setIsRejecting(false);
        setRejectReason("");
        onClose();
      }}
      title="Listing Inspection"
      description={`Review agricultural produce listing from ${listing.farmerName}`}
      footer={
        <div className="flex flex-col w-full">
          {isRejecting ? (
            <div className="space-y-3 w-full bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl">
              <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1 block">Reason for Rejection *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g., Price manipulation, Invalid description, Unverified category..."
                className="w-full bg-background border border-rose-500/30 rounded-lg p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500 h-20 resize-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setIsRejecting(false)} className="h-8 text-xs hover:bg-rose-500/10 text-muted-foreground">Cancel</Button>
                <Button onClick={handleReject} className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-widest uppercase">Confirm Reject</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-end w-full">
              {statusLabel === "Pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsRejecting(true)}
                    className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-card text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border-border/50 transition-all"
                  >
                    <Ban size={14} />
                    Reject Listing
                  </Button>
                  <Button
                    onClick={() => {
                      onApprove(listing.id);
                      toast.success("Listing actively published to marketplace.");
                      onClose();
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    Approve & Publish
                  </Button>
                </>
              )}
              {statusLabel === "Active" && (
                <Button
                    variant="outline"
                    onClick={() => setIsRejecting(true)}
                    className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-card text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border-border/50 transition-all"
                  >
                    <ShieldAlert size={14} />
                    Take Down Listing
                </Button>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6 pb-6 mt-4">

        {/* ── 1. Header Card ── */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm">
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            statusLabel === "Active" && "bg-emerald-500",
            statusLabel === "Pending" && "bg-amber-500",
            statusLabel === "Rejected" && "bg-rose-500"
          )} />

          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                <Store size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-foreground">{listing.productName}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{listing.category}</span>
                  <span className="opacity-30">•</span>
                  <span>{listing.date}</span>
                </div>
              </div>
            </div>
            <div className={statusPillClass}>
              {statusLabel === "Active" && <CheckCircle2 size={12} />}
              {statusLabel === "Pending" && <ShieldAlert size={12} />}
              {statusLabel === "Rejected" && <X size={12} />}
              {statusLabel}
            </div>
          </div>
        </div>

        {/* ── 2. Detailed Info ── */}
        <div className="space-y-6">

          {/* Pricing & Quantity Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-1 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary"><IndianRupee size={12}/></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Asking Price</p>
              </div>
              <p className="text-2xl font-black text-foreground">{listing.price}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">Per metric unit</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-1 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary"><FileText size={12}/></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Total Quantity</p>
              </div>
              <p className="text-2xl font-black text-foreground">{listing.quantity}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">Available stock</p>
            </div>
          </div>

          {/* Farmer & Location Info */}
          <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/50">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <User size={12} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Seller Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Farmer Name</p>
                <p className="text-sm font-semibold text-foreground">{listing.farmerName}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Verification</p>
                <p className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-max">Verified KYC</p>
              </div>
              <div className="col-span-2 space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1"><MapPin size={10}/> Location</p>
                <p className="text-sm font-semibold text-foreground">{listing.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 pb-2 border-b border-border/50">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Produce Description</h4>
             </div>
             <p className="text-sm text-foreground/80 leading-relaxed">
               {listing.description || "No specific details provided by the seller regarding quality or variant."}
             </p>
          </div>

        </div>
      </div>
    </Drawer>
  );
};

export default ListingDrawer;
