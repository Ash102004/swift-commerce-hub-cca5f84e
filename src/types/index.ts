export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
  description: string;
  descriptionAr?: string;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  couponCode?: string;
  discount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}
