import type { User } from "../../types/admin.types";

type Props = {
  users: User[];
};

const RecentUsers = ({ users }: Props) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-white">Recent Users</p>

        <span className="text-xs text-green-400 cursor-pointer hover:underline">
          View all →
        </span>
      </div>

      {/* Empty */}
      {users.length === 0 && (
        <div className="text-center text-white/30 py-6 text-sm">
          No users found
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {users.slice(0, 5).map((u) => (
          <div
            key={u.user_id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
          >
            {/* Left */}
            <div>
              <p className="text-white text-xs font-semibold">{u.name}</p>
              <p className="text-[10px] text-white/40">{u.email}</p>
            </div>

            {/* Right */}
            <span
              className={`text-[10px] px-2 py-1 rounded-full ${
                u.verificationStatus === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {u.verificationStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
