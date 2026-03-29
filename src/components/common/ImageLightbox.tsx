import * as React from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  src: string;
  open: boolean;
  onClose: () => void;
  title?: string;
}

const ImageLightbox = ({ src, open, onClose, title }: ImageLightboxProps) => {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  // Close on Escape
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Lock scroll
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
          {/* Controls Header */}
          <div className="absolute top-0 w-full p-4 flex items-center justify-between z-[210] bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white">
              <h3 className="text-sm font-black uppercase tracking-widest">{title || "Document Preview"}</h3>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-all"
                title="Zoom In"
              >
                <ZoomIn size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setRotation(r => r + 90)}
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-all"
                title="Rotate"
              >
                <RotateCcw size={20} strokeWidth={2.5} />
              </button>
              <div className="w-[1px] h-6 bg-white/20 mx-2" />
              <button 
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex items-center justify-center p-12 max-w-full max-h-full"
            style={{ 
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <img 
              src={src} 
              alt={title} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-4 border-white/5 bg-white/5"
            />
          </motion.div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10 opacity-50">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
