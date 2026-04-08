import { useState } from "react";
import { 
  User, LandPlot, 
  CreditCard, 
  ShieldAlert, Ban, UserCheck, Trash2, ShieldCheck, MapPin, Calendar, Clock, ShoppingCart, List
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import type { Farmer } from "../types/admin.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: Farmer | null;
  onVerify: () => void;
  onBlock: () => void;
  onFlag: () => void;
  onRemove: () => void;
}

const InfoSection = ({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) => (
  <div className={cn("space-y-4 mb-8", className)}>
    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
      <div className="w-6 h-6 rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground">
        <Icon size={12} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</h4>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
  </div>
);

const InfoItem = ({ label, value, subValue, masked = false }: { label: string; value: string; subValue?: string; masked?: boolean }) => (
  <div className="space-y-1.5">
    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{label}</p>
    <p className={cn("text-sm font-semibold text-foreground truncate", masked && "tracking-[0.2em] font-mono opacity-80")}>
      {masked ? "•••• •••• " + value.slice(-4) : value}
    </p>
    {subValue && <p className="text-[10px] text-muted-foreground/60 italic">{subValue}</p>}
  </div>
);

const UserDrawer = ({ isOpen, onClose, farmer, onVerify, onBlock, onFlag, onRemove }: UserDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");
  const [isFlagged, setIsFlagged] = useState(false);

  if (!farmer) return null;

  const isPending = farmer.kycStatus === "PENDING";
  const isBlocked = farmer.status === "BLOCKED";
  const accountStatus = isBlocked ? "BLOCKED" : isPending ? "PENDING" : "ACTIVE";

  const statusPillClass = cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
    accountStatus === "ACTIVE" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    accountStatus === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accountStatus === "BLOCKED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
  );

  const recentActivity = [
    {
      title: "New listing published",
      detail: "Organic millet batch added",
      time: "Today · 3h ago",
      icon: List,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Order confirmed",
      detail: "20 units picked up",
      time: "Yesterday · 11:15",
      icon: ShoppingCart,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Profile review",
      detail: "KYC documents verified",
      time: "2 days ago",
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/10"
    },
  ];

  const handleFlag = () => {
    setIsFlagged(true);
    onFlag();
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Farmer Inspection"
      description={`Reviewing platform activity for ${farmer.name}`}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex flex-wrap gap-2">
            {isPending && (
              <Button
                onClick={onVerify}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 shadow-sm"
              >
                <UserCheck size={14} />
                Verify Farmer
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
                <UserCheck size={14} />
                Unblock
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onRemove}
              className="h-9 w-9 px-0 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Remove from List"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6">
        {/* --- 1. Header (Identity & Status) --- */}
        <div className="rounded-3xl bg-card border border-border/50 p-6 relative overflow-hidden shadow-sm">
          {/* subtle glow based on status */}
          <div className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none",
            accountStatus === 'ACTIVE' && "bg-emerald-500",
            accountStatus === 'PENDING' && "bg-amber-500",
            accountStatus === 'BLOCKED' && "bg-rose-500"
          )} />
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                <User size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black tracking-tight text-foreground">{farmer.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} className="opacity-50" /> {farmer.location}</span>
                  <span className="opacity-30">•</span>
                  <span className="flex items-center gap-1"><Calendar size={12} className="opacity-50" /> Joined {farmer.joinedDate}</span>
                </div>
              </div>
            </div>
            <div className={statusPillClass}>
              {accountStatus === 'ACTIVE' && <ShieldCheck size={12} />}
              {accountStatus === 'PENDING' && <Clock size={12} />}
              {accountStatus === 'BLOCKED' && <Ban size={12} />}
              {accountStatus}
            </div>
          </div>
        </div>

        {/* --- 2. Tabs Navigation --- */}
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40">
          {[
            { id: "overview", label: "Overview details" },
            { id: "activity", label: "Activity stats" },
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

        {/* --- 3. Tab Content --- */}
        <div className="mt-6">
          {activeTab === "overview" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-8">
                  <InfoSection title="Basic Information" icon={User}>
                    <InfoItem label="Full Name" value={farmer.name} />
                    <InfoItem label="Gender" value={farmer.gender} />
                    <InfoItem label="Phone Number" value={farmer.phone} />
                    <InfoItem label="Email Address" value={farmer.email} />
                    <div className="col-span-2">
                      <InfoItem label="Residential Address" value={farmer.address} />
                    </div>
                  </InfoSection>

                  <InfoSection title="Bank Settlement" icon={CreditCard}>
                    <InfoItem label="Bank Name" value={farmer.bankInfo.bankName} />
                    <InfoItem label="IFSC Code" value={farmer.bankInfo.ifsc} />
                    <div className="col-span-2">
                      <InfoItem label="Account Number" value={farmer.bankInfo.accountNumber} masked />
                    </div>
                  </InfoSection>
                </div>

                <div className="space-y-8">
                  <InfoSection title="Farm Information" icon={LandPlot}>
                    <InfoItem label="State" value={farmer.state} />
                    <InfoItem label="District" value={farmer.district} />
                    <InfoItem label="Village" value={farmer.village} />
                    <InfoItem label="Total Land Area" value={farmer.landArea} />
                  </InfoSection>

                  {/* Verification Status Block */}
                  <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck size={12} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">KYC Verification</h4>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                         <p className="text-sm font-bold text-foreground">{farmer.kycStatus === 'VERIFIED' ? 'Identity Verified' : farmer.kycStatus === 'REJECTED' ? 'Verification Failed' : 'Action Required'}</p>
                         <p className="text-[10px] mt-0.5 text-muted-foreground font-medium">Review submitted documents for final approval</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.18em] border shadow-sm",
                        farmer.kycStatus === "VERIFIED" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        farmer.kycStatus === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        farmer.kycStatus === "REJECTED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {farmer.kycStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Activity Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center hover:border-primary/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2"><List size={14} /></div>
                  <p className="text-2xl font-black text-foreground">{farmer.activity.totalListings}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Total Listings</p>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center hover:border-emerald-500/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2"><ShoppingCart size={14} /></div>
                  <p className="text-2xl font-black text-foreground">{farmer.activity.totalOrders}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Total Orders</p>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-4 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mb-2"><Clock size={14} /></div>
                  <p className="text-lg font-bold text-foreground mt-1">{farmer.activity.lastActive}</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50 mt-1">Last Active</p>
                </div>
              </div>

              {/* Order Issues & Activity List */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <ShieldAlert size={12} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Risk Profile</h4>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                        <span className="text-xs font-bold text-muted-foreground">Orders Completed</span>
                        <span className="text-sm font-black text-foreground">{farmer.activity.totalOrders}</span>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <span className="text-xs font-bold text-rose-500/80">Open Disputes</span>
                        <span className="text-sm font-black text-rose-500">{Math.max(0, Math.floor(farmer.activity.totalOrders * 0.1))}</span>
                     </div>
                   </div>
                </div>

                <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <Clock size={12} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Recent Log</h4>
                     </div>
                     <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/40 border border-border/50 px-2 py-0.5 rounded-full">Mock</span>
                  </div>
                  
                  <div className="space-y-3">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start relative">
                        {i !== recentActivity.length - 1 && <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border/50" />}
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10", item.bg, item.color)}>
                          <item.icon size={12} />
                        </div>
                        <div className="space-y-0.5 pb-2">
                          <p className="text-xs font-bold text-foreground">{item.title}</p>
                          <p className="text-[11px] font-medium text-muted-foreground">{item.detail}</p>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/40 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
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

export default UserDrawer;
