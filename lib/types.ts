export type StockStatus = "available" | "low_stock" | "out_of_stock";

export type DeliveryType = "delivery" | "pickup";

export type ProductBadge = "new" | "sale" | "bestseller" | "premium";

export type SizeCode = "S" | "M" | "L";

export interface ProductSize {
  code: SizeCode;
  label: string;
  multiplier: number; // multiplied with base price
}

export interface Review {
  id: number;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice?: number;
  description: string;
  composition: string;
  images: string[];
  stock_status: StockStatus;
  is_featured: boolean;
  is_new: boolean;
  badges: ProductBadge[];
  category: string; // category slug
  collectionSlugs: string[];
  tags: string[];
  rating: number; // 0..5
  reviewCount: number;
  sizes?: ProductSize[];
}

export interface Category {
  slug: string;
  title: string;
  emoji: string;
  count?: number;
}

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  cover: string;
}

export interface Addon {
  code: string;
  title: string;
  description: string;
  price: number;
}

export interface Branch {
  id: number;
  slug: string;
  title: string;
  address: string;
  work_hours: string;
  phone: string;
}

export type PromoType = "percent" | "fixed";

export interface PromoCode {
  type: PromoType;
  value: number;
  description: string;
}

export interface OrderSummary {
  id: number;
  productTitle: string;
  total: number;
  status: "pending" | "in_progress" | "ready" | "delivered" | "cancelled";
  statusLabel: string;
  createdAt: string;
  itemsCount: number;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  productPrice: number;
  deliveryPrice: number;
  servicesTotal: number;
  discountAmount: number;
  total: number;
  lines: PriceLine[];
}

export interface CartItem {
  productId: number;
  qty: number;
  size: SizeCode;
  addons: string[];
}

export interface Address {
  id: number;
  title: string;
  full: string;
}
