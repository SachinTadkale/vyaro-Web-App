import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  switchToRegister: () => void;
};

const LoginForm = ({ switchToRegister }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-sm flex flex-col justify-center gap-6"
    >
      <div>
        <h2 className="text-xl font-bold text-center mb-6">
          Company Login
        </h2>

        <div className="space-y-5">

          {/* EMAIL */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-farmGreen"
            />
            <input
              type="email"
              placeholder="Email address"
              className="input pl-11"
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-farmGreen"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input pl-11 pr-10"
              autoComplete="current-password"
            />

            {/* 👁️ TOGGLE */}
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-farmGreen"
            />
          </div>

        </div>
      </div>

      <button className="btn-primary transition-all duration-200 active:scale-95 hover:scale-[1.02]">
        Login
      </button>

      {/* FORGOT PASSWORD */}
      <p className="text-right text-sm text-gray-500 cursor-pointer hover:underline">
        Forgot Password?
      </p>

      <p className="text-center text-sm text-gray-500">
        Do not have an account?{" "}
        <span
          onClick={switchToRegister}
          className="text-farmGreen cursor-pointer font-medium hover:underline"
        >
          Register here
        </span>
      </p>
    </form>
  );
};

export default LoginForm;