import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DbOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  wilaya: string;
  commune: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  coupon_code: string | null;
  total: number;
  status: string;
  tracking_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  wilaya: string;
  commune: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount?: number;
  coupon_code?: string;
  total: number;
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse JSON items
      return (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[],
      })) as DbOrder[];
    },
  });
};

export const useOrderByTracking = (trackingCode: string) => {
  return useQuery({
    queryKey: ['orders', 'tracking', trackingCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_code', trackingCode)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        items: data.items as unknown as OrderItem[],
      } as DbOrder;
    },
    enabled: !!trackingCode && trackingCode.length >= 5,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: OrderInput) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email || null,
          wilaya: order.wilaya,
          commune: order.commune,
          address: order.address,
          items: order.items as any,
          subtotal: order.subtotal,
          shipping_cost: order.shipping_cost,
          discount: order.discount || 0,
          coupon_code: order.coupon_code || null,
          total: order.total,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        items: data.items as unknown as OrderItem[],
      } as DbOrder;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`تم تأكيد طلبك! رقم التتبع: ${data.tracking_code}`);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast.error('حدث خطأ أثناء إنشاء الطلب');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('تم تحديث حالة الطلب');
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast.error('حدث خطأ أثناء تحديث الطلب');
    },
  });
};
