import { api } from "./axios";

export const loginAPI = async (credentials: Record<string, unknown>) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerAPI = async (userData: Record<string, unknown>) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const getProfileAPI = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};
