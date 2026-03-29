import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono font-medium tracking-tighter">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
};

const WeatherWidget = () => (
  <div className="flex items-center gap-2 text-muted-foreground/60">
    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
    <span className="uppercase text-[10px] font-bold tracking-[0.2em]">Sunny 24°C</span>
  </div>
);

export default function EntryPage() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Context & Time Layer ── */}
      <div className="flex flex-col items-center gap-2 mb-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <WeatherWidget />
        <div className="h-px w-8 bg-border/50" />
        <LiveClock />
      </div>

      {/* ── Core Brand Identity ── */}
      <div className="relative z-10 flex flex-col items-center">

        <h1 className="text-5xl font-bold tracking-tighter text-foreground mb-4">
          Farm<span className="text-primary/70">Zy</span>
        </h1>

        <p className="text-muted-foreground/60 text-sm max-w-[280px] leading-relaxed font-medium">
          Unified agricultural commerce & supply chain management platform.
        </p>
      </div>

      {/* ── Primary Actions ── */}
      <div className="mt-16 flex flex-col gap-4 w-full max-w-[240px] relative z-10">
        <button
          onClick={() => navigate("/login")}
          className="h-12 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          Enter Platform
          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
        </button>

      </div>

      {/* ── Footer Metadata ── */}
      <div className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/20">
        Secure Access <span className="mx-3 opacity-50">/</span> v2.4.0
      </div>

    </div>
  );
}
