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
        <h2 className="text-xl font-bold text-center mb-6">Company Login</h2>

        <div className="space-y-5">
          {/* EMAIL */}
          <div className="flex items-center gap-3 px-1">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-gray-400 text-lg"
            />

            <input
              type="email"
              placeholder="Email address"
              className="input flex-1"
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center gap-3 px-1">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />

            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input w-full pr-10"
                autoComplete="current-password"
              />

              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-farmGreen"
              />
            </div>
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
