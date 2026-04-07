import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Key, 
  Smartphone, 
  FileCheck, 
  Mail, 
  MapPin, 
  Image as ImageIcon, 
  FileText, 
  Laptop, 
  Bell, 
  ShoppingCart, 
  Megaphone, 
  Landmark, 
  QrCode,
  X 
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyProfileAPI } from "@/services/company.api";
import { toast } from "sonner";

// Reusable Setting Row Component
interface SettingRowProps {
  title: string;
  description: string;
  value?: string;
  actionLabel?: string;
  icon: React.ElementType;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onAction?: () => void;
}
const SettingRow = ({ title, description, value, actionLabel, icon: Icon, isToggle, toggleValue, onToggle, onAction }: SettingRowProps) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors group">
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
          <Icon size={18} />
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      {value && <span className="text-sm font-bold text-foreground/80 hidden sm:block truncate max-w-[200px]">{value}</span>}
      {isToggle ? (
        <button 
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${toggleValue ? 'bg-primary' : 'bg-muted border border-border'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${toggleValue ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ) : (
        <button 
          onClick={onAction} 
          className="text-xs font-bold px-4 py-2 bg-background hover:bg-muted border border-border rounded-lg transition-colors text-foreground opacity-80 group-hover:opacity-100 flex-shrink-0"
        >
          {actionLabel || "Edit"}
        </button>
      )}
    </div>
  </div>
);

// Generic Reusable Modal Component
interface ModalField { label: string; type?: string; placeholder?: string; }
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: { title: string; description: string; fields: ModalField[] };
  onSave: (data?: any) => void;
}
const SettingsModal = ({ isOpen, onClose, config, onSave }: SettingsModalProps) => {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground">{config.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
          </div>
          <div className="space-y-4">
            {config.fields?.map((f: ModalField, idx: number) => (
              <div key={idx}>
                <label className="block text-[10px] font-bold mb-1.5 text-muted-foreground uppercase tracking-widest">{f.label}</label>
                <input 
                  type={f.type || "text"} 
                  className="w-full rounded-xl py-2.5 px-4 text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" 
                  placeholder={f.placeholder}
                  value={idx === 0 ? val1 : val2}
                  onChange={(e) => idx === 0 ? setVal1(e.target.value) : setVal2(e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 mt-6">
            <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-bold border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => { onSave(); onClose(); setVal1(""); setVal2(""); toast.success(`${config.title} updated successfully.`); }} className="flex-[2] bg-primary text-primary-foreground font-bold rounded-xl py-2.5 text-sm hover:bg-primary/90 transition-colors shadow-sm">Save Changes</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  
  const { data: profileData } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: fetchCompanyProfileAPI,
  });

  const profile = profileData?.data || user || {};

  // Toggles State
  const [toggles, setToggles] = useState({
    twoFactor: false,
    emailAlerts: true,
    orderUpdates: true,
    marketing: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference updated");
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; description: string; fields: ModalField[] }>({ title: "", description: "", fields: [] });

  const openModal = (title: string, description: string, fields: ModalField[]) => {
    setModalConfig({ title, description, fields });
    setModalOpen(true);
  };

  return (
    <div className="flex-1 space-y-8 pt-2 max-w-[1000px]">
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account profile, business details, and security.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
        
        {/* Profile Section */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Profile</h3>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col gap-[1px]">
            <SettingRow 
              icon={Building2} title="Company Info" description="Your legal entity name and branding" 
              value={profile.companyName || profile.name || "N/A"} 
              onAction={() => openModal("Company Info", "Update your legal entity name.", [{ label: "Company Name", placeholder: "e.g. FarmZY Corp" }])}
            />
            <SettingRow 
              icon={ImageIcon} title="Company Logo" description="Brand image used across the marketplace" 
              value={profile.profileImageUrl ? "Configured" : "Not Set"} actionLabel="Upload"
              onAction={() => toast.info("Image upload functionality from settings is mock.")}
            />
            <SettingRow 
              icon={Mail} title="Contact Info" description="Primary email address for communications" 
              value={profile.email || "N/A"} 
              onAction={() => openModal("Contact Info", "Update your primary email.", [{ label: "Email Address", type: "email", placeholder: "e.g. hello@farmzy.com" }])}
            />
            <SettingRow 
              icon={MapPin} title="Address" description="Operating HQ or registration address" 
              value="Add Address" actionLabel="Add"
              onAction={() => openModal("Address", "Set your primary company location.", [{ label: "Address Line 1" }, { label: "City & State" }])}
            />
          </div>
        </div>

        {/* Business Section */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Business & Compliance</h3>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col gap-[1px]">
            <SettingRow 
              icon={FileCheck} title="GST Details" description="Goods and Services Tax Number" 
              value={profile.gstNumber || "Not Provided"} actionLabel="Request Change"
              onAction={() => toast.info("A support ticket has been raised to change your verified GST number.")}
            />
            <SettingRow 
              icon={FileText} title="Company Registration" description="Official CIN or Registration No." 
              value={profile.registrationNo || "Not Provided"} actionLabel="Request Change"
              onAction={() => toast.info("A support ticket has been raised to change your registration details.")}
            />
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Security</h3>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col gap-[1px]">
            <SettingRow 
              icon={Key} title="Password" description="Last updated 3 months ago" 
              actionLabel="Change Password"
              onAction={() => openModal("Change Password", "Use a strong, unique password.", [{ label: "Current Password", type: "password" }, { label: "New Password", type: "password" }])}
            />
            <SettingRow 
              icon={Smartphone} title="Two-Factor Authentication" description="Adds an extra layer of security" 
              isToggle={true} toggleValue={toggles.twoFactor} onToggle={() => handleToggle("twoFactor")}
            />
            <SettingRow 
              icon={Laptop} title="Active Sessions" description="Devices currently logged into this account" 
              value="2 Sessions Active" actionLabel="Manage"
              onAction={() => toast.info("Session management is a future feature.")}
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Notifications</h3>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col gap-[1px]">
            <SettingRow 
              icon={Bell} title="Email Alerts" description="Get notified about critical account changes" 
              isToggle={true} toggleValue={toggles.emailAlerts} onToggle={() => handleToggle("emailAlerts")}
            />
            <SettingRow 
              icon={ShoppingCart} title="Order Updates" description="Receive instant updates when orders are placed" 
              isToggle={true} toggleValue={toggles.orderUpdates} onToggle={() => handleToggle("orderUpdates")}
            />
            <SettingRow 
              icon={Megaphone} title="Marketing & Promo" description="Tips and tricks, offers, and platform news" 
              isToggle={true} toggleValue={toggles.marketing} onToggle={() => handleToggle("marketing")}
            />
          </div>
        </div>

        {/* Payments Section */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Payment Methods</h3>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col gap-[1px]">
            <SettingRow 
              icon={Landmark} title="Bank Account" description="Primary account for settlements" 
              value="XXXX-4589" actionLabel="Update"
              onAction={() => openModal("Bank Account", "Update your bank settlement details.", [{ label: "Account Number" }, { label: "IFSC Code" }])}
            />
            <SettingRow 
              icon={QrCode} title="UPI Handle" description="Quick pay routing" 
              value="farmzy@upi" actionLabel="Update"
              onAction={() => openModal("UPI Handle", "Set your primary receiving UPI ID.", [{ label: "UPI ID", placeholder: "e.g. name@upi" }])}
            />
          </div>
        </div>

      </motion.div>

      {/* Reusable Modal Output */}
      <SettingsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        config={modalConfig} 
        onSave={() => {}} 
      />
    </div>
  );
};

export default SettingsPage;
