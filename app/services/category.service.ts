import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: 'Chăm sóc da', 
    icon: '✨',
    description: 'Sữa rửa mặt, kem dưỡng, serum...'
  },
  { 
    id: '2', 
    name: 'Trang điểm', 
    icon: '💄',
    description: 'Son, phấn, mascara...'
  },
  { 
    id: '3', 
    name: 'Chăm sóc tóc', 
    icon: '💆‍♀️',
    description: 'Dầu gội, dầu xả, mặt nạ tóc...'
  },
  { 
    id: '4', 
    name: 'Nước hoa', 
    icon: '🌸',
    description: 'Nước hoa, xịt thơm...'
  },
  { 
    id: '5', 
    name: 'Chăm sóc cơ thể', 
    icon: '🧴',
    description: 'Sữa tắm, kem body...'
  }
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryName = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.name : 'Chưa phân loại';
};

export const getCategoryIcon = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.icon : '📦';
};