import api from "./api";

// Lấy thông tin user
export const getUserProfile = async (userId: number) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

// Update profile
export const updateUserProfile = async (
  userId: number,
  data: FormData
) => {
  const res = await api.put(
    `/users/${userId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// Lấy thống kê
export const getUserStats = async (userId: number) => {
  const res = await api.get(`/users/${userId}/stats`);
  return res.data;
};

// Đổi mật khẩu - BỔ SUNG userId
export const changePassword = async (data: {
  userId: number;  // ✅ THÊM FIELD NÀY
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.post("/profile/change-password", data);
  return res.data;
};