import * as React from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  dangerMode?: boolean;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  dangerMode = false,
  isLoading = false,
  confirmDisabled = false,
  children,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[200]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-2xl z-[201] rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("flex items-center gap-3", dangerMode ? "text-red-500" : "text-foreground")}> 
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    dangerMode ? "bg-red-500/10" : "bg-primary/10"
                  )}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg text-muted-foreground/60 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {children}

              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border/50"
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  variant={dangerMode ? "destructive" : "default"}
                  onClick={onConfirm}
                  disabled={confirmDisabled || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="4" />
                        <path d="M22 12a10 10 0 0 1-10 10" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      {confirmText}
                    </span>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
