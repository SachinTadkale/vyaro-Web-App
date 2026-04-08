import { useState } from "react";
import {
  Building2, BarChart3,
  ShoppingCart, Ban,
  Trash2, ShieldAlert, CheckCircle2,
  Clock
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import type { Company } from "../types/admin.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface CompanyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onVerify: () => void;
  onBlock: () => void;
  onFlag: () => void;
  onRemove: () => void;
}

const CompanyDrawer = ({ isOpen, onClose, company, onVerify, onBlock, onFlag, onRemove }: CompanyDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");
  const [isFlagged, setIsFlagged] = useState(false);

  if (!company) return null;

  const isPending = company.kycStatus === "PENDING";
  const isBlocked = company.status === "BLOCKED";
  const accountStatus = isBlocked ? "BLOCKED" : isPending ? "PENDING" : "ACTIVE";

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    accountStatus === "ACTIVE" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    accountStatus === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accountStatus === "BLOCKED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  const handleFlag = () => {
    setIsFlagged(true);
    onFlag();
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Company Inspection"
      description={`Reviewing registration & business activity for ${company.companyName}`}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex flex-wrap gap-2">
            {isPending && (
              <Button
                onClick={onVerify}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
              >
                <CheckCircle2 size={14} />
                Verify Company
              </Button>
            )}
            <Button
              variant={isFlagged ? "secondary" : "outline"}
              onClick={handleFlag}
              className={cn(
                "h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 transition-all",
                isFlagged
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                  : "border-border/50 text-yellow-500 hover:bg-yellow-500/10"
              )}
            >
              <ShieldAlert size={14} />
              {isFlagged ? "Flagged" : "Flag Issues"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {!isBlocked ? (
              <Button
                variant="destructive"
                onClick={onBlock}
                className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 transition-all"
              >
                <Ban size={14} />
                Suspend
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onVerify}
                className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 transition-all"
              >
                <CheckCircle2 size={14} />
                Unblock
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onRemove}
              className="h-9 w-9 px-0 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Remove Company"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6">

        {/* ── 1. Header Card ── */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm">
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            accountStatus === "ACTIVE" && "bg-emerald-500",
            accountStatus === "PENDING" && "bg-amber-500",
            accountStatus === "BLOCKED" && "bg-rose-500"
          )} />

          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                <Building2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-foreground">{company.companyName}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{company.hqLocation}</span>
                  <span className="opacity-30">•</span>
                  <span>Joined {company.joinedDate}</span>
                </div>
              </div>
            </div>
            <div className={statusPillClass}>
              {accountStatus === "ACTIVE" && <CheckCircle2 size={12} />}
              {accountStatus === "PENDING" && <Clock size={12} />}
              {accountStatus === "BLOCKED" && <Ban size={12} />}
              {accountStatus}
            </div>
          </div>
        </div>

        {/* ── 2. Tabs ── */}
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40">
          {[
            { id: "overview", label: "Overview details" },
            { id: "activity", label: "Activity & Docs" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "activity")}
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

              {/* Business Info */}
              <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                  <div className="w-6 h-6 rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground">
                    <Building2 size={12} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Business Information</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2 space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Registered Entity Name</p>
                    <p className="text-sm font-semibold text-foreground">{company.companyName}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">GST Number</p>
                    <p className="text-sm font-semibold text-foreground font-mono tracking-wide">{company.gstNumber}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Registration No.</p>
                    <p className="text-sm font-semibold text-foreground font-mono tracking-wide">{company.regNumber}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">{company.email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Phone</p>
                    <p className="text-sm font-semibold text-foreground">{company.phone}</p>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">HQ Location</p>
                    <p className="text-sm font-semibold text-foreground">{company.hqLocation}</p>
                  </div>
                </div>
              </div>

              {/* KYC Verification */}
              <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={12} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">KYC Verification</h4>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {(company.kycStatus === "VERIFIED" || company.kycStatus === "APPROVED")
                        ? "Identity Verified"
                        : company.kycStatus === "REJECTED"
                        ? "Verification Failed"
                        : "Action Required"}
                    </p>
                    <p className="text-[10px] mt-0.5 text-muted-foreground font-medium">Review submitted documents for final approval</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
                    (company.kycStatus === "VERIFIED" || company.kycStatus === "APPROVED") && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    company.kycStatus === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    company.kycStatus === "REJECTED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  )}>
                    {company.kycStatus}
                  </span>
                </div>
              </div>
            </div>

          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center hover:border-primary/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <ShoppingCart size={14} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{company.activity.totalOrders}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Total Orders</p>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center hover:border-emerald-500/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                    <BarChart3 size={14} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{company.activity.activeListings}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Active Listings</p>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center hover:border-amber-500/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                    <span className="text-xs font-black">₹</span>
                  </div>
                  <p className="text-base font-black text-foreground leading-tight">{company.activity.purchaseVolume}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Purchase Vol.</p>
                </div>
              </div>

              {/* Financial detail + Documents side by side */}
              <div className="grid gap-4 md:grid-cols-2">

                {/* Financial Activity */}
                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <BarChart3 size={12} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Financial Activity</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <span className="text-xs font-bold text-muted-foreground">Orders Placed</span>
                      <span className="text-sm font-black text-foreground">{company.activity.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <span className="text-xs font-bold text-muted-foreground">Active Listings</span>
                      <span className="text-sm font-black text-foreground">{company.activity.activeListings}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-xs font-bold text-primary/80">Purchase Volume</span>
                      <span className="text-sm font-black text-primary">{company.activity.purchaseVolume}</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 size={12} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Documents</h4>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/40 border border-border/50 px-2 py-0.5 rounded-full">Preview only</span>
                  </div>
                  <div className="space-y-3">

                    {/* GST Certificate */}
                    <button
                      onClick={() => undefined}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-black text-primary">GST</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors">GST Certificate</p>
                          <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5 truncate max-w-[80px]">{company.gstNumber}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full shrink-0">
                        View
                      </span>
                    </button>

                    {/* PAN Card */}
                    <button
                      onClick={() => undefined}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-black text-amber-500">PAN</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground group-hover:text-amber-500 transition-colors">PAN Card</p>
                          <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">Official Tax ID</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500/60 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded-full shrink-0">
                        View
                      </span>
                    </button>

                    {/* Registration Doc */}
                    <button
                      onClick={() => undefined}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-black text-emerald-500 leading-none text-center">REG</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground group-hover:text-emerald-500 transition-colors">Reg. Document</p>
                          <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5 truncate max-w-[80px]">No. {company.regNumber}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded-full shrink-0">
                        View
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CompanyDrawer;
