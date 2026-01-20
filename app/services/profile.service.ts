import api from "./api";

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getMyStats = async () => {
  const res = await api.get("/users/me/stats");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/users/me", data);
  return res.data;
};
