import {
  faBuilding,
  faEnvelope,
  faLock,
  faHashtag,
  faLocationDot,
  faEye,
  faEyeSlash,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  switchToLogin: () => void;
};

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

const inputClass =
  "w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:border-2 bg-white text-gray-900 transition-colors";
const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1 ml-1">{msg}</p> : null;

// Slide direction based on forward/back
const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
};

const RegisterForm = ({ switchToLogin }: Props) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [showPassword, setShowPassword] = useState(false);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onSubmit",
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: "onSubmit",
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onTouched",
  });

  const goNext = (n: number) => {
    setDirection(1);
    setStep(n);
  };
  const goBack = (n: number) => {
    setDirection(-1);
    setStep(n);
  };

  const onStep1Submit = () => goNext(2);
  const onStep2Submit = () => goNext(3);
  const onStep3Submit = (data: Step3Data) => {
    console.log("All steps complete:", {
      ...form1.getValues(),
      ...form2.getValues(),
      ...data,
    });
    goNext(4);
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center gap-6">
      {/* STEP BAR */}
      <div className="flex justify-center">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`h-2 w-8 mx-1 rounded-full ${
              step >= s ? "bg-farmGreen" : "bg-gray-300"
            }`}
            animate={{ backgroundColor: step >= s ? "#3a7d2c" : "#d1d5db" }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* ANIMATED STEP CONTENT */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <form
                onSubmit={form1.handleSubmit(onStep1Submit)}
                className="space-y-5"
              >
                <h2 className="text-xl font-bold text-center">
                  Company Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className={iconClass}
                      />
                      <input
                        placeholder="Company name"
                        className={inputClass}
                        autoComplete="organization"
                        {...form1.register("companyName")}
                      />
                    </div>
                    <ErrorMsg
                      msg={form1.formState.errors.companyName?.message}
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className={iconClass}
                      />
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

            {/* STEP 2 */}
            {step === 2 && (
              <form
                onSubmit={form2.handleSubmit(onStep2Submit)}
                className="space-y-5"
              >
                <h2 className="text-xl font-bold text-center">
                  Company Information
                </h2>

                <div className="space-y-4">
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

                  <div>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className={iconClass}
                      />
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
                    onClick={() => goBack(1)}
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

{/* STEP 3 */}
{step === 3 && (
  <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-5">
    <h2 className="text-xl font-bold text-center">Upload Documents</h2>
    <p className="text-sm text-gray-500 text-center -mt-3">
      Please upload required documents for verification.
    </p>

    <div className="space-y-4">
      {/* GST Certificate */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          GST Certificate
        </label>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-5 px-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
          <div className="flex flex-col items-center gap-1 text-center">
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className="text-2xl text-gray-400 group-hover:text-green-500 transition-colors duration-200"
            />
            <p className="text-sm text-gray-500 group-hover:text-green-600">
              {form3.watch("gstCertificate")?.[0]?.name ?? (
                <>
                  <span className="font-medium text-green-600">Click to upload</span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-400">PDF, JPG, PNG — max 5MB</p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            {...form3.register("gstCertificate")}
          />
        </label>
        <ErrorMsg msg={form3.formState.errors.gstCertificate?.message as string} />
      </div>

      {/* Business License */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Business License or Registration Document
        </label>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-5 px-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
          <div className="flex flex-col items-center gap-1 text-center">
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className="text-2xl text-gray-400 group-hover:text-green-500 transition-colors duration-200"
            />
            <p className="text-sm text-gray-500 group-hover:text-green-600">
              {form3.watch("businessLicense")?.[0]?.name ?? (
                <>
                  <span className="font-medium text-green-600">Click to upload</span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-400">PDF, JPG, PNG — max 5MB</p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            {...form3.register("businessLicense")}
          />
        </label>
        <ErrorMsg msg={form3.formState.errors.businessLicense?.message as string} />
      </div>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => goBack(2)}
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

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5 text-center">
                <motion.div
                  className="text-5xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  ✅
                </motion.div>
                <h2 className="text-xl font-bold">Waiting for Approval</h2>
                <p className="text-gray-600 text-sm">
                  Your company account is under review. You'll be notified once
                  approved.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={switchToLogin}
                >
                  Go to Login
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LOGIN LINK */}
      {step === 1 && (
        <motion.p
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-farmGreen cursor-pointer font-medium hover:underline"
          >
            Login here
          </span>
        </motion.p>
      )}
    </div>
  );
};

export default RegisterForm;