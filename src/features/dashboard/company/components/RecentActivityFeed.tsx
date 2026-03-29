import type { Notification } from "@/hooks/useCompanyDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/utils/utils";

interface Props {
  notifications: Notification[];
}

const RecentActivityFeed = ({ notifications }: Props) => {
  return (
    <div className="dashboard-card p-0 overflow-hidden divide-y divide-border">
      {notifications.map((n) => (
        <div key={n.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
              n.color === "success"
                ? "bg-green-500/10 text-green-500"
                : n.color === "warning"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-blue-500/10 text-blue-500"
            )}
          >
            <FontAwesomeIcon icon={n.icon} size="xs" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {n.text}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">
              {n.time}
            </p>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div className="p-8 text-center text-muted-foreground italic text-xs">
          No recent activity.
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;
