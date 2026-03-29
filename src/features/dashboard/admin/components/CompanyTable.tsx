import { Eye, MapPin, Calendar, FileText } from "lucide-react";
import type { Company } from "../types/admin.types";
import { cn } from "@/utils/utils";

interface CompanyTableProps {
  companies: Company[];
  onView: (company: Company) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const isBlocked = status === "BLOCKED";
  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
      isBlocked 
        ? "bg-red-500/10 text-red-500 border-red-500/20" 
        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    )}>
      {status}
    </span>
  );
};

const VerificationBadge = ({ status }: { status: string }) => {
  const isVerified = status === "VERIFIED" || status === "APPROVED";
  const isPending = status === "PENDING";
  
  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
      isVerified 
        ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
        : isPending
          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          : "bg-red-500/10 text-red-500 border-red-500/20"
    )}>
      {status}
    </span>
  );
};

const CompanyTable = ({ companies, onView }: CompanyTableProps) => {
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">GST Number</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verification</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Joined</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-muted/10 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {company.companyName}
                    </span>
                    <span className="text-[10px] text-muted-foreground lowercase opacity-60">
                      {company.email}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText size={10} className="opacity-40" />
                    <span className="text-[11px] font-mono font-bold tracking-tight">{company.gstNumber}</span>
                  </div>
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin size={10} className="opacity-40" />
                    <span className="text-[11px] font-medium truncate max-w-[120px]">
                      {company.location}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3">
                  <VerificationBadge status={company.kycStatus} />
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={10} className="opacity-40" />
                    <span className="text-[11px] font-medium">{company.joinedDate}</span>
                  </div>
                </td>

                <td className="px-5 py-3 text-center">
                  <StatusBadge status={company.status} />
                </td>

                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => onView(company)}
                    className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <Eye size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest pr-1">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;
