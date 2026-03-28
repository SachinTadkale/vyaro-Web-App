import type { Company } from "@/modules/company/types/company.types";
import { useNavigate } from "react-router-dom";

type Props = {
  companies: Company[];
};

const RecentCompanies = ({ companies }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:scale-[1.01] transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold tracking-wide text-white">
          Recent Companies
        </p>

        <span
          onClick={() => navigate("/admin/leads")}
          className="text-xs text-green-400 cursor-pointer hover:underline"
        >
          View all →
        </span>
      </div>

      {/* Content */}
      {companies.length === 0 ? (
        <div className="text-center text-white/40 py-6 text-sm">
          No companies found
        </div>
      ) : (
        <div className="space-y-3">
          {companies.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] backdrop-blur-sm transition"
            >
              {/* Left */}
              <div>
                <p className="text-white text-xs font-bold">{c.name}</p>
                <p className="text-[10px] text-white/40">{c.email}</p>
              </div>

              {/* Right */}
              <span
                className={`text-[10px] px-2 py-1 rounded-full ${
                  c.verificationStatus === "APPROVED"
                    ? "bg-green-500/20 text-green-400"
                    : c.verificationStatus === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                }`}
              >
                {c.verificationStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentCompanies;
