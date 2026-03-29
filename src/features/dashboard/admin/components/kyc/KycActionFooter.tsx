import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck, 
  faTimes, 
  faBan 
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  onApprove: () => void;
  onReject: () => void;
  onBlock?: () => void;
  isProcessing?: boolean;
};

const KycActionFooter = ({ onApprove, onReject, onBlock, isProcessing }: Props) => {
  return (
    <div className="flex gap-3 py-4">
      {/* Block - Secondary Action */}
      {onBlock && (
        <button 
          onClick={onBlock}
          disabled={isProcessing}
          className="w-12 h-12 rounded-xl border border-amber-500/20 text-amber-500/60 hover:bg-amber-500/10 hover:text-amber-500 transition-all flex items-center justify-center group/btn"
          title="Block User"
        >
          <FontAwesomeIcon icon={faBan} className="text-sm group-hover/btn:scale-110 transition-transform" />
        </button>
      )}

      {/* Reject - Destructive Action */}
      <button 
        onClick={onReject}
        disabled={isProcessing}
        className="flex-[0.4] py-3 rounded-xl border border-red-500/20 text-red-500/60 text-xs font-medium uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
        title="Reject KYC Request"
      >
        <FontAwesomeIcon icon={faTimes} className="text-xs" />
        Reject
      </button>

      {/* Approve - Primary Action */}
      <button 
        onClick={onApprove}
        disabled={isProcessing}
        className="flex-1 py-3 rounded-xl bg-emerald-500 text-[#0a0d0d] text-xs font-medium uppercase tracking-widest hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        title="Approve KYC Request"
      >
        <FontAwesomeIcon icon={faCheck} className="text-xs" />
        {isProcessing ? "Processing..." : "Approve Verification"}
      </button>
    </div>
  );
};

export default KycActionFooter;
