import { useState } from "react";
import PasswordLogin from "@/components/auth/PasswordLogin";
import OtpLogin from "@/components/auth/OtpLogin";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Login = () => {
  const [tab, setTab] = useState<"password" | "otp">("password");

  return (
    <div className="min-h-screen bg-farmBg flex items-center justify-center px-6">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg grid md:grid-cols-2 overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex items-center justify-center bg-farmGreen text-white p-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Farmzy
            </h2>

            <p className="text-sm opacity-90">
              A digital agriculture marketplace connecting farmers and
              companies for transparent crop trading.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-10">

          <h2 className="text-2xl font-bold text-farmDark mb-6 text-center">
            Login to Farmzy
          </h2>

          {/* Tabs */}
          <div className="flex border-b mb-6">

            <button
              onClick={() => setTab("password")}
              className={`flex-1 py-2 font-medium transition ${
                tab === "password"
                  ? "border-b-2 border-farmGreen text-farmGreen"
                  : "text-gray-500"
              }`}
            >
              Password
            </button>

            <button
              onClick={() => setTab("otp")}
              className={`flex-1 py-2 font-medium transition ${
                tab === "otp"
                  ? "border-b-2 border-farmGreen text-farmGreen"
                  : "text-gray-500"
              }`}
            >
              OTP Login
            </button>

          </div>

          {/* Form Container */}
          <div className="relative h-[210px] overflow-hidden">

            <AnimatePresence mode="wait">

              {tab === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <PasswordLogin />
                </motion.div>
              )}

              {tab === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <OtpLogin />
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Register */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/choose-role"
              className="text-farmGreen font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;