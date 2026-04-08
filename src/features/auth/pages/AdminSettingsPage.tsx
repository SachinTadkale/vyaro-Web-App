import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { User, Lock, Building2 } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

const AdminSettingsPage = () => {
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
    // TODO: Call API to change password
    alert("Password change request submitted (UI only)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Profile Info Section */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Profile Information</h2>
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
              value={user?.role || ""}
              disabled
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
              User ID
            </label>
            <input
              type="text"
              value={user?.user_id || ""}
              disabled
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <Button disabled className="opacity-50 cursor-not-allowed">
            Update Profile
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Profile updates coming soon</p>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
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

          <Button
            type="submit"
            className="mt-6"
          >
            Change Password
          </Button>
        </form>
      </div>

      {/* Company Info Section */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Organization Info</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value="FarmZy Admin"
              disabled
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
              Organization Type
            </label>
            <input
              type="text"
              value="Platform Administration"
              disabled
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
              Admin Access Level
            </label>
            <input
              type="text"
              value="Super Admin"
              disabled
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-muted/50 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-tight block mb-2">
              Status
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-muted/50">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm font-bold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground">Last sync: Just now</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
