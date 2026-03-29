import { 
  Building2, ShieldCheck, BarChart3, 
  TrendingUp, ShoppingCart, Ban, 
  Trash2, ShieldAlert, CheckCircle2
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

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/30">{label}</p>
    <p className="text-xs font-bold text-foreground truncate">{value}</p>
  </div>
);

const CompanyDrawer = ({ isOpen, onClose, company, onVerify, onBlock, onFlag, onRemove }: CompanyDrawerProps) => {
  if (!company) return null;

  const isPending = company.kycStatus === "PENDING";
  const isBlocked = company.status === "BLOCKED";

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Company Inspection"
      description={`Reviewing registration & business activity for ${company.companyName}`}
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {isPending && (
              <Button 
                onClick={onVerify}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2"
              >
                <CheckCircle2 size={14} />
                Verify Company
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
                    onClick={onVerify}
                    className="h-9 px-4 text-xs font-bold uppercase tracking-widest gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                >
                    <CheckCircle2 size={14} />
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
        <InfoSection title="Company Information" icon={Building2}>
          <div className="col-span-2">
            <InfoItem label="Entity Name" value={company.companyName} />
          </div>
          <InfoItem label="GST Number" value={company.gstNumber} />
          <InfoItem label="Registration No" value={company.regNumber} />
          <InfoItem label="Email" value={company.email} />
          <InfoItem label="Phone" value={company.phone} />
          <div className="col-span-2">
            <InfoItem label="HQ Location" value={company.hqLocation} />
          </div>
        </InfoSection>

        <InfoSection title="Business Activity" icon={BarChart3} className="pt-8 border-t border-border/10">
          <div className="bg-muted/10 rounded-xl p-4 col-span-2 grid grid-cols-3 gap-4 border border-border/30">
            <div className="text-center">
              <div className="flex justify-center mb-1 text-primary/60"><ShoppingCart size={14} /></div>
              <p className="text-lg font-bold text-foreground">{company.activity.totalOrders}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Total Orders</p>
            </div>
            <div className="text-center border-x border-border/30">
              <div className="flex justify-center mb-1 text-primary/60"><TrendingUp size={14} /></div>
              <p className="text-lg font-bold text-foreground">{company.activity.activeListings}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Active Listings</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1 text-emerald-500/60 font-bold text-sm">₹</div>
              <p className="text-sm font-bold text-emerald-500 mt-1">{company.activity.purchaseVolume}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">Purchase Vol</p>
            </div>
          </div>
        </InfoSection>

        <InfoSection title="Verification Status" icon={ShieldCheck} className="pt-8 border-t border-border/10">
          <div className="col-span-2">
            <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">KYC Status</p>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                    company.kycStatus === 'VERIFIED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  )}>
                    {company.kycStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">Joined Date</p>
                  <p className="text-[10px] font-bold text-foreground">{company.joinedDate}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border/30 flex gap-4">
                <Button variant="outline" className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-border/40 hover:bg-muted">
                    GST Certificate ↗
                </Button>
                <Button variant="outline" className="flex-1 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-border/40 hover:bg-muted">
                    PAN Card ↗
                </Button>
              </div>
            </div>
          </div>
        </InfoSection>
      </div>
    </Drawer>
  );
};

export default CompanyDrawer;
