export type CompanyStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface Company {
  id: string;
  name: string;
  email: string;
  verificationStatus: CompanyStatus;
}

