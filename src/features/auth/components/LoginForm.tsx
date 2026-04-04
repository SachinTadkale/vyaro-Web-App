import { useState } from "react";

type Props = {
  switchToRegister: () => void;
};

const inputClass =
  "w-full px-4 py-3 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const LoginForm = ({ switchToRegister }: Props) => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!registrationNo || !password) {
      setErrorMsg("Please enter your registration number and password.");
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setErrorMsg("Unable to sign in. Please check your details and try again.");
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Registration Number
        </label>
        <input
          type="text"
          name="registrationNo"
          id="registrationNo"
          autoComplete="on"
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
          placeholder="e.g. MH1234"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          New to FarmZy?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-primary font-bold hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
