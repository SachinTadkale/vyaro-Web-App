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
          <div className="text-green-700 text-3xl mb-2">
            <FontAwesomeIcon icon={faUserShield} />
          </div>
          <h2 className="text-xl font-bold">Admin Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Access admin dashboard securely
          </p>
        </div>

        {/* EMAIL — icon inside, input padded to clear it */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"
          />
          <input
            type="email"
            placeholder="Admin email"
            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* PASSWORD — same pattern as email for consistency */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-green-700"
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right -mt-2">
          <span className="text-sm text-gray-500 cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:bg-green-800"
        >
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