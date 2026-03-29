import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSun, faMoon, faCompass } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center antialiased bg-background overflow-hidden selection:bg-primary/30">
      
      {/* ── Theme Toggle ── */}
      <button 
        onClick={toggleTheme}
        className="fixed top-8 right-8 w-10 h-10 rounded-full bg-muted/30 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all z-50 group"
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm transition-transform group-hover:rotate-12" />
      </button>

      {/* ── Subtle Background Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── 404 Watermark ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-foreground/[0.02] tracking-tighter select-none pointer-events-none">
        404
      </div>

      {/* ── Branding ── */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center text-primary/40 text-3xl shadow-2xl mb-12 animate-in zoom-in-50 duration-500">
          <FontAwesomeIcon icon={faCompass} />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-4">
          Lost in the <span className="text-primary/70">Field?</span>
        </h1>
        
        <p className="text-muted-foreground/60 text-sm max-w-[320px] leading-relaxed font-medium mb-12">
          The coordinates you're looking for don't exist in our current supply chain map.
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col gap-4 w-full max-w-[240px] relative z-10">
        <button 
          onClick={() => navigate("/")}
          className="h-12 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
          Return to Platform
        </button>
        
        <button 
          onClick={() => window.history.back()}
          className="h-12 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all border border-transparent hover:border-border/50"
        >
          Go Back
        </button>
      </div>

      {/* ── Meta ── */}
      <div className="absolute bottom-12 text-[9px] font-mono text-muted-foreground/20 uppercase tracking-[0.3em]">
        Error Code: ERR_ROUTE_NOT_DEfINED
      </div>

    </div>
  );
};

export default PageNotFound;