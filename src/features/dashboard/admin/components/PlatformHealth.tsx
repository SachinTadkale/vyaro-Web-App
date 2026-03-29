import { AlertTriangle, UserX, Ban, Activity } from "lucide-react";


const PlatformHealth = ({ stats }: { stats: any[] }) => {
  const getIcon = (label: string) => {
    switch (label) {
      case "Unverified Users":
        return AlertTriangle;
      case "Inactive Users (30d)":
        return UserX;
      case "Listings w/o Buyers":
        return Activity;
      case "Failed Orders":
        return Ban;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = getIcon(s.label);
        return (
          <div key={s.label} className="dashboard-card border-l-4 border-l-destructive/50 p-4 transition-all hover:translate-y-[-2px] bg-card/40">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                <h4 className="text-2xl font-black text-destructive/90">{s.value}</h4>
              </div>
              <div className={`p-2 rounded-lg ${s.status === "issue" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-3 text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 border-t border-border/50 pt-2 opacity-60 italic">
              Attention Required
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlatformHealth;
