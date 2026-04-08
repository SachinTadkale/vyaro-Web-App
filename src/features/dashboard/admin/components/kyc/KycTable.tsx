import { useState } from "react";
import KycRow from "./KycRow";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import TableSkeleton from "@/components/common/TableSkeleton";

type Props = {
  type: "farmers" | "companies";
  data: any[];
  onView: (item: any) => void;
  isLoading?: boolean;
};

const KycTable = ({ type, data, onView, isLoading = false }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedData = data.slice(startIdx, endIdx);

  const headers = type === "farmers"
    ? ["User", "Location", "Doc Type", "Submitted", "Status", "Action"]
    : ["Company Name", "Registration No", "GST Number", "Submitted", "Status", "Action"];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/30">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 border-b border-border/20">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {displayedData.map((item) => (
              <KycRow
                key={item.id}
                type={type}
                item={item}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
        {!isLoading && data.length === 0 && (
          <TableEmptyState description="No pending KYC requests found for this category." />
        )}
      </div>
      {isLoading && <TableSkeleton rows={5} columns={6} />}
      {!isLoading && data.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          totalItems={data.length}
        />
      )}
    </div>
  );
};


export default KycTable;
