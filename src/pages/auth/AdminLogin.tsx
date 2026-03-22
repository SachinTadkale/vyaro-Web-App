import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        {/* HEADER */}
        <div className="text-center">
          <div className="text-farmGreen text-3xl mb-2">
            <FontAwesomeIcon icon={faUserShield} />
          </div>

          <h2 className="text-xl font-bold">Admin Login</h2>

          <p className="text-sm text-gray-500 mt-1">
            Access admin dashboard securely
          </p>
        </div>

        {/* EMAIL */}
        <div className="flex items-center gap-1 px-2">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-gray-400 text-lg"
          />

          <input
            type="email"
            placeholder="Admin email"
            className="input flex-1"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center gap-1 px-2">
          <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />

          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input pr-10 w-full"
            />

            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-farmGreen"
            />
          </div>
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right">
          <span className="text-sm text-gray-500 cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </div>

        {/* BUTTON */}
        <button className="btn-primary transition-all duration-200 active:scale-95 hover:scale-[1.02]">
          Login
        </button>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400">
          Authorized personnel only
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
