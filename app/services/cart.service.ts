import api from "./api";

export const addToCart = (productId: number, quantity = 1) => {
  return api.post("/cart/add", null, {
    params: { productId, quantity },
  });
};

export const buyNow = (productId: number, quantity = 1) => {
  return api.post("/cart/buy-now", null, {
    params: { productId, quantity },
  });
};
