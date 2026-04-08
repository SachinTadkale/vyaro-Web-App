import { 
  CreditCard, Clock, CheckCircle2, XCircle, FileText, Banknote
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

export interface AdminTransaction {
  id: string;
  orderId: string;
  payer: string;
  payee: string;
  amount: string;
  method: string;
  status: "Success" | "Pending" | "Failed";
  date: string;
  reference?: string;
}

interface TransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: AdminTransaction | null;
  onMarkSuccess: (id: string) => void;
}

const TransactionDrawer = ({ isOpen, onClose, transaction, onMarkSuccess }: TransactionDrawerProps) => {

  if (!transaction) return null;

  const statusLabel = transaction.status;

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    statusLabel === "Success" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    statusLabel === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    statusLabel === "Failed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Transaction Details"
      description={`Review payment receipt for ${transaction.id}`}
      footer={
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap gap-2 justify-end w-full">
            {statusLabel === "Pending" && (
              <Button
                onClick={() => {
                  onMarkSuccess(transaction.id);
                  toast.success("Transaction forced to Success state.");
                  onClose();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
              >
                <CheckCircle2 size={14} />
                Force Clear Payment
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Invoice downloaded!");
              }}
              className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 bg-card text-muted-foreground hover:text-foreground border-border/50 transition-all"
            >
              <FileText size={14} />
              Download Receipt
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6 mt-4">

        {/* ── 1. Header Card ── */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm flex flex-col justify-center items-center text-center">
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            statusLabel === "Success" && "bg-emerald-500",
            statusLabel === "Pending" && "bg-amber-500",
            statusLabel === "Failed" && "bg-rose-500"
          )} />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm">
              <CreditCard size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
              <h3 className="text-4xl font-black tracking-tight text-foreground">{transaction.amount}</h3>
            </div>
            <div className={`mx-auto w-max ${statusPillClass}`}>
              {statusLabel === "Success" && <CheckCircle2 size={12} />}
              {statusLabel === "Pending" && <Clock size={12} />}
              {statusLabel === "Failed" && <XCircle size={12} />}
              {statusLabel}
            </div>
          </div>
        </div>

        {/* ── 2. Detailed Info ── */}
        <div className="space-y-6">

          <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/50">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Banknote size={12} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Payment Information</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Transaction ID</p>
                <p className="text-xs font-mono font-bold text-foreground">{transaction.id}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Order ID</p>
                <p className="text-xs font-mono font-bold text-primary">{transaction.orderId}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Payment Method</p>
                <p className="text-sm font-semibold text-foreground">{transaction.method}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Date & Time</p>
                <p className="text-xs font-semibold text-foreground">{transaction.date}</p>
              </div>
              {transaction.reference && (
                <div className="col-span-2 space-y-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Bank Reference</p>
                  <p className="text-xs font-mono font-medium text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">{transaction.reference}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Transfer Entities</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">From (Payer)</p>
                  <p className="text-sm font-bold text-foreground">{transaction.payer}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">To (Payee)</p>
                  <p className="text-sm font-bold text-foreground">{transaction.payee}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Drawer>
  );
};

export default TransactionDrawer;
