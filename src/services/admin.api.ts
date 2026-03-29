import { api } from "./axios";

/* User / KYC Management */
export const fetchUsersAPI = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const fetchAdminStatsAPI = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const approveUserAPI = async (id: string) => {
  const { data } = await api.patch(`/admin/users/${id}/approve`);
  return data;
};

export const rejectUserAPI = async (id: string) => {
  const { data } = await api.patch(`/admin/users/${id}/reject`);
  return data;
};

export const blockUserAPI = async (id: string) => {
  const { data } = await api.patch(`/admin/users/${id}/block`);
  return data;
};

export const unblockUserAPI = async (id: string) => {
  const { data } = await api.patch(`/admin/users/${id}/unblock`);
  return data;
};
