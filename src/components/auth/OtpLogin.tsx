import { useState } from "react";

const OtpLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("OTP sent to:", email);
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const verifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("OTP verified:", otp);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>

      {!otpSent ? (
        <form onSubmit={sendOtp} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
            required
          />

          <button
            type="submit"
            className="w-full bg-farmGreen text-white py-3 rounded-lg hover:bg-farmDark transition"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">

          <p className="text-sm text-gray-600">
            OTP sent to <span className="font-medium">{email}</span>
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-farmGreen"
            required
          />

          <button
            type="submit"
            className="w-full bg-farmGreen text-white py-3 rounded-lg hover:bg-farmDark transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>
      )}

    </div>
  );
};

export default OtpLogin;