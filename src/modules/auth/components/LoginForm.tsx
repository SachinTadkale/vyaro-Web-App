import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

type Props = {
  switchToRegister: () => void;
};

const inputClass =
  "w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:border-2 bg-white text-gray-900 transition-colors";
const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10";

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

const LoginForm = ({ switchToRegister }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-sm flex flex-col justify-center gap-6"
    >
      <motion.h2
        className="text-xl font-bold text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        Company Login
      </motion.h2>

      <div className="space-y-5">
        {/* EMAIL */}
        <motion.div
          className="relative"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <FontAwesomeIcon icon={faEnvelope} className={iconClass} />
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={inputClass}
          />
        </motion.div>

        {/* PASSWORD */}
        <motion.div
          className="relative"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <FontAwesomeIcon icon={faLock} className={iconClass} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            className={`${inputClass} pr-10`}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-farmGreen"
          />
        </motion.div>
      </div>

      {/* BUTTON */}
      <motion.button
        type="submit"
        className="btn-primary"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
      >
        Login
      </motion.button>

      {/* FORGOT PASSWORD */}
      <motion.div
        className="text-right"
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <span className="text-sm text-gray-500 cursor-pointer hover:underline">
          Forgot Password?
        </span>
      </motion.div>

      {/* REGISTER LINK */}
      <motion.p
        className="text-center text-sm text-gray-500"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        Do not have an account?{" "}
        <span
          onClick={switchToRegister}
          className="text-farmGreen cursor-pointer font-medium hover:underline"
        >
          Register here
        </span>
      </motion.p>
    </form>
  );
};

export default LoginForm;