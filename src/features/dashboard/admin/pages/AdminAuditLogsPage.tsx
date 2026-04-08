import { useState } from "react";
import { Search, History, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/common/Table";
import TablePagination from "@/components/common/TablePagination";
import TableEmptyState from "@/components/common/TableEmptyState";

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: "ADMIN" | "COMPANY" | "SYSTEM";
  entity: string;
  entityId: string;
  timestamp: string;
  status: "Success" | "Failed" | "Warning";
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "LOG-9001", action: "Approved KYC Document", user: "Admin (Sanjay)", role: "ADMIN", entity: "Company", entityId: "COMP-402", timestamp: "Apr 8, 2026 14:32:01", status: "Success" },
  { id: "LOG-9002", action: "Failed Login Attempt", user: "Unknown IP", role: "SYSTEM", entity: "Auth", entityId: "IP-192.168.0.x", timestamp: "Apr 8, 2026 13:10:44", status: "Failed" },
  { id: "LOG-9003", action: "Created New Listing", user: "AgroCorp India", role: "COMPANY", entity: "MarketListing", entityId: "LST-502", timestamp: "Apr 8, 2026 11:20:15", status: "Success" },
  { id: "LOG-9004", action: "Deleted User Record", user: "Admin (Sanjay)", role: "ADMIN", entity: "Farmer", entityId: "USR-089", timestamp: "Apr 7, 2026 16:45:00", status: "Warning" },
  { id: "LOG-9005", action: "Processed Auto-Settlement", user: "System Job", role: "SYSTEM", entity: "Transaction", entityId: "TXN-7489190", timestamp: "Apr 7, 2026 02:00:00", status: "Success" },
  { id: "LOG-9006", action: "Rejected Dispute Claim", user: "Admin (Vikram)", role: "ADMIN", entity: "Dispute", entityId: "DSP-104", timestamp: "Apr 6, 2026 09:12:30", status: "Success" },
  { id: "LOG-9007", action: "Updated Company Profile", user: "SeedCo", role: "COMPANY", entity: "Company", entityId: "COMP-201", timestamp: "Apr 5, 2026 10:05:11", status: "Success" },
];

const AdminAuditLogsPage = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  
  // Filters
  const filteredLogs = logs.filter(l => {
    return (
      l.action.toLowerCase().includes(search.toLowerCase()) || 
      l.user.toLowerCase().includes(search.toLowerCase()) || 
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedLogs = filteredLogs.slice(startIdx, endIdx);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Success": return "text-emerald-500 font-bold";
      case "Warning": return "text-amber-500 font-bold";
      case "Failed": return "text-rose-500 font-bold";
      default: return "text-muted-foreground";
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "ADMIN": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "COMPANY": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SYSTEM": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "";
    }
  }

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">System Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Immutable trail of all security and data modification events.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              className="w-full bg-card border border-border/50 pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all hover:border-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User, Action, Entity, or ID..."
            />
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="dashboard-card overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4 w-[25%]">Action Performed</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4 w-[20%]">User / Origin</TableHead>
                  <TableHead className="text-left px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4 w-[20%]">Target Entity</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4 w-[10%]">Status</TableHead>
                  <TableHead className="text-right px-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 py-4 w-[25%]">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/20">
                {displayedLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <TableCell className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex-shrink-0 rounded bg-muted/50 flex items-center justify-center text-muted-foreground/60">
                          <History size={12} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground/90 group-hover:text-primary transition-colors">{log.action}</p>
                          <p className="font-mono text-[9px] text-muted-foreground/50 uppercase">{log.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground/80">{log.user}</p>
                        <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${getRoleBadge(log.role)}`}>
                          {log.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-5">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground/80 flex items-center gap-1.5">
                          <Globe2 size={10} className="text-muted-foreground/50" /> {log.entity}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground tracking-wider">{log.entityId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-5 text-right">
                      <span className={`text-[10px] uppercase tracking-widest ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-5 text-right">
                      <span className="font-semibold text-[10px] font-mono text-muted-foreground/80">{log.timestamp}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLogs.length === 0 && (
              <TableEmptyState description="No logs found matching your filters." />
            )}
          </div>
          
          {filteredLogs.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
              totalItems={filteredLogs.length}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuditLogsPage;
