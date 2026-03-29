import type { User } from "../types/admin.types";
import StatusPill from "./kyc/StatusPill";

type Props = {
  users: User[];
};

const UserTable = ({ users }: Props) => {
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs">
          <tr>
            <th className="px-5 py-3 text-left">User</th>
            <th className="px-5 py-3 text-left">Phone</th>
            <th className="px-5 py-3 text-left">Doc</th>
            <th className="px-5 py-3 text-left">Status</th>
            <th className="px-5 py-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-t border-border hover:bg-muted/20 transition-colors">
              <td className="px-5 py-4">
                <p className="text-foreground font-bold">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </td>

              <td className="px-5 py-4 text-muted-foreground">{u.phone_no}</td>

              <td className="px-5 py-4">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  {u.kyc?.docType || "-"}
                </span>
              </td>

              <td className="px-5 py-4">
                <StatusPill
                  status={u.isBlocked ? "BLOCKED" : u.verificationStatus}
                />
              </td>

              <td className="px-5 py-4 text-xs text-muted-foreground">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
