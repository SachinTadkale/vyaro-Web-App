import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  entityName: string;
}

const BlockModal = ({ isOpen, onClose, onConfirm, title, entityName }: BlockModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-2xl z-[201] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-red-500">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg text-muted-foreground/60 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to block <span className="text-foreground font-bold">{entityName}</span>? 
                  This will restrict their access to the platform immediately.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Reason for Blocking (Mandatory)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Suspicious activity, failed repeated verifications..."
                    className="w-full bg-muted/20 border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all min-h-[100px] text-foreground placeholder:text-muted-foreground/30 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirm}
                  disabled={!reason.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Confirm Block
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlockModal;
