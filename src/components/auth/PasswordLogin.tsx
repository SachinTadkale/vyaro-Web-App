import { useState } from "react";

const PasswordLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      console.log("Login with email/password");
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
        required
      />

      <input
        type="password"
        placeholder="Enter your password"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
        required
      />

      <div className="text-right">
        <button
          type="button"
          className="text-sm text-farmGreen hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-farmGreen text-white py-3 rounded-lg hover:bg-farmDark transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default PasswordLogin;
