import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faBuilding,
  faLandmark, 
  faUniversity,
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faBan,
  faCheck,
  faXmark,
  faClock,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import KycDocumentPreview from "./KycDocumentPreview";

type Props = {
  type: "farmers" | "companies";
  data: any;
  onViewDoc: (src: string, title: string) => void;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  onBlock?: () => void;
  isProcessing?: boolean;
};

const KycDrawerContent = ({ 
  type, 
  data, 
  onViewDoc,
  onApprove,
  onReject,
  onBlock,
  isProcessing 
}: Props) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!data) return null;

  const isApproved = data.status === "APPROVED";
  const isRejected = data.status === "REJECTED";
  const isPending = data.status === "PENDING";

  return (
    <div className="space-y-8 pb-24">
      {/* SECTION 1: Basic Information */}
      <section className="space-y-4">
        <SectionHeader icon={faUser} title="BASIC INFORMATION" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="FULL NAME" value={type === "farmers" ? data.name : data.companyName} />
          <InfoField label={type === "farmers" ? "GENDER" : "REGISTRATION NO"} value={type === "farmers" ? data.gender : data.regNumber} />
          <InfoField label="EMAIL ADDRESS" value={data.email} />
          <InfoField label="PHONE NUMBER" value={data.phone} />
        </div>
      </section>

      {/* SECTION 2: Specific Details */}
      <section className="space-y-4">
        <SectionHeader icon={type === "farmers" ? faLandmark : faBuilding} title={type === "farmers" ? "FARM DETAILS" : "BUSINESS DETAILS"} />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="STATE" value={data.state} />
          <InfoField label="DISTRICT" value={data.district} />
          <InfoField label={type === "farmers" ? "VILLAGE" : "CITY"} value={type === "farmers" ? data.village : (data.location?.split(",")[0] || "N/A")} />
          <InfoField label={type === "farmers" ? "LAND AREA" : "GST NUMBER"} value={type === "farmers" ? data.landArea : (data.gstNumber ? `****${data.gstNumber.slice(-4)}` : "N/A")} />
          {type === "farmers" && data.docNumber && (
            <InfoField label="DOCUMENT NUMBER" value={`****${data.docNumber.slice(-4)}`} />
          )}
        </div>
      </section>

      {/* SECTION 3: Bank Details */}
      <section className="space-y-4">
        <SectionHeader icon={faUniversity} title="BANK DETAILS" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="BANK NAME" value={data.bankName || "N/A"} />
          <InfoField label="ACCOUNT HOLDER" value={data.accHolder || "N/A"} />
          <InfoField label="ACCOUNT NUMBER" value={data.accNumber ? `****${data.accNumber.slice(-4)}` : "N/A"} />
          <InfoField label="IFSC CODE" value={data.ifsc || "N/A"} />
        </div>
      </section>

      {/* SECTION 4: Documents */}
      <section className="space-y-4">
        <SectionHeader icon={faIdCard} title="KYC DOCUMENTS" />
        <div className="grid grid-cols-2 gap-4">
          <KycDocumentPreview 
            label={type === "farmers" ? data.docType : "GST CERTIFICATE"}
            src={data.primaryDocUrl || ""}
            onClick={() => data.primaryDocUrl ? onViewDoc(data.primaryDocUrl, "Primary Document") : null}
          />
          <KycDocumentPreview 
            label={type === "farmers" ? "LAND RECORD" : "LICENSE DOC"}
            src={data.secondaryDocUrl || ""}
            onClick={() => data.secondaryDocUrl ? onViewDoc(data.secondaryDocUrl, "Secondary Document") : null}
          />
        </div>
      </section>

      {/* SECTION 5: Timeline */}
      <section className="space-y-4">
        <SectionHeader icon={faClock} title="TIMELINE" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="SUBMITTED AT" value={data.submittedAt || new Date().toLocaleDateString()} />
          <InfoField label="LAST UPDATED" value={data.updatedAt || new Date().toLocaleDateString()} />
        </div>
      </section>

      {/* SECTION 6: Actions — Only show if pending */}
      {isPending && (
        <section className="sticky -bottom-6 -mx-6 px-6 py-4 bg-background/90 backdrop-blur-xl border-t border-border/50 z-10 mt-8">
          <div className="flex flex-col gap-3">
            {isRejecting ? (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason (Mandatory)"
                  className="w-full bg-muted/20 border border-border/40 p-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-red-500/30 min-h-[80px] resize-none"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsRejecting(false)}
                    disabled={isProcessing}
                    className="flex-1 h-10 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 text-[11px] font-bold uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!rejectReason.trim()) return;
                      onReject(rejectReason);
                    }}
                    disabled={isProcessing || !rejectReason.trim()}
                    className="flex-1 h-10 rounded-lg bg-red-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faXmark} />}
                    Confirm Reject
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <button 
                    onClick={onApprove}
                    disabled={isProcessing}
                    className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isProcessing ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                    Approve Request
                  </button>
                  <button 
                    onClick={() => setIsRejecting(true)}
                    disabled={isProcessing}
                    className="flex-1 h-10 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-[11px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    Reject
                  </button>
                </div>
                
                {onBlock && (
                  <button 
                    onClick={onBlock}
                    disabled={isProcessing}
                    className="w-full h-10 rounded-lg bg-muted/30 text-muted-foreground/40 hover:text-red-400 hover:bg-muted/50 border border-transparent hover:border-red-400/20 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faBan} />
                    Block Account
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* STATUS FEEDBACK Overlay */}
      {(isApproved || isRejected) && (
        <div className={`p-4 rounded-xl border flex flex-col gap-1 ${isApproved ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" : "bg-red-500/5 border-red-500/10 text-red-400"}`}>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={isApproved ? faCheckCircle : faTimesCircle} className="text-sm" />
            <span className="text-sm font-medium uppercase tracking-widest">{isApproved ? "Verification Success" : "Verification Rejected"}</span>
          </div>
          <span className="text-[11px] opacity-60 font-medium ml-7 mt-1">Processed on {new Date().toLocaleDateString()}</span>
          {isRejected && data.reason && (
            <div className="ml-7 mt-2 p-2 bg-red-500/10 rounded-md border border-red-500/20">
              <span className="text-xs text-red-300">Reason: {data.reason}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ icon, title }: { icon: any, title: string }) => (
  <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2 mb-4">
    <FontAwesomeIcon icon={icon} className="text-[10px] text-primary/40" />
    {title}
  </h4>
);

const InfoField = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">{label}</label>
    <span className="text-sm font-normal text-foreground/90 tracking-tight leading-tight">{value}</span>
  </div>
);

export default KycDrawerContent;
