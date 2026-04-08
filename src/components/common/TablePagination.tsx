import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  totalItems: number;
}

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
}: TablePaginationProps) => {
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 bg-muted/20 border-t border-border/50">
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Rows per page:
        </label>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 rounded-lg bg-muted/30 border border-border/40 text-[10px] font-bold uppercase tracking-widest text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="text-[10px] font-medium text-muted-foreground/60">
        {totalItems === 0 ? "No items" : `${startItem}–${endItem} of ${totalItems}`}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-border/40"
        >
          <ChevronLeft size={14} />
        </Button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              if (pageNum > totalPages) {
                pageNum = totalPages - 4 + i;
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "w-6 h-6 rounded text-[10px] font-bold transition-all",
                  currentPage === pageNum
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-border/40"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
