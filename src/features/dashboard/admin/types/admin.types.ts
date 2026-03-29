export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "VERIFIED";

export type AccountStatus = "ACTIVE" | "BLOCKED";

export interface KycData {
  docType: string;
  docNo?: string;
  submittedAt: string;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  location: string;
  address: string;
  state: string;
  district: string;
  village: string;
  landArea: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
  kycStatus: VerificationStatus;
  status: AccountStatus;
  joinedDate: string;
  activity: {
    totalListings: number;
    totalOrders: number;
    lastActive: string;
  };
}

export interface Company {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  gstNumber: string;
  regNumber: string;
  hqLocation: string;
  kycStatus: VerificationStatus;
  status: AccountStatus;
  joinedDate: string;
  activity: {
    totalOrders: number;
    activeListings: number;
    purchaseVolume: string;
  };
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