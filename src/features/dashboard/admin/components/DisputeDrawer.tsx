import { AlertTriangle, Receipt, CheckCircle2, Ban } from "lucide-react";
import Drawer from "@/components/common/Drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

export interface AdminDispute {
  id: string;
  orderId: string;
  raisedBy: string;
  against: string;
  reason: string;
  category: "Quality" | "Logistics" | "Payment" | "Other";
  status: "Open" | "In Review" | "Resolved" | "Rejected";
  date: string;
  description: string;
}

interface DisputeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: AdminDispute | null;
  onResolve: (id: string) => void;
  onReject: (id: string, message: string) => void;
}

const DisputeDrawer = ({ isOpen, onClose, dispute, onResolve, onReject }: DisputeDrawerProps) => {

  if (!dispute) return null;

  const statusLabel = dispute.status;

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    statusLabel === "Resolved" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    (statusLabel === "Open" || statusLabel === "In Review") && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    statusLabel === "Rejected" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Dispute Ticket"
      description={`Reviewing escalation for ${dispute.orderId}`}
      footer={
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap gap-2 justify-end w-full">
            {statusLabel !== "Resolved" && statusLabel !== "Rejected" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    const msg = window.prompt("Enter rejection reason:");
                    if(msg) {
                      onReject(dispute.id, msg);
                      toast.success("Dispute rejected successfully.");
                      onClose();
                    }
                  }}
                  className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-card text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border-border/50 transition-all"
                >
                  <Ban size={14} />
                  Reject Claim
                </Button>
                <Button
                  onClick={() => {
                    onResolve(dispute.id);
                    toast.success("Dispute marked as Resolved.");
                    onClose();
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
                >
                  <CheckCircle2 size={14} />
                  Resolve Issue
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6 mt-4">

        {/* ── 1. Header Card ── */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm flex flex-col justify-center items-center text-center">
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            statusLabel === "Resolved" && "bg-emerald-500",
            (statusLabel === "Open" || statusLabel === "In Review") && "bg-amber-500",
            statusLabel === "Rejected" && "bg-rose-500"
          )} />

          <div className="relative z-10 space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full bg-muted/40 border border-border/50 flex items-center justify-center shadow-sm ${
              statusLabel === "Resolved" ? "text-emerald-500" :
              statusLabel === "Rejected" ? "text-rose-500" : "text-amber-500"
            }`}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Escalation Category</p>
              <h3 className="text-2xl font-black tracking-tight text-foreground">{dispute.category} Issue</h3>
            </div>
            <div className={`mx-auto w-max ${statusPillClass}`}>
              {statusLabel}
            </div>
          </div>
        </div>

        {/* ── 2. Detailed Info ── */}
        <div className="space-y-6">

          <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/50">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Receipt size={12} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ticket Information</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Ticket ID</p>
                <p className="text-xs font-mono font-bold text-foreground">{dispute.id}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Linked Order</p>
                <p className="text-xs font-mono font-bold text-primary">{dispute.orderId}</p>
              </div>
              <div className="col-span-2 space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 text-rose-500">Primary Reason</p>
                <p className="text-sm font-black text-rose-500 truncate">{dispute.reason}</p>
              </div>
              <div className="col-span-2 space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Filing Date</p>
                <p className="text-xs font-semibold text-foreground">{dispute.date}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 pb-2 border-b border-border/50">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Complainant Statement</h4>
             </div>
             <p className="text-sm text-foreground/80 leading-relaxed">
               {dispute.description || "No specific statement text provided."}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60">Raised By</h4>
              </div>
              <div className="pt-2">
                <p className="text-sm font-bold text-foreground">{dispute.raisedBy}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Against Entity</h4>
              </div>
              <div className="pt-2">
                <p className="text-sm font-bold text-foreground">{dispute.against}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Drawer>
  );
};

export default DisputeDrawer;
