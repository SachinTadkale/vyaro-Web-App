import { useState } from "react";
import { User, Lock, Building2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import type { FormEvent, ChangeEvent } from "react";

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!currentPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }
    // UI only
    alert("Password change request submitted (UI only)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="flex-1 space-y-6 pt-2 max-w-[800px]">
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account profile and security.</p>
      </div>

      <div className="space-y-6 pb-10">
        {/* Profile Info Section */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Profile Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role || "COMPANY"}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-xs text-muted-foreground">Profile editing is temporarily disabled.</p>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={handleInputChange(setCurrentPassword)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={handleInputChange(setNewPassword)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button type="submit" className="mt-6">
              Update Password
            </Button>
          </form>
        </div>

        {/* Company Info Section */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Company Info</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={user?.companyName || user?.name || "N/A"}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-muted/50">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
