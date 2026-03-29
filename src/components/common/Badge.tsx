import { cn } from "@/utils/utils";

interface Props {
  children: React.ReactNode;
  variant?: "success" | "warning" | "destructive" | "info" | "neutral";
  className?: string;
}

const Badge = ({ children, variant = "neutral", className }: Props) => {
  const variants = {
    success: "bg-primary/10 text-primary ring-primary/20",
    warning: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
    info: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    neutral: "bg-muted text-muted-foreground ring-border/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ring-1 ring-inset transition-all",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
