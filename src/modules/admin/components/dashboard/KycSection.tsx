import type { User } from "../../types/admin.types";
import KycCard from "./KycCard";

type Props = {
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBlock: (id: string) => void;
};

const KycSection = ({ users, onApprove, onReject, onBlock }: Props) => {
  return (
    <div className="grid gap-3">
      {users.map((u) => (
        <KycCard
          key={u.user_id}
          user={u}
          onApprove={() => onApprove(u.user_id)}
          onReject={() => onReject(u.user_id)}
          onBlock={() => onBlock(u.user_id)}
        />
      ))}
    </div>
  );
};

export default KycSection;