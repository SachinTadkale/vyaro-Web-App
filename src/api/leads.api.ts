import axios from "./axios";

export type LeadRole = "FARMER" | "COMPANY";

export const getLeadsAPI = async () => {
  const res = await axios.get("/api/leads/getLeads");
  return res.data.data;
};

export const deleteLeadAPI = async (id: string) => {
  const res = await axios.delete(`/api/leads/deleteLead/${id}`);
  return res.data;
};

export const createLeadAPI = async (data: {
  email: string;
  role: LeadRole;
  name?: string;
}) => {
  const res = await axios.post("/api/leads/addLead", data);
  return res.data;
};