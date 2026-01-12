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
}
