import { useState } from "react";
import { Send, Users, Building2, Globe2, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface Announcement {
  id: string;
  title: string;
  message: string;
  target: "Farmers" | "Companies" | "All";
  date: string;
  status: "Sent" | "Draft";
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ANN-003", title: "System Maintenance Notice", message: "Marketplace will be down for 2 hours on Sunday for critical backend upgrades.", target: "All", date: "Apr 8, 2026 10:00 AM", status: "Sent" },
  { id: "ANN-002", title: "New Subsidy Introduced", message: "Government has announced a new subsidy for organic wheat farming. Check the portal for details.", target: "Farmers", date: "Apr 6, 2026 09:15 AM", status: "Sent" },
  { id: "ANN-001", title: "Updated KYC Policy", message: "All corporate entities must re-verify GST details within next 30 days.", target: "Companies", date: "Apr 1, 2026 14:30 PM", status: "Sent" },
];

const AdminNotificationsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  
  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"Farmers" | "Companies" | "All">("All");

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please provide both a title and a message.");
      return;
    }

    const newAnnouncement: Announcement = {
      id: `ANN-00${announcements.length + 4}`,
      title,
      message,
      target,
      date: new Date().toLocaleString("en-US", { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "Sent"
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    toast.success("Announcement broadcasted successfully!");
    
    // Reset form
    setTitle("");
    setMessage("");
    setTarget("All");
  };

  const getTargetIcon = (tgt: string) => {
    switch (tgt) {
      case "All": return <Globe2 size={12} />;
      case "Farmers": return <Users size={12} />;
      case "Companies": return <Building2 size={12} />;
      default: return null;
    }
  };

  const getTargetClass = (tgt: string) => {
    switch (tgt) {
      case "All": return "bg-primary/10 text-primary border-primary/20";
      case "Farmers": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Companies": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted text-foreground border-border/50";
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Notifications Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">Broadcast system-wide announcements to platform entities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── CREATE ANNOUNCEMENT (Left / Top) ── */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-card border border-border/50 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
             
             <div className="p-6 border-b border-border/50">
               <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Compose Broadcast</h3>
             </div>

             <div className="p-6 space-y-5 relative z-10">
               
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Audience</label>
                 <select 
                   value={target}
                   onChange={(e) => setTarget(e.target.value as "Farmers" | "Companies" | "All")}
                   className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                 >
                   <option value="All">Everyone (Global)</option>
                   <option value="Farmers">All Verified Farmers</option>
                   <option value="Companies">All B2B Companies</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notice Title</label>
                 <input 
                   placeholder="E.g., System Update V2.0"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Message</label>
                 <textarea 
                   placeholder="Write your announcement details here..."
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   className="w-full h-32 resize-none bg-background border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                 />
               </div>

               <Button 
                onClick={handleSend}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-xs font-black uppercase tracking-widest gap-2 shadow-sm"
               >
                 <Send size={14} /> Send Announcement
               </Button>
             </div>
          </div>
        </motion.div>

        {/* ── PAST ANNOUNCEMENTS (Right / Bottom) ── */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
          
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Broadcast History</h3>
          
          <div className="space-y-4">
            {announcements.map((ann, idx) => (
              <motion.div 
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm space-y-3 hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{ann.title}</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed pr-4">{ann.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm", getTargetClass(ann.target))}>
                       {getTargetIcon(ann.target)} {ann.target}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border/50 bg-muted/30 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                       <CheckCircle2 size={10} className="text-emerald-500" /> {ann.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-3 border-t border-border/30 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Clock size={12} /> Broadcasted on {ann.date}
                </div>
              </motion.div>
            ))}
            
            {announcements.length === 0 && (
              <div className="rounded-2xl bg-muted/20 border border-border/50 border-dashed p-10 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                  <Send size={16} />
                </div>
                <p className="text-sm font-bold text-foreground">No announcements yet</p>
                <p className="text-xs text-muted-foreground">Use the composer to broadcast your first message.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminNotificationsPage;
