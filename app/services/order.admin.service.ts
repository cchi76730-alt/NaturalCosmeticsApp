import api from "./api";

export type OrderStatus = "PENDING" | "CONFIRMED";

export interface Order {
  id: number;
  customerName: string;
  phone?: string;
  totalPrice: number;
  status: OrderStatus;
}

/* ================== ADMIN ================== */

// Lấy danh sách đơn
export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get("/admin/orders");
  return res.data;
};

// Lấy chi tiết đơn
export const getOrderById = async (id: number): Promise<Order> => {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data;
};

// ✅ XÁC NHẬN / CẬP NHẬT TRẠNG THÁI
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus
): Promise<Order> => {
  const res = await api.put(
    `/admin/orders/${orderId}/status`,
    null,
    {
      params: { status },
    }
  );
  return res.data;
};
export const confirmOrder = async (orderId: number) => {
  const res = await api.put(`/admin/orders/${orderId}/confirm`);
  return res.data;
};