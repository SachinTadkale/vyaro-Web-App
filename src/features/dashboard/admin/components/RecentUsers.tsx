import { cn } from "@/utils/utils";
import type { User } from "../types/admin.types";

type Props = {
  users: User[];
};

const RecentUsers = ({ users }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-sm font-bold text-foreground">Recent Users</p>

        <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
          View all →
        </span>
      </div>

      {/* Empty */}
      {users.length === 0 && (
        <div className="text-center text-muted-foreground py-6 text-sm">
          No users found
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {users.slice(0, 5).map((u) => (
          <div
            key={u.user_id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            {/* Left */}
            <div>
              <p className="text-foreground text-xs font-bold">{u.name}</p>
              <p className="text-[10px] text-muted-foreground">{u.email}</p>
            </div>

            {/* Right */}
            <span
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-full font-bold",
                u.verificationStatus === "APPROVED"
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
              )}
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
