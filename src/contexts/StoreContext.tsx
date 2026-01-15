import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, Coupon } from '@/types';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Bag',
    nameAr: 'حقيبة جلد فاخرة',
    price: 299,
    description: 'Handcrafted genuine leather bag with premium finish',
    descriptionAr: 'حقيبة جلد طبيعي مصنوعة يدوياً بلمسة فاخرة',
    image: '',
    category: 'bags',
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Watch',
    nameAr: 'ساعة كلاسيكية',
    price: 450,
    description: 'Elegant timepiece with Swiss movement',
    descriptionAr: 'ساعة أنيقة بحركة سويسرية',
    image: '',
    category: 'watches',
    stock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Silk Scarf',
    nameAr: 'وشاح حرير',
    price: 120,
    description: 'Luxurious silk scarf with unique pattern',
    descriptionAr: 'وشاح حرير فاخر بنمط فريد',
    image: '',
    category: 'accessories',
    stock: 25,
    createdAt: new Date().toISOString(),
  },
];

interface StoreContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; coupon?: Coupon; error?: string };
  useCoupon: (code: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const validateCoupon = (code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; error?: string } => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { valid: false, error: 'كود الخصم غير موجود' };
    }
    
    if (!coupon.isActive) {
      return { valid: false, error: 'كود الخصم غير فعال' };
    }
    
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, error: 'كود الخصم منتهي الصلاحية' };
    }
    
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: 'تم استنفاد عدد مرات استخدام الكود' };
    }
    
    if (orderTotal < coupon.minOrder) {
      return { valid: false, error: `الحد الأدنى للطلب هو ${coupon.minOrder} دج` };
    }
    
    return { valid: true, coupon };
  };

  const useCoupon = (code: string) => {
    setCoupons(prev =>
      prev.map(c => 
        c.code.toUpperCase() === code.toUpperCase() 
          ? { ...c, usedCount: c.usedCount + 1 } 
          : c
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        coupons,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        useCoupon,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
