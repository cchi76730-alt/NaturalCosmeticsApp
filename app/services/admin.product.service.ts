import api from "./api";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  image: string;
  category: {
    id: number;
  };
}

// ================= CREATE =================
export const createProduct = (data: CreateProductDto) => {
  return api.post("/admin/products", data);
};

// ================= GET ALL (ADMIN) =================
export const getAdminProducts = async () => {
  const res = await api.get("/admin/products");
  return res.data;
};

// ================= UPDATE =================
export const updateProduct = async (
  id: number,
  data: {
    name: string;
    price: number;
    stock: number;
    image: string;
    categoryId: number;
  }
) => {
  const res = await api.put(`/admin/products/${id}`, data);
  return res.data;
};

// ================= DELETE =================
// ================= DELETE =================
export const deleteProduct = async (id: number) => {
  console.log("🟥 CALL DELETE API:", id);

  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

