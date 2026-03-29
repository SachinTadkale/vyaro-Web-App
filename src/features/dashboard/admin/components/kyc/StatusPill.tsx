import { cn } from "@/utils/utils";

type Props = {
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED" | "VERIFIED";
  className?: string;
};

const StatusPill = ({ status, className }: Props) => {
  const variants = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    VERIFIED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    BLOCKED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
      variants[status] || variants.PENDING,
      className
    )}>
      {status}
    </span>
  );
};

export default StatusPill;
