import { 
  User, LandPlot, 
  CreditCard, ShieldCheck, 
  BarChart3, ShoppingCart, Calendar,
  ShieldAlert, Ban, UserCheck, Trash2
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

const InfoSection = ({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
  <div className={cn("space-y-4 mb-10", className)}>
    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
      <Icon size={14} className="text-primary/60" />
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">{title}</h4>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value, subValue, masked = false }: { label: string, value: string, subValue?: string, masked?: boolean }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/30">{label}</p>
    <p className={cn("text-xs font-bold text-foreground truncate", masked && "tracking-[0.3em] font-mono opacity-60")}>
      {masked ? "•••• •••• " + value.slice(-4) : value}
    </p>
    {subValue && <p className="text-[10px] text-muted-foreground/60 italic">{subValue}</p>}
  </div>
);

const UserDrawer = ({ isOpen, onClose, farmer, onVerify, onBlock, onFlag, onRemove }: UserDrawerProps) => {
  if (!farmer) return null;

  const isPending = farmer.kycStatus === "PENDING";
  const isBlocked = farmer.status === "BLOCKED";

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Farmer Inspection"
      description={`Reviewing platform activity for ${farmer.name}`}
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {isPending && (
              <Button 
                onClick={onVerify}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2"
              >
                <UserCheck size={14} />
                Verify Farmer
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={onFlag}
              className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 border-border/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <ShieldAlert size={14} />
              Flag
            </Button>
          </div>
          
          <div className="flex gap-2">
            {!isBlocked ? (
              <Button 
                variant="destructive"
                onClick={onBlock}
                className="bg-red-500 hover:bg-red-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2"
              >
                <Ban size={14} />
                Block
              </Button>
            ) : (
                <Button 
                    variant="outline"
                    onClick={onVerify} // reuse verify for unblock logic in real app
                    className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                >
                    <UserCheck size={14} />
                    Unblock
                </Button>
            )}
            <Button 
              variant="ghost"
              onClick={onRemove}
              className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Remove
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-0">
        <InfoSection title="Basic Information" icon={User}>
          <InfoItem label="Full Name" value={farmer.name} />
          <InfoItem label="Phone" value={farmer.phone} />
          <InfoItem label="Email Address" value={farmer.email} />
          <InfoItem label="Gender" value={farmer.gender} />
          <div className="col-span-2">
            <InfoItem label="Residential Address" value={farmer.address} />
          </div>
        </InfoSection>

        <InfoSection title="Farm Information" icon={LandPlot} className="pt-8 border-t border-border/10">
          <InfoItem label="State" value={farmer.state} />
          <InfoItem label="District" value={farmer.district} />
          <InfoItem label="Village" value={farmer.village} />
          <InfoItem label="Total Land Area" value={farmer.landArea} />
        </InfoSection>

        <InfoSection title="Bank Information" icon={CreditCard} className="pt-8 border-t border-border/10">
          <InfoItem label="Bank Name" value={farmer.bankInfo.bankName} />
          <InfoItem label="Account Number" value={farmer.bankInfo.accountNumber} masked />
          <InfoItem label="IFSC Code" value={farmer.bankInfo.ifsc} />
        </InfoSection>

        <InfoSection title="KYC & Verification" icon={ShieldCheck} className="pt-8 border-t border-border/10">
          <div className="col-span-2">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Current Status</p>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded",
                  farmer.kycStatus === 'VERIFIED' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                )}>
                  {farmer.kycStatus}
                </span>
              </div>
              <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline h-auto p-0">
                View Full KYC Details ↗
              </Button>
            </div>
          </div>
        </InfoSection>

        <InfoSection title="Platform Activity" icon={BarChart3} className="pt-8 border-t border-border/10">
          <div className="bg-muted/10 rounded-xl p-4 col-span-2 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-1 text-primary/60"><LandPlot size={14} /></div>
              <p className="text-lg font-bold text-foreground">{farmer.activity.totalListings}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Total Listings</p>
            </div>
            <div className="text-center border-x border-border/30">
              <div className="flex justify-center mb-1 text-primary/60"><ShoppingCart size={14} /></div>
              <p className="text-lg font-bold text-foreground">{farmer.activity.totalOrders}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Total Orders</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1 text-primary/60"><Calendar size={14} /></div>
              <p className="text-xs font-bold text-foreground mt-1.5">{farmer.activity.lastActive}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Last Active</p>
            </div>
          </div>
        </InfoSection>
      </div>
    </Drawer>
  );
};

export default UserDrawer;
