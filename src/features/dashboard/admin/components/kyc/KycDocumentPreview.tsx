import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSearchPlus } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  src: string;
  onClick: () => void;
};

const KycDocumentPreview = ({ label, src, onClick }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{label}</label>
      <div 
        onClick={onClick}
        className="group relative aspect-[3/2] rounded-xl bg-muted/20 border border-border/20 overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300"
      >
        {/* Placeholder/Thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
          <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-white/10 group-hover:text-primary/40 transition-all group-hover:scale-110" />
        </div>

        {/* Real Image (Lazy load simulation or if provided) */}
        {src && (
          <img 
            src={src} 
            alt={label}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            loading="lazy"
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/20 scale-50 group-hover:scale-100 transition-transform">
              <FontAwesomeIcon icon={faSearchPlus} className="text-primary text-sm" />
           </div>
        </div>

        {/* Bottom Label (Minimal) */}
        <div className="absolute bottom-3 left-3">
           <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default KycDocumentPreview;
