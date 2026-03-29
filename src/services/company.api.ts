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
  const { data } = await api.get("/company/farmer-listings");
  return data;
};

/* Dashboard Details */
export const fetchCompanyStatsAPI = async () => {
  const { data } = await api.get("/company/stats");
  return data;
};

export const fetchCompanyProfileAPI = async () => {
  const { data } = await api.get("/company/profile");
  return data;
};

export const fetchCompanyNotificationsAPI = async () => {
  const { data } = await api.get("/company/notifications");
  return data;
};
