import { useEffect, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  entityName: string;
}

const BlockModal = ({ isOpen, onClose, onConfirm, title, entityName }: BlockModalProps) => {
  const [reason, setReason] = useState("");
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setNotifyByEmail(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setIsLoading(true);
    await Promise.resolve(onConfirm(reason));
    setIsLoading(false);
    setReason("");
    setNotifyByEmail(false);
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={title}
      description={`Blocking ${entityName} will revoke their platform access immediately.`}
      confirmText="Confirm Block"
      dangerMode
      isLoading={isLoading}
      confirmDisabled={!reason.trim()}
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm font-semibold text-red-600">Warning</p>
          <p className="text-sm text-muted-foreground mt-1">
            This action is permanent until reversed. Provide a clear reason for audit and follow-up.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Reason for Blocking (Mandatory)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Suspicious activity, failed repeated verifications..."
            className="w-full bg-muted/20 border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all min-h-[100px] text-foreground placeholder:text-muted-foreground/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={notifyByEmail}
            onChange={(e) => setNotifyByEmail(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border border-border/50 bg-background text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className={isLoading ? "opacity-50" : ""}>Notify user via email</span>
        </label>
      </div>
    </ConfirmModal>
  );
};

export default BlockModal;
