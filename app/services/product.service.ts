import api from "./api";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};
