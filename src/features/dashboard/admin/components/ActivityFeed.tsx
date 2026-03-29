import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSeedling,
  faBuilding,
  faFileCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/utils";

type Activity = {
  id: string;
  type: "USER" | "LEAD" | "COMPANY" | "KYC";
  message: string;
  time: string;
};

type Props = {
  activities: Activity[];
};

const ActivityFeed = ({ activities }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-sm font-bold text-foreground">Recent Activity</p>
        <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
          View all →
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((a) => (
          <div key={a.id} className="flex gap-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                "bg-muted/50 text-muted-foreground"
              )}
            >
              <FontAwesomeIcon
                icon={
                  a.type === "USER"
                    ? faUsers
                    : a.type === "LEAD"
                      ? faSeedling
                      : a.type === "COMPANY"
                        ? faBuilding
                        : faFileCircleCheck
                }
                size="xs"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-foreground font-medium leading-tight">
                {a.message}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {a.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
