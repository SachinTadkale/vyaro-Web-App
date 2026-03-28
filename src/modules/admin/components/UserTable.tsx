import type { User } from "../types/admin.types";
import StatusPill from "./StatusPill";

type Props = {
  users: User[];
};

const UserTable = ({ users }: Props) => {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/50 text-xs">
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
            <tr key={u.user_id} className="border-t border-white/5">
              <td className="px-5 py-4">
                <p className="text-white font-bold">{u.name}</p>
                <p className="text-xs text-white/40">{u.email}</p>
              </td>

              <td className="px-5 py-4 text-white/70">{u.phone_no}</td>

              <td className="px-5 py-4">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  {u.kyc?.docType || "-"}
                </span>
              </td>

              <td className="px-5 py-4">
                <StatusPill
                  status={u.verificationStatus}
                  isBlocked={u.isBlocked}
                  dark={true}
                />
              </td>

              <td className="px-5 py-4 text-xs text-white/40">
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
