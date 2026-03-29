import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen w-full flex bg-background items-center justify-center p-4 relative selection:bg-primary/20">
      
      {/* ── Theme Toggle ── */}
      <button 
        onClick={toggleTheme}
        className="fixed top-8 right-8 w-10 h-10 rounded-full bg-muted/30 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all z-50 group"
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm transition-transform group-hover:rotate-12" />
      </button>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl shadow-2xl mb-6">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Console</h2>
          <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Secure Infrastructure Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/5">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                Access Identifier
              </label>
              <input 
                type="text" 
                placeholder="Enter admin ID"
                className="w-full h-11 bg-muted/10 border border-border/40 rounded-lg px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                Security Passcode
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-11 bg-muted/10 border border-border/40 rounded-lg px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/20"
              />
            </div>

            <button 
              type="submit"
              className="w-full h-11 bg-foreground text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all mt-4 shadow-lg shadow-black/10"
            >
              Authorize Session
            </button>
          </form>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 text-center flex flex-col gap-4">
          <button 
            onClick={() => navigate("/")}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            ← System Exit
          </button>
          
          <div className="text-[9px] font-mono text-muted-foreground/20 uppercase tracking-widest">
            Encryption: AES-256-GCM
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;