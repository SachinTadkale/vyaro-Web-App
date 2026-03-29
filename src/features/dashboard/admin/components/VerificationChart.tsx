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
    <div className="rounded-2xl border border-border bg-card p-5 hover:bg-muted/10 transition-all duration-300">
      {/* Header */}
      <p className="text-sm font-bold tracking-wide text-foreground mb-4">
        Verification Breakdown
      </p>

      {/* Approved */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <span className="text-muted-foreground">Approved</span>
          <span className="text-foreground">{approved}</span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${getPercent(approved)}%` }}
          />
        </div>
      </div>

      {/* Pending */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <span className="text-muted-foreground">Pending</span>
          <span className="text-foreground">{pending}</span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${getPercent(pending)}%` }}
          />
        </div>
      </div>

      {/* Blocked */}
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <span className="text-muted-foreground">Blocked</span>
          <span className="text-foreground">{blocked}</span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${getPercent(blocked)}%` }}
          />
        </div>
      </div>
    </div>

  );
};

export default VerificationChart;
