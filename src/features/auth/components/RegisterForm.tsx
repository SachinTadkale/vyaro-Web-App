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
import { useMutation } from "@tanstack/react-query";
import { registerCompanyAPI, uploadCompanyDocsAPI } from "@/services/company-auth.api";
import { toast } from "sonner";

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
  "w-full h-11 bg-muted/10 border border-border rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground/40";
const iconClass =
  "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm pointer-events-none z-10";

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
  const [registerError, setRegisterError] = useState("");

  const { mutateAsync: registerCompany, isPending: isRegistering } = useMutation({
    mutationFn: registerCompanyAPI,
  });

  const { mutateAsync: uploadDocs, isPending: isUploading } = useMutation({
    mutationFn: uploadCompanyDocsAPI,
  });

  const isPending = isRegistering || isUploading;

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
  const onStep3Submit = async (data: Step3Data) => {
    setRegisterError("");
    const allData = {
      ...form1.getValues(),
      ...form2.getValues(),
    };

    const payload = {
      companyName: allData.companyName,
      registrationNo: allData.registrationNumber,
      hqLocation: allData.location,
      gstNumber: allData.gstNumber,
      email: allData.email,
      password: allData.password,
    };

    try {
      // 1. Register company
      const regResponse = await registerCompany(payload);
      if (regResponse.success && regResponse.data.companyId) {
        // 2. Upload documents
        const formData = new FormData();
        formData.append("companyId", regResponse.data.companyId);
        formData.append("gst", data.gstCertificate[0]);
        formData.append("license", data.businessLicense[0]);

        await uploadDocs(formData);
        
        // 3. Move to Step 4 on total success
        toast.success("Application successfully registered!");
        goNext(4);
      }
    } catch (error: any) {
      let msg = error.response?.data?.message || error.message || "Failed to register. Please try again.";
      if (typeof msg === "string" && (msg.includes("prisma") || msg.toLowerCase().includes("database"))) {
        msg = "Unable to connect to the database server. Please try again later.";
      } else if (typeof msg === "string" && msg.length > 120) {
        msg = "An unexpected server error occurred. Please try again.";
      }
      setRegisterError(msg);
      toast.error(msg);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>, field: "gstCertificate" | "businessLicense") => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      form3.setValue(field, e.dataTransfer.files as any, { shouldValidate: true });
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center gap-6">
      {/* STEP BAR */}
      <div className="flex justify-center">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`h-1.5 w-8 mx-1 rounded-full ${
              step >= s ? "bg-primary" : "bg-muted"
            }`}
            animate={{ backgroundColor: step >= s ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
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
                <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center">
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
                        id="companyName"
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
                        id="email"
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
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`${inputClass} pr-10`}
                        autoComplete="new-password"
                        {...form1.register("password")}
                      />
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm cursor-pointer hover:text-primary transition-colors z-10"
                      />
                    </div>
                    <ErrorMsg msg={form1.formState.errors.password?.message} />
                  </div>
                </div>

                <button type="submit" className="btn-primary h-11 w-full rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
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
                <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center">
                  Organization Info
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <FontAwesomeIcon icon={faHashtag} className={iconClass} />
                      <input
                        id="registrationNumber"
                        placeholder="Registration number"
                        className={inputClass}
                        autoComplete="on"
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
                        id="gstNumber"
                        placeholder="GST number (e.g. 27ABCDE1234F1Z5)"
                        className={inputClass}
                        autoComplete="on"
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
                        id="location"
                        placeholder="Head office location"
                        className={inputClass}
                        autoComplete="street-address"
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
                    className="w-full h-11 border border-border text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-muted/50 transition-all"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-primary h-11 w-full rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                    Continue
                  </button>
                </div>
              </form>
            )}

{/* STEP 3 */}
{step === 3 && (
  <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-5">
    <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center">Verification</h2>
    <p className="text-xs text-muted-foreground/60 text-center -mt-3">
      Please upload the required documents
    </p>

    <div className="space-y-4">
      {/* GST Certificate */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
          GST Certificate
        </label>
        <label 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "gstCertificate")}
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border/50 hover:border-primary bg-muted/10 hover:bg-primary/5 rounded-xl py-6 px-4 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className="text-2xl text-muted-foreground/30 group-hover:text-primary transition-colors duration-200"
            />
            <p className="text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200">
              {form3.watch("gstCertificate")?.[0]?.name ?? (
                <>
                  <span className="font-bold text-primary">Click to upload</span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">PDF, JPG, PNG — MAX 5MB</p>
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
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
          Company Registration License
        </label>
        <label 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "businessLicense")}
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border/50 hover:border-primary bg-muted/10 hover:bg-primary/5 rounded-xl py-6 px-4 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className="text-2xl text-muted-foreground/30 group-hover:text-primary transition-colors duration-200"
            />
            <p className="text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200">
              {form3.watch("businessLicense")?.[0]?.name ?? (
                <>
                  <span className="font-bold text-primary">Click to upload</span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">PDF, JPG, PNG — MAX 5MB</p>
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

    <div className="flex flex-col gap-3">
      {registerError && (
        <p className="text-red-500 text-xs text-center font-medium bg-red-500/10 py-2 px-3 rounded border border-red-500/20 break-words whitespace-normal leading-relaxed">
          {registerError}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goBack(2)}
          disabled={isPending}
          className="w-full h-11 border border-border text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-muted/50 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary h-11 w-full rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit Application"}
        </button>
      </div>
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
          className="text-center text-xs text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-primary cursor-pointer font-bold hover:underline underline-offset-4"
          >
            Sign in
          </span>
        </motion.p>
      )}
    </div>
  );
};

export default RegisterForm;