import axios from "./axios";

export interface Lead {
  id: string;
  email: string;
  role: "FARMER" | "COMPANY";
  name?: string | null;
  createdAt: string;
}

// 🔥 GET ALL LEADS
export const getLeads = async (): Promise<Lead[]> => {
  const res = await axios.get("/api/leads/getLeads");
  return res.data.data;
};

// 🔥 DELETE LEAD
export const deleteLead = async (id: string): Promise<void> => {
  await axios.delete(`/api/leads/deleteLead/${id}`);
};

// 🔥 OPTIONAL CREATE
export const createLead = async (data: {
  email: string;
  role: "FARMER" | "COMPANY";
  name?: string;
}) => {
  return axios.post("/api/leads/addLead", data);
};