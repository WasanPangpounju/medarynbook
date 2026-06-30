export type StoreBook = {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  badge: "ใหม่" | "ขายดี" | null;
  coverImage: string | null;
  coverImageAlt: string;
  bg: string;
  url: string;
  category: string;
  isPromotion: boolean;
  isFeatured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: string;
};
