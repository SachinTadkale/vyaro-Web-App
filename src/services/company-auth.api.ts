import { api } from "./axios";

export const loginCompanyAPI = async (credentials: { registrationNo: string; password: string }) => {
  const { data } = await api.post("/api/companyAuth/login", credentials);
  return data;
};

export const registerCompanyAPI = async (companyData: Record<string, unknown>) => {
  const { data } = await api.post("/api/companyAuth/register", companyData);
  return data;
};

export const uploadCompanyDocsAPI = async (formData: FormData) => {
  const { data } = await api.post("/api/companyAuth/upload-documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
