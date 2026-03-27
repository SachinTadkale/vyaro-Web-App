import { useState } from "react";
import type { User } from "../types/admin.types";
import UserTable from "../components/UserTable";

const UsersPage = () => {
  const [users] = useState<User[]>([]);

  return (
    <div>
      <UserTable users={users} />
    </div>
  );
};

export default UsersPage;