export type LeadRole = "FARMER" | "COMPANY";
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED";

export interface Lead {
  id: string;
  email: string;
  role: LeadRole;
  name?: string | null;
  createdAt: string;
  status?: LeadStatus;
  notes?: string;
}