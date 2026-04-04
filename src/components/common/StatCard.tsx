import { cn } from "@/utils/utils";

interface Props {
  label: string;
  value: string | number;
  icon?: string;
  subValue?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StatCard = ({
  label,
  value,
  icon,
  subValue,
  trend,
  color = "primary",
  className,
  style,
}: Props) => {
  return (
    <div className={cn("dashboard-card group h-full flex flex-col justify-between p-4", className)} style={style}>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            {label}
          </p>
          {icon && (
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0",
                {
                  "bg-primary/10 text-primary": color === "primary",
                  "bg-secondary/10 text-secondary": color === "secondary",
                  "bg-amber-500/10 text-amber-500": color === "yellow",
                  "bg-emerald-500/10 text-emerald-500": color === "green",
                  "bg-destructive/10 text-destructive": color === "red",
                  "bg-violet-500/10 text-violet-500": color === "purple",
                  "bg-orange-500/10 text-orange-500": color === "orange",
                }
              )}
            >
              <span className="text-base">{icon}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
          {trend && (
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                trend.isUp
                  ? "bg-primary/20 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.isUp ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
        {subValue && (
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
