import { useNavigate } from "react-router-dom";

type Lead = {
  id: string;
  email: string;
  role: "FARMER" | "COMPANY";
  createdAt: string;
};

type Props = {
  leads: Lead[];
};

const RecentLeads = ({ leads }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:scale-[1.01] transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold tracking-wide text-white">
          Recent Leads
        </p>

        <span
          onClick={() => navigate("/admin/leads")}
          className="text-xs text-green-400 cursor-pointer hover:underline"
        >
          View all →
        </span>
      </div>

      {/* Content */}
      {leads.length === 0 ? (
        <div className="text-center text-white/40 py-6 text-sm">
          No recent leads
        </div>
      ) : (
        <div className="space-y-3">
          {leads.slice(0, 5).map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] backdrop-blur-sm transition"
            >
              {/* Left */}
              <div>
                <p className="text-white text-xs font-bold">{l.email}</p>
                <p className="text-[10px] text-white/40">
                  {new Date(l.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Right */}
              <span
                className={`text-[10px] px-2 py-1 rounded-full ${
                  l.role === "FARMER"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {l.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLeads;
