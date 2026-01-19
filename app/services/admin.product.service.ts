import api from "./api";

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  image: string;
  category: {
    id: number;
  };
}

export const createProduct = (data: CreateProductDto) => {
  return api.post("/products", data);
};


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
  console.log(`📤 UPDATE PRODUCT #${id}:`, data);
  const res = await api.put(`/admin/products/${id}`, data);
  console.log("📥 RESPONSE:", res.data);
  return res.data;
};

// ✅ THÊM HÀM XÓA (nếu cần)
export const deleteProduct = async (id: number) => {
  console.log("🗑️ DELETE PRODUCT:", id);
  const res = await api.delete(`/admin/products/${id}`);
  console.log("📥 RESPONSE:", res.data);
  return res.data;
};

