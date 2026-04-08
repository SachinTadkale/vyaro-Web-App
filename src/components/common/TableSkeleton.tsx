import { cn } from "@/utils/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton = ({ rows = 5, columns = 6, className }: TableSkeletonProps) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Header Skeleton */}
      <div className="flex gap-5 px-5 py-3 bg-muted/30 border-b border-border/50">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="flex-1">
            <div className="h-3 bg-muted/40 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="flex gap-5 px-5 py-3 border-b border-border/10 hover:bg-muted/5 transition-colors"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={`cell-${rowIdx}-${colIdx}`} className="flex-1">
              <div
                className="h-4 bg-muted/30 rounded animate-pulse"
                style={{
                  animationDelay: `${(rowIdx * columns + colIdx) * 50}ms`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
