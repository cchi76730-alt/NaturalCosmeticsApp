import api from "./api";

export const updateProfile = async (id: number, formData: FormData) => {
  const res = await api.put(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
