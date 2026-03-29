export type LeadRole = "FARMER" | "COMPANY";

export interface Lead {
  id: string;
  email: string;
  role: LeadRole;
  name?: string | null;
  createdAt: string;
}