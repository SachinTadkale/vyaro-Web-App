import { api } from "./axios";

/* Products */
export const fetchProductsAPI = async () => {
  const { data } = await api.get("/company/products");
  return data;
};

export const createProductAPI = async (productData: { productName: string; category: string; unit: string }) => {
  const { data } = await api.post("/company/products", productData);
  return data;
};

export const updateProductAPI = async ({ id, productData }: { id: string; productData: unknown }) => {
  const { data } = await api.put(`/company/products/${id}`, productData);
  return data;
};

export const deleteProductAPI = async (id: string) => {
  const { data } = await api.delete(`/company/products/${id}`);
  return data;
};

/* Marketplace */
export const fetchFarmerListingsAPI = async () => {
  const { data } = await api.get("/api/marketplace/getListings");
  return data;
};

/* Dashboard Details */
export const fetchCompanyStatsAPI = async () => {
  const { data } = await api.get("/company/stats");
  return data;
};

export const loginCompanyAPI = async (data: any) => {
  const response = await api.post("/api/companyAuth/login", data);
  return response.data;
};

export const logoutCompanyAPI = async () => {
  const response = await api.post("/api/companyAuth/logout");
  return response.data;
};

export const fetchCompanyProfileAPI = async () => {
  const { data } = await api.get("/api/companyProfile");
  return data;
};

export const updateCompanyProfileImageAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const { data } = await api.put("/api/companyProfile/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteCompanyProfileImageAPI = async () => {
  const { data } = await api.delete("/api/companyProfile/profile-image");
  return data;
};

export const fetchCompanyNotificationsAPI = async () => {
  const { data } = await api.get("/company/notifications");
  return data;
};
