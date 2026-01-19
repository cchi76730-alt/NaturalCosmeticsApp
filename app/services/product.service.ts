import api from "./api";

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  description?: string;
discount?: number; // %
  rating?: number; 
  category?: {
    id: number;
    name: string;
  };
}



// API Calls
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  console.log("📦 API /products raw response:", res.data);
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// Helper Functions
export const getProductsByCategory = (
  products: Product[],
  categoryId: string
): Product[] => {
  if (categoryId === "all") return products;

  return products.filter(
    (p) => p.category?.id === Number(categoryId)
  );
};


export const searchProducts = (
  products: Product[], 
  query: string
): Product[] => {
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery) ||
p.category?.name?.toLowerCase().includes(lowerQuery)
  );
};

export const filterAndSearchProducts = (
  products: Product[],
  categoryId: string,
  searchQuery: string
): Product[] => {
  let filtered = getProductsByCategory(products, categoryId);
  
  if (searchQuery) {
    filtered = searchProducts(filtered, searchQuery);
  }
  
  return filtered;
};

// Tính giá sau giảm
export const getDiscountedPrice = (product: Product): number => {
  if (!product.discount || product.discount <= 0) {
    return product.price;
  }
  return product.price * (1 - product.discount / 100);
};

// Tính số tiền tiết kiệm được
export const getSavingAmount = (product: Product): number => {
  if (!product.discount || product.discount <= 0) {
    return 0;
  }
  return product.price - getDiscountedPrice(product);
};

// Kiểm tra còn hàng
export const isInStock = (product: Product): boolean => {
  return (product.stock ?? 0) > 0;
};

// Kiểm tra sắp hết hàng
export const isLowStock = (product: Product, threshold: number = 5): boolean => {
  const stock = product.stock ?? 0;
  return stock > 0 && stock <= threshold;
};

// Sắp xếp sản phẩm
export const sortProducts = (
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'discount'
): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => 
        getDiscountedPrice(a) - getDiscountedPrice(b)
      );
    
    case 'price-desc':
      return sorted.sort((a, b) => 
        getDiscountedPrice(b) - getDiscountedPrice(a)
      );
    
    case 'name':
      return sorted.sort((a, b) => 
        a.name.localeCompare(b.name, 'vi')
      );
    
    case 'rating':
      return sorted.sort((a, b) => 
        (b.rating ?? 0) - (a.rating ?? 0)
      );
    
    case 'discount':
      return sorted.sort((a, b) => 
        (b.discount ?? 0) - (a.discount ?? 0)
      );
    
    default:
      return sorted;
  }
};

// Format giá tiền
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' ₫';
};

// Lấy trạng thái stock
export const getStockStatus = (product: Product): {
  text: string;
  color: string;
} => {
  const stock = product.stock ?? 0;
  
  if (stock === 0) {
    return { text: 'Hết hàng', color: '#FF4500' };
  }
  
  if (stock <= 5) {
    return { text: `Chỉ còn ${stock}`, color: '#FFA500' };
  }
  
  return { text: `Còn ${stock}`, color: '#00FF7F' };
};