import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

/* WEATHER */
function WeatherWidget({ dark }: { dark: boolean }) {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.85&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => setTemp(Math.round(data.current_weather.temperature)))
      .catch(() => {});
  }, []);

  if (!temp) return null;

  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.25rem] text-sm font-black shadow-sm backdrop-blur-md transition-colors ${dark ? "bg-[#111625] border-white/10 text-white shadow-lg" : "bg-white/80 border-gray-200 text-gray-800"}`}>
      <span className={dark ? "text-white/90" : "text-gray-800"}>🌤</span> {temp}°C <span className={`px-2 font-light ${dark ? "text-white/20" : "text-gray-300"}`}>|</span> <span>Pune</span>
    </div>
  );
}

/* CLOCK */
function LiveClock({ dark }: { dark: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`flex items-center px-6 py-2.5 rounded-[1.25rem] text-sm font-black tracking-widest shadow-sm backdrop-blur-md transition-colors border ${dark ? "bg-[#111625] border-white/10 text-white shadow-lg" : "bg-white/80 border-gray-200 text-gray-800"}`}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}

export default function EntryPage() {
  const navigate = useNavigate();
  // Assume dark is default since our premium UI redesign was dark
  const [dark, setDark] = useState(true);

  // Theme Constants
  const bg = dark ? "bg-[#060d1f]" : "bg-[#f8f9fb]";
  const textTitle = dark ? "from-white via-white/90 to-white/40" : "from-gray-900 via-gray-800 to-gray-500";
  const textDesc = dark ? "text-white/60" : "text-gray-600";
  const btnSec = dark ? "bg-white/5 hover:bg-white/10 text-white border-white/10" : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm";
  const footerText = dark ? "text-white/30" : "text-gray-400";

  return (
    <div className={`relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center p-6 text-center antialiased transition-colors duration-500 ${bg}`}>
      
      {/* ── Animated Background ── */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: dark ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] ${dark ? "bg-green-500/20" : "bg-green-400/40"} rounded-full blur-[150px] pointer-events-none`} />
      <motion.div animate={{ scale: [1, 1.5, 1], opacity: dark ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1], y: [0, -50, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] ${dark ? "bg-blue-600/20" : "bg-blue-400/30"} rounded-full blur-[180px] pointer-events-none`} />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: dark ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05], x: [0, -50, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }} className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] ${dark ? "bg-emerald-500/10" : "bg-emerald-400/20"} rounded-full blur-[150px] pointer-events-none`} />
      
      {dark && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>}

      {/* ── TOP NAVBAR ── */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-6 md:px-10 py-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-lg border border-green-500/30">
            🌱
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${dark ? "text-white" : "text-gray-900"}`}>
            Farm<span className="text-green-500">Zy</span>
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-3 z-50 pointer-events-auto">
          <WeatherWidget dark={dark} />
          <LiveClock dark={dark} />
          <button 
            onClick={() => setDark(!dark)} 
            className={`w-10 h-10 rounded-[1.25rem] flex items-center justify-center transition-all backdrop-blur-md shadow-sm border ${dark ? "bg-[#111625] border-white/10 text-white/80 hover:bg-white/10" : "bg-white/80 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FontAwesomeIcon icon={dark ? faSun : faMoon} />
          </button>
        </div>
      </nav>

      <div className="z-10 flex flex-col items-center justify-center w-full max-w-4xl gap-8 mt-10">
        
        {/* ── TOP: Title, Subtitle, Purpose ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center text-4xl border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)] ring-1 ring-white/5">
            🌱
          </div>
          <h1 className={`text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br mb-2 transition-colors ${textTitle}`}>
            Farm<span className="text-green-500">Zy</span>
          </h1>
          <p className={`text-lg md:text-xl font-medium leading-relaxed max-w-2xl transition-colors ${textDesc}`}>
            A direct digital ecosystem connecting farmers and companies. Ensuring fair pricing, complete transparency, and secure agricultural procurement without intermediaries.
          </p>
        </motion.div>

        {/* ── BOTTOM: Call to Action Buttons ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm sm:max-w-none justify-center px-4 sm:px-0">
          <button onClick={() => navigate("/login")} className="group relative px-10 py-4 bg-green-500 hover:bg-green-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            Login
            <span className="absolute inset-0 rounded-2xl ring-2 ring-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
          
          <button onClick={() => navigate("/register")} className={`group relative px-10 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl border transition-all hover:scale-105 active:scale-95 backdrop-blur-md ${btnSec}`}>
            Sign Up
            <span className={`absolute inset-0 rounded-2xl ${dark ? "bg-white/5" : "bg-black/5"} opacity-0 group-hover:opacity-100 transition-opacity`}></span>
          </button>
        </motion.div>

      </div>

      {/* ── BOTTOM FOOTER ── */}
      <footer className="absolute bottom-4 w-full text-center z-50 pointer-events-none">
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${footerText}`}>
          © {new Date().getFullYear()} FarmZy. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
