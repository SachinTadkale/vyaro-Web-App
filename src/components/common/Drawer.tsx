import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Drawer = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DrawerProps) => {
  // Close on Escape
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Lock scroll when open
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-card border-l border-border shadow-2xl z-[101] flex flex-col",
              className
            )}
          >
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/10 shrink-0">
              <div className="flex flex-col">
                {title && (
                  <h2 className="text-lg font-normal text-foreground uppercase tracking-widest leading-none">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-[10px] text-muted-foreground font-normal uppercase mt-1.5 opacity-60 tracking-wider">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg hover:bg-muted text-muted-foreground/60 transition-all hover:text-foreground hover:rotate-90"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-border/50 bg-muted/20 backdrop-blur-md sticky bottom-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
