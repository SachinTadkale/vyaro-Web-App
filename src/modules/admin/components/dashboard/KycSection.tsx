type KycUser = {
  id: string;
  name: string;
  email: string;
  docType: string;
  docNumber: string;
  phone: string;
  location: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
};

type Props = {
  users: KycUser[];
};

const KycSection = ({ users }: Props) => {
  const pendingUsers = users.filter((u) => u.status === "PENDING");

  const handleAction = (id: string, action: string) => {
    alert(`${action} user ${id}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-white">Pending KYC Requests</p>

        <span className="text-xs text-green-400 cursor-pointer hover:underline">
          View all →
        </span>
      </div>

      {/* Empty State */}
      {pendingUsers.length === 0 && (
        <div className="text-center py-10 text-white/30 text-sm border border-white/10 rounded-2xl">
          No pending KYC requests
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {pendingUsers.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 
            hover:bg-white/[0.07] transition-all duration-300"
          >
            {/* Top */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-white font-semibold text-sm">{u.name}</p>
                <p className="text-[11px] text-white/40">{u.email}</p>
              </div>

              <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                PENDING
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-white/40">Doc Type</p>
                <p className="text-white">{u.docType}</p>
              </div>

              <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-white/40">Doc Number</p>
                <p className="text-white">{u.docNumber}</p>
              </div>

              <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-white/40">Phone</p>
                <p className="text-white">{u.phone}</p>
              </div>

              <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-white/40">Location</p>
                <p className="text-white">{u.location}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(u.id, "Approved")}
                className="flex-1 bg-green-500 text-black py-2 rounded-xl text-xs font-bold hover:bg-green-400 transition"
              >
                ✓ Approve
              </button>

              <button
                onClick={() => handleAction(u.id, "Rejected")}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition"
              >
                ✕ Reject
              </button>

              <button
                onClick={() => handleAction(u.id, "Blocked")}
                className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500/30 transition"
              >
                🚫 Block
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KycSection;
