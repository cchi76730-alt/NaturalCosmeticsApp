import api from "./api";

export const getCartApi = () => {
  return api.get("/cart");
};
