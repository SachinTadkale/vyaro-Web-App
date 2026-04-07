import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHashtag,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { loginCompanyAPI } from "@/services/company-auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  switchToRegister: () => void;
};

const inputClass =
  "w-full h-11 bg-muted/10 border border-border rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground/40";
const iconClass =
  "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm pointer-events-none z-10";

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
  const [registrationNo, setRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: () => loginCompanyAPI({ registrationNo, password }),
    onSuccess: (response) => {
      // response.data could hold user and token
      if (response.success && response.data) {
        const userData = response.data.company || response.data.user;
        setAuth({ ...userData, role: "COMPANY" }, response.data.token);
        toast.success(`Welcome back, ${userData.companyName || userData.name || 'Company'}!`);
        navigate("/dashboard/company");
      }
    },
    onError: (error: any) => {
      let msg = error.response?.data?.message || error.message || "Invalid registration number or password";
      
      // Override "Invalid credentials" to "Incorrect password" based on user preference
      if (typeof msg === "string" && msg.toLowerCase().includes("invalid credentials")) {
        msg = "Incorrect password";
      }
      
      // Handle raw database or excessively long errors cleanly
      if (typeof msg === "string" && (msg.includes("prisma") || msg.toLowerCase().includes("database"))) {
        msg = "Unable to connect to the database server. Please try again later.";
      } else if (typeof msg === "string" && msg.length > 120) {
        msg = "An unexpected server error occurred. Please try again.";
      }
      setErrorMsg(msg);
      toast.error(msg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNo && !password) {
      toast.error("Please enter details in both fields")
      return;
    }
    if (!registrationNo) {
      toast.error("Please enter your registration number.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }
    handleLogin();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm flex flex-col justify-center gap-6"
    >
      <motion.h2
        className="text-2xl font-semibold tracking-tight text-foreground text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        Sign in to Farm<span className="text-primary">Zy</span>
      </motion.h2>

      <div className="space-y-4">
        {/* REGISTRATION NUMBER */}
        <motion.div
          className="relative"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <FontAwesomeIcon icon={faHashtag} className={iconClass} />
          <input
            type="text"
            name="registrationNo"
            id="registrationNo"
            autoComplete="on"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            placeholder="Registration Number (e.g. MH1234)"
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
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className={`${inputClass} pr-10`}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm cursor-pointer hover:text-primary transition-colors"
          />
        </motion.div>
      </div>

      {/* BUTTON */}
      <motion.button
        type="submit"
        disabled={isPending}
        className="btn-primary h-11 w-full rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        whileTap={{ scale: 0.98 }}
      >
        {isPending ? "Logging in..." : "Login"}
      </motion.button>

      {/* FORGOT PASSWORD */}
      <motion.div
        className="text-center"
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <span className="text-xs font-medium text-muted-foreground/60 cursor-pointer hover:text-primary transition-colors">
          Forgot Password?
        </span>
      </motion.div>

      {/* REGISTER LINK */}
      <motion.p
        className="text-center text-xs text-muted-foreground/40"
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        New to FarmZy?{" "}
        <span
          onClick={switchToRegister}
          className="text-primary cursor-pointer font-bold hover:underline underline-offset-4"
        >
          Create an account
        </span>
      </motion.p>
    </form>
  );
};

export default LoginForm;