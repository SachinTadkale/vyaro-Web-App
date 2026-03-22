import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faBolt,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col items-center justify-center bg-farmGreen text-white p-10 text-center rounded-l-2xl min-h-[520px]">

          {/* Icon */}
          <div className="mb-4 text-4xl opacity-90">
            <FontAwesomeIcon icon={faSeedling} />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold leading-snug tracking-wide">
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
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-sm opacity-80 leading-relaxed max-w-xs">
            {isLogin
              ? "Access your dashboard, track your business, and stay connected with the agricultural marketplace."
              : "Digitize your farming operations, connect with trusted partners, and unlock new growth opportunities."}
          </p>

          {/* Feature list */}
          <ul className="mt-6 space-y-3 text-sm opacity-90 leading-relaxed w-full max-w-xs text-left">
            {isLogin ? (
              <>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faChartLine} className="w-4 shrink-0" />
                  Manage and track your crop listings efficiently
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUsers} className="w-4 shrink-0" />
                  Connect with verified buyers and sellers
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBolt} className="w-4 shrink-0" />
                  Stay updated with real-time market insights
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faChartLine} className="w-4 shrink-0" />
                  Digitize your farming operations
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUsers} className="w-4 shrink-0" />
                  Connect with trusted partners
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBolt} className="w-4 shrink-0" />
                  Unlock new growth opportunities
                </li>
              </>
            )}
          </ul>

          {/* Footer */}
          <p className="mt-8 text-xs opacity-60">
            Trusted by farmers & agri-businesses across India 🇮🇳
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-8 py-10">
          {isLogin ? (
            <LoginForm switchToRegister={() => navigate("/register")} />
          ) : (
            <RegisterForm switchToLogin={() => navigate("/login")} />
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;