export interface Product {
  id: number;
  name: string;
  price: number | string;
  discount?: number | string;
  image?: string;
  rating?: number;
}
