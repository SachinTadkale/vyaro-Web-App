import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen w-full flex bg-background items-center justify-center p-4 md:p-8 relative selection:bg-primary/20">

      {/* ── Theme Toggle ── */}
      <button
        onClick={toggleTheme}
        className="fixed top-8 right-8 w-10 h-10 rounded-full bg-muted/30 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all z-50 group"
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm transition-transform group-hover:rotate-12" />
      </button>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Top Branding (Mobile/Small screens) */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground/60 text-xs font-medium mt-1 uppercase tracking-widest">
            {isLogin ? "Access your FarmZy dashboard" : "Join the agricultural revolution"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {isLogin ? (
                <LoginForm switchToRegister={() => navigate("/register")} />
              ) : (
                <RegisterForm switchToLogin={() => navigate("/login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
