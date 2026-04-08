import { FileText } from "lucide-react";
import { cn } from "@/utils/utils";

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

const TableEmptyState = ({
  title = "No data available",
  description = "There are no items to display.",
  className,
}: TableEmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center mb-4">
        <FileText size={20} className="text-muted-foreground/40" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground/60">{description}</p>
    </div>
  );
};

export default TableEmptyState;
