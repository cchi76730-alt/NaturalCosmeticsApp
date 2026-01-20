import { User } from "../types/User";
import api from "./api";

export const updateProfile = async (
  userId: number,
  data: {
    username: string;
    email?: string;
    phone?: string;
  }
): Promise<User> => {
  const res = await api.put(`/users/${userId}`, data);
  return res.data;
};
