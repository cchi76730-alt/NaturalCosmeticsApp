import api from "./api";

export const adminLogin = (data: {
  username: string;
  password: string;
}) => api.post("/admin/auth/login", data);


export const getDashboard = () =>
  api.get("/admin/dashboard");


export const getAdminProducts = () =>
  api.get("/admin/products");

export const getPendingOrders = () =>
  api.get("/api/admin/dashboard/pending-orders");

