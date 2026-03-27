import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faBolt,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col items-center justify-center bg-farmGreen text-white p-10 text-center rounded-l-2xl min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-panel" : "register-panel"}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <motion.div
                className="text-4xl mb-4 opacity-90"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <FontAwesomeIcon icon={faSeedling} />
              </motion.div>

              <motion.h2
                className="text-3xl font-bold leading-snug tracking-wide"
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {isLogin ? (
                  <>
                    Welcome Back to{" "}
                    <span className="text-green-200">Farmzy</span>
                  </>
                ) : (
                  <>
                    Transform Your Farming Business with{" "}
                    <span className="text-green-200">Farmzy</span>
                  </>
                )}
              </motion.h2>

              <motion.p
                className="mt-4 text-sm opacity-80 leading-relaxed max-w-xs"
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                {isLogin
                  ? "Access your dashboard, track your business, and stay connected with the agricultural marketplace."
                  : "Digitize your farming operations, connect with trusted partners, and unlock new growth opportunities."}
              </motion.p>

              <ul className="mt-6 space-y-3 text-sm opacity-90 leading-relaxed w-full max-w-xs text-left">
                {(isLogin
                  ? [
                      {
                        icon: faChartLine,
                        text: "Manage and track your crop listings efficiently",
                      },
                      {
                        icon: faUsers,
                        text: "Connect with verified buyers and sellers",
                      },
                      {
                        icon: faBolt,
                        text: "Stay updated with real-time market insights",
                      },
                    ]
                  : [
                      {
                        icon: faChartLine,
                        text: "Digitize your farming operations",
                      },
                      { icon: faUsers, text: "Connect with trusted partners" },
                      { icon: faBolt, text: "Unlock new growth opportunities" },
                    ]
                ).map((item, i) => (
                  <motion.li
                    key={item.text}
                    className="flex items-center gap-3"
                    custom={i + 2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="w-4 shrink-0"
                    />
                    {item.text}
                  </motion.li>
                ))}
              </ul>

              <motion.p
                className="mt-8 text-xs opacity-60"
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                Trusted by farmers & agri-businesses across India 🇮🇳
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login-form" : "register-form"}
            className="flex items-center justify-center px-8 py-10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {isLogin ? (
              <LoginForm switchToRegister={() => navigate("/register")} />
            ) : (
              <RegisterForm switchToLogin={() => navigate("/login")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
