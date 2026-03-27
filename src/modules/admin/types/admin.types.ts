export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "BLOCKED";

export interface KycData {
  docType: string;
  docNo?: string;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone_no: string;
  address: string;
  isBlocked: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  kyc?: KycData;
}