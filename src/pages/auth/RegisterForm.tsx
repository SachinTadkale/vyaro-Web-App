import {
  faBuilding,
  faEnvelope,
  faLock,
  faHashtag,
  faLocationDot,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Props = {
  switchToLogin: () => void;
};

// ── Schemas ──────────────────────────────────────────────
const step1Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const step2Schema = z.object({
  registrationNumber: z.string().min(3, "Enter a valid registration number"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid GST number (e.g. 27ABCDE1234F1Z5)",
    ),
  location: z.string().min(3, "Enter a valid location"),
});

const step3Schema = z.object({
  gstCertificate: z
    .instanceof(FileList)
    .refine((f) => f.length > 0, "GST Certificate is required")
    .refine((f) => f[0]?.size <= 5 * 1024 * 1024, "File must be under 5MB")
    .refine(
      (f) =>
        ["application/pdf", "image/jpeg", "image/png"].includes(f[0]?.type),
      "Only PDF, JPG, or PNG allowed",
    ),
  businessLicense: z
    .instanceof(FileList)
    .refine((f) => f.length > 0, "Business License is required")
    .refine((f) => f[0]?.size <= 5 * 1024 * 1024, "File must be under 5MB")
    .refine(
      (f) =>
        ["application/pdf", "image/jpeg", "image/png"].includes(f[0]?.type),
      "Only PDF, JPG, or PNG allowed",
    ),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ── Reusable field components ─────────────────────────────
const inputClass =
  "w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-600";

const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1 ml-1">{msg}</p> : null;

// ── Main Component ────────────────────────────────────────
const RegisterForm = ({ switchToLogin }: Props) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 form
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
  });

  // Step 2 form
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
  });

  // Step 3 form
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onTouched",
  });

  const onStep1Submit = () => setStep(2);
  const onStep2Submit = () => setStep(3);
  const onStep3Submit = (data: Step3Data) => {
    console.log("All steps complete:", {
      ...form1.getValues(),
      ...form2.getValues(),
      ...data,
    });
    setStep(4);
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center gap-6">
      {/* STEP BAR */}
      <div className="flex justify-center">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 w-8 mx-1 rounded-full transition-colors duration-300 ${
              step >= s ? "bg-farmGreen" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form
          onSubmit={form1.handleSubmit(onStep1Submit)}
          className="space-y-5"
        >
          <h2 className="text-xl font-bold text-center">Company Details</h2>

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faBuilding} className={iconClass} />
                <input
                  placeholder="Company name"
                  className={inputClass}
                  autoComplete="organization"
                  {...form1.register("companyName")}
                />
              </div>
              <ErrorMsg msg={form1.formState.errors.companyName?.message} />
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className={iconClass} />
                <input
                  type="email"
                  placeholder="Email address"
                  className={inputClass}
                  autoComplete="email"
                  {...form1.register("email")}
                />
              </div>
              <ErrorMsg msg={form1.formState.errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${inputClass} pr-10`}
                  autoComplete="new-password"
                  {...form1.register("password")}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-farmGreen z-10"
                />
              </div>
              <ErrorMsg msg={form1.formState.errors.password?.message} />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Continue
          </button>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <form
          onSubmit={form2.handleSubmit(onStep2Submit)}
          className="space-y-5"
        >
          <h2 className="text-xl font-bold text-center">Company Information</h2>

          <div className="space-y-4">
            {/* Registration Number */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faHashtag} className={iconClass} />
                <input
                  placeholder="Registration number"
                  className={inputClass}
                  {...form2.register("registrationNumber")}
                />
              </div>
              <ErrorMsg
                msg={form2.formState.errors.registrationNumber?.message}
              />
            </div>

            {/* GST Number */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faHashtag} className={iconClass} />
                <input
                  placeholder="GST number (e.g. 27ABCDE1234F1Z5)"
                  className={inputClass}
                  {...form2.register("gstNumber")}
                />
              </div>
              <ErrorMsg msg={form2.formState.errors.gstNumber?.message} />
            </div>

            {/* Location */}
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faLocationDot} className={iconClass} />
                <input
                  placeholder="Head office location"
                  className={inputClass}
                  {...form2.register("location")}
                />
              </div>
              <ErrorMsg msg={form2.formState.errors.location?.message} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full border border-gray-300 text-gray-600 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button type="submit" className="btn-primary">
              Continue
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <form
          onSubmit={form3.handleSubmit(onStep3Submit)}
          className="space-y-5"
        >
          <h2 className="text-xl font-bold text-center">Upload Documents</h2>
          <p className="text-sm text-gray-500 text-center -mt-3">
            Please upload required documents for verification.
          </p>

          <div className="space-y-4">
            {/* GST Certificate */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                GST Certificate
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-600"
                {...form3.register("gstCertificate")}
              />
              <ErrorMsg
                msg={form3.formState.errors.gstCertificate?.message as string}
              />
            </div>

            {/* Business License */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Business License or Registration Document
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-600"
                {...form3.register("businessLicense")}
              />
              <ErrorMsg
                msg={form3.formState.errors.businessLicense?.message as string}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full border border-gray-300 text-gray-600 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button type="submit" className="btn-primary">
              Submit Documents
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 4 ── */}
      {step === 4 && (
        <div className="space-y-5 text-center">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-bold">Waiting for Approval</h2>
          <p className="text-gray-600 text-sm">
            Your company account is under review. You'll be notified once
            approved.
          </p>
          <button type="button" className="btn-primary" onClick={switchToLogin}>
            Go to Login
          </button>
        </div>
      )}

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
