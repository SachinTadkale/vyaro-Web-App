import type { User } from "../../types/admin.types";

type Props = {
  users: User[];
};

const RecentUsers = ({ users }: Props) => {
  return (
    <div>
      {users.slice(-3).map((u) => (
        <div key={u.user_id} className="mb-2">
          <p className="text-white text-sm">{u.name}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentUsers;