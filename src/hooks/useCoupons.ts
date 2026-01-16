import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DbCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface CouponInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order?: number;
  max_uses?: number;
  is_active?: boolean;
  expires_at?: string;
}

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DbCoupon[];
    },
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .maybeSingle();
      
      if (error) throw error;
      
      if (!coupon) {
        throw new Error('كود الخصم غير موجود');
      }
      
      if (!coupon.is_active) {
        throw new Error('كود الخصم غير فعال');
      }
      
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('كود الخصم منتهي الصلاحية');
      }
      
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        throw new Error('تم استنفاد عدد مرات استخدام الكود');
      }
      
      if (orderTotal < coupon.min_order) {
        throw new Error(`الحد الأدنى للطلب هو ${coupon.min_order} دج`);
      }
      
      return coupon as DbCoupon;
    },
  });
};

export const useUseCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (code: string) => {
      const { data: coupon, error: fetchError } = await supabase
        .from('coupons')
        .select('used_count')
        .eq('code', code.toUpperCase())
        .single();
      
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('coupons')
        .update({ used_count: coupon.used_count + 1 })
        .eq('code', code.toUpperCase());
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useAddCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coupon: CouponInput) => {
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          code: coupon.code.toUpperCase(),
          type: coupon.type,
          value: coupon.value,
          min_order: coupon.min_order || 0,
          max_uses: coupon.max_uses || null,
          is_active: coupon.is_active !== false,
          expires_at: coupon.expires_at || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as DbCoupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم إضافة الكوبون بنجاح');
    },
    onError: (error: Error) => {
      console.error('Error adding coupon:', error);
      if (error.message.includes('duplicate')) {
        toast.error('كود الخصم موجود مسبقاً');
      } else {
        toast.error('حدث خطأ أثناء إضافة الكوبون');
      }
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CouponInput> & { id: string }) => {
      const { error } = await supabase
        .from('coupons')
        .update({
          code: updates.code?.toUpperCase(),
          type: updates.type,
          value: updates.value,
          min_order: updates.min_order,
          max_uses: updates.max_uses,
          is_active: updates.is_active,
          expires_at: updates.expires_at,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم تحديث الكوبون بنجاح');
    },
    onError: (error) => {
      console.error('Error updating coupon:', error);
      toast.error('حدث خطأ أثناء تحديث الكوبون');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم حذف الكوبون بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting coupon:', error);
      toast.error('حدث خطأ أثناء حذف الكوبون');
    },
  });
};
