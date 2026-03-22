import {
  faBuilding,
  faEnvelope,
  faLock,
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

      <form onSubmit={next} className="space-y-4">
        {/* STEP 1 */}
        <div className="space-y-5">
          {/* COMPANY */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-farmGreen"
            />
            <input
              placeholder="Company name"
              className="input pl-11"
              autoComplete="organization"
            />
          </div>

          {/* EMAIL */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-farmGreen"
            />
            <input
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
              type="password"
              placeholder="Password"
              className="input pl-11"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-center">
              Company Information
            </h2>

            <input placeholder="Registration number" className="input" />
            <input placeholder="GST number" className="input" />
            <input placeholder="Head office location" className="input" />
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-center">
              Upload Company Documents
            </h2>

            <p className="text-sm text-gray-500 text-center mb-4">
              Please upload required documents for verification. Make sure files
              are clear and valid.
            </p>

            {/* GST CERTIFICATE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                GST Certificate
              </label>
              <input
                type="file"
                className="input mt-1"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-400 mt-1">
                Accepted formats: PDF, JPG, PNG
              </p>
            </div>

            {/* BUSINESS LICENSE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Business License or Registration Document
              </label>
              <input
                type="file"
                className="input mt-1"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload company registration proof
              </p>
            </div>
          </>
        )}
        {/* STEP 4 */}
        {step === 4 && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold">Waiting for approval</h2>

              <p className="text-gray-600 text-sm mt-2">
                Your company account is under review. You will receive an email
                after approval.
              </p>
            </div>
            <div>
              <button className="btn-primary" onClick={switchToLogin}>
                Go to Login
              </button>
            </div>
          </>
        )}

        {/* BUTTON */}
        {step < 4 && (
          <button className="btn-primary">
            {step === 3 ? "Submit Documents" : "Continue"}
          </button>
        )}
      </form>

      {/* LOGIN LINK ONLY STEP 1 */}
      {step === 1 && (
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-farmGreen cursor-pointer font-medium"
          >
            Login here
          </span>
        </p>
      )}
    </div>
  );
};

export default RegisterForm;
