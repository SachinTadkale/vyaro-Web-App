import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-5xl h-[500px] bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex items-center justify-center bg-farmGreen text-white p-10 text-center">
          <div>
            <h2 className="text-3xl font-bold leading-snug tracking-wide">
              {isLogin ? (
                <>
                  Welcome Back to <span className="text-green-200">Farmzy</span>
                </>
              ) : (
                <>
                  🌱 Transform Your Farming Business with{" "}
                  <span className="text-green-200">Farmzy</span>
                </>
              )}
            </h2>

            <p className="mt-4 text-sm opacity-90 leading-relaxed">
              {isLogin
                ? "Access your dashboard, track your business, and stay connected with the agricultural marketplace."
                : "Digitize your farming operations, connect with trusted partners, and unlock new growth opportunities."}
            </p>

            <ul className="mt-6 space-y-3 text-sm opacity-90 leading-relaxed">
              {isLogin ? (
                <>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} />
                    Manage and track your crop listings efficiently
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faUsers} />
                    Connect with verified buyers and sellers
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faBolt} />
                    Stay updated with real-time market insights
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} />
                    Digitize your farming operations
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faUsers} />
                    Connect with trusted partners
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faBolt} />
                    Unlock new growth opportunities
                  </li>
                </>
              )}
            </ul>

            <p className="mt-6 text-xs opacity-70">
              Trusted by farmers & agri-businesses across India 🇮🇳
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-8">
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
