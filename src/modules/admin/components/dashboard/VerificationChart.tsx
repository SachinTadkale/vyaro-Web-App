type Props = {
  approved: number;
  pending: number;
  blocked: number;
};

const VerificationChart = ({ approved, pending, blocked }: Props) => {
  const total = approved + pending + blocked;

  const getPercent = (val: number) =>
    total === 0 ? 0 : Math.round((val / total) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:scale-[1.01] transition-all duration-300">
      {/* Header */}
      <p className="text-sm font-semibold tracking-wide text-white mb-4">
        Verification Breakdown
      </p>

      {/* Approved */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/60">Approved</span>
          <span className="text-white">{approved}</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${getPercent(approved)}%` }}
          />
        </div>
      </div>

      {/* Pending */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/60">Pending</span>
          <span className="text-white">{pending}</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full">
          <div
            className="h-2 bg-yellow-500 rounded-full transition-all"
            style={{ width: `${getPercent(pending)}%` }}
          />
        </div>
      </div>

      {/* Blocked */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/60">Blocked</span>
          <span className="text-white">{blocked}</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full">
          <div
            className="h-2 bg-red-500 rounded-full transition-all"
            style={{ width: `${getPercent(blocked)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationChart;
