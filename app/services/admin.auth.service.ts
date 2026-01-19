import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8080/api", // ⚠️ kiểm tra backend
});

export const adminLogin = (data: {
  username: string;
  password: string;
}) => {
  return adminApi.post("/admin/login", data);
};
