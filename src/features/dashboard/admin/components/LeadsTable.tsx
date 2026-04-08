import { useState } from "react";
import type { Lead, LeadStatus } from "../types/lead.types";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";
import TableSkeleton from "@/components/common/TableSkeleton";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CONTACTED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONVERTED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const LeadsTable = ({ leads, onDelete, isLoading = false }: LeadsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Local UI-only state mapping to handle statuses and notes without API changes
  const [localData, setLocalData] = useState<Record<string, { status: LeadStatus; notes: string }>>({});

  const handleStatusChange = (id: string, status: LeadStatus) => {
    setLocalData(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], status, notes: prev[id]?.notes || "" } 
    }));
    toast.success(`Status updated to ${status}`);
  };

  const handleNotesChange = (id: string, notes: string) => {
    setLocalData(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], status: prev[id]?.status || "NEW", notes } 
    }));
  };

  const handleNotesBlur = () => {
    toast.info("Notes saved locally.");
  };

  const totalPages = Math.ceil(leads.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedLeads = leads.slice(startIdx, endIdx);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[15%]">Name</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[20%]">Email / Role</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[15%]">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[25%]">Notes</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[15%] text-right">Created</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-[10%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {displayedLeads.map((lead) => {
              const leadLocalState = localData[lead.id] || { status: lead.status || "NEW", notes: lead.notes || "" };
              
              return (
                <tr key={lead.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {lead.name || "Unknown Lead"}
                    </span>
                  </td>
                  <td className="px-5 py-4 space-y-1">
                    <div className="text-xs font-semibold text-foreground/80 truncate max-w-[150px]">
                      {lead.email}
                    </div>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      lead.role === "FARMER"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {lead.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={leadLocalState.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer ${STATUS_COLORS[leadLocalState.status as LeadStatus]}`}
                    >
                      <option value="NEW" className="bg-background text-foreground uppercase tracking-widest font-black">NEW</option>
                      <option value="CONTACTED" className="bg-background text-foreground uppercase tracking-widest font-black">CONTACTED</option>
                      <option value="CONVERTED" className="bg-background text-foreground uppercase tracking-widest font-black">CONVERTED</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="text"
                      placeholder="Add follow-up notes..."
                      value={leadLocalState.notes}
                      onChange={(e) => handleNotesChange(lead.id, e.target.value)}
                      onBlur={handleNotesBlur}
                      className="w-full bg-background/50 hover:bg-background focus:bg-background border border-border/50 focus:border-primary/30 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none"
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-[11px] font-medium text-muted-foreground/80">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="p-2 rounded-lg border border-border/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-sm"
                      title="Delete Lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isLoading && <TableSkeleton rows={5} columns={6} />}
      {!isLoading && leads.length === 0 && (
        <TableEmptyState description="No leads found. Check your filters." />
      )}
      {!isLoading && leads.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          totalItems={leads.length}
        />
      )}
    </div>
  );
};

export default LeadsTable;
