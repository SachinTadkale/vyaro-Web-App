import { useState } from "react";
import type { User } from "../types/admin.types";
import StatsGrid from "../components/dashboard/StatsGrid";
import KycSection from "../components/dashboard/KycSection";

const AdminDashboard = () => {
  const [users] = useState<User[]>([]);

  return (
    <div className="space-y-6">
      <StatsGrid total={users.length} />

      <KycSection
        users={users}
        onApprove={() => {}}
        onReject={() => {}}
        onBlock={() => {}}
      />
    </div>
  );
};

export default AdminDashboard;