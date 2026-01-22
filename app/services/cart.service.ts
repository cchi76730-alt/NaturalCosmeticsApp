import api from "./api";

// 🛒 THÊM GIỎ HÀNG
export const addToCart = async (
  productId: number,
  quantity: number
) => {
  const res = await api.post(
    `/cart/add?productId=${productId}&quantity=${quantity}`
  );
  return res.data;
};

// ⚡ MUA NGAY
export const buyNow = async (
  productId: number,
  quantity: number
) => {
  const res = await api.post(
    `/cart/buy-now?productId=${productId}&quantity=${quantity}`
  );
  return res.data;
};
