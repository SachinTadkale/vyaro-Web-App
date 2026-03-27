import type { VerificationStatus } from "../types/admin.types";

type Props = {
  status: VerificationStatus;
  isBlocked: boolean;
  dark: boolean;
};

const StatusPill = ({ status, isBlocked }: Props) => {
  if (isBlocked) {
    return (
      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
        BLOCKED
      </span>
    );
  }

  const colors = {
    APPROVED: "bg-green-500/20 text-green-400",
    PENDING: "bg-yellow-500/20 text-yellow-400",
    REJECTED: "bg-red-500/20 text-red-400",
    BLOCKED: "bg-orange-500/20 text-orange-400",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
};

export default StatusPill;