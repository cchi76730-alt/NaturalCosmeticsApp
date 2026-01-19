import api from "./api";

/* ================== TẠO ĐƠN ================== */
export const createOrder = async (orderData: any) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

/* ================== LẤY ĐƠN CỦA TÔI ================== */
export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

/* ================== CHI TIẾT ĐƠN ================== */
export const getOrderDetail = async (id: number) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
