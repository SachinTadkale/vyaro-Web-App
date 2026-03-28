import type { User } from "../../types/admin.types";

type Props = {
  user: User;
  onApprove: () => void;
  onReject: () => void;
  onBlock: () => void;
};

const KycCard = ({ user, onApprove, onReject, onBlock }: Props) => {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.07] hover:scale-[1.01] transition-all duration-300">
      <p className="text-white font-bold">{user.name}</p>
      <p className="text-xs text-white/40 mb-2">{user.email}</p>

      <div className="text-xs mb-3">
        <p>Doc: {user.kyc?.docType}</p>
        <p>No: {user.kyc?.docNo}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={onApprove} className="text-green-400 text-xs">
          Approve
        </button>
        <button
          onClick={onReject}
          className="text-red-400 text-xs font-bold hover:text-red-300 transition"
        >
          Reject
        </button>
        <button onClick={onBlock} className="text-orange-400 text-xs">
          Block
        </button>
      </div>
    </div>
  );
};

export default KycCard;
