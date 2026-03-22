import {
  faBuilding,
  faEnvelope,
  faLock,
  faHashtag,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
  switchToLogin: () => void;
};

const RegisterForm = ({ switchToLogin }: Props) => {
  const [step, setStep] = useState(1);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center gap-6">

      {/* STEP BAR */}
      <div className="flex justify-center">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 w-8 mx-1 rounded-full ${
              step >= s ? "bg-farmGreen" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <form onSubmit={next} className="space-y-5">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-center">
              Company Details
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-400 text-lg" />
                <input
                  placeholder="Company name"
                  className="input flex-1"
                  autoComplete="organization"
                />
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-lg" />
                <input
                  placeholder="Email address"
                  className="input flex-1"
                  autoComplete="email"
                />
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder="Password"
                  className="input flex-1"
                  autoComplete="new-password"
                />
              </div>

            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-center">
              Company Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faHashtag} className="text-gray-400 text-lg" />
                <input placeholder="Registration number" className="input flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faHashtag} className="text-gray-400 text-lg" />
                <input placeholder="GST number" className="input flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-lg" />
                <input placeholder="Head office location" className="input flex-1" />
              </div>

            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-center">
              Upload Company Documents
            </h2>

            <p className="text-sm text-gray-500 text-center mb-4">
              Please upload required documents for verification.
            </p>

            <div className="space-y-5">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  GST Certificate
                </label>
                <input
                  type="file"
                  className="input mt-1"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Business License or Registration Document
                </label>
                <input
                  type="file"
                  className="input mt-1"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold">Waiting for approval</h2>

              <p className="text-gray-600 text-sm mt-2">
                Your company account is under review.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={switchToLogin}
            >
              Go to Login
            </button>
          </>
        )}

        {/* BUTTON */}
        {step < 4 && (
          <button className="btn-primary">
            {step === 3 ? "Submit Documents" : "Continue"}
          </button>
        )}

      </form>

      {/* LOGIN LINK */}
      {step === 1 && (
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-farmGreen cursor-pointer font-medium hover:underline"
          >
            Login here
          </span>
        </p>
      )}
    </div>
  );
};

export default RegisterForm;