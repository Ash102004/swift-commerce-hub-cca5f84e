import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Ticket, Copy, Check, Loader2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCoupons, useAddCoupon, useUpdateCoupon, useDeleteCoupon, DbCoupon } from '@/hooks/useCoupons';
import { staggerContainer, staggerItem } from '@/components/motion/MotionComponents';

const CouponManager = () => {
  const { data: coupons = [], isLoading } = useCoupons();
  const addCoupon = useAddCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DbCoupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrder: '',
    maxUses: '',
    isActive: true,
    expiresAt: '',
  });

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrder: '',
      maxUses: '',
      isActive: true,
      expiresAt: '',
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon?: DbCoupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type as 'percentage' | 'fixed',
        value: coupon.value.toString(),
        minOrder: (coupon.min_order || 0).toString(),
        maxUses: (coupon.max_uses || 0).toString(),
        isActive: coupon.is_active,
        expiresAt: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      toast.error('يرجى إدخال قيمة صحيحة للخصم');
      return;
    }

    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      toast.error('نسبة الخصم لا يمكن أن تتجاوز 100%');
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: parseFloat(formData.value),
        min_order: parseFloat(formData.minOrder) || 0,
        max_uses: parseInt(formData.maxUses) || null,
        is_active: formData.isActive,
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon.id, ...couponData });
      } else {
        // Check for duplicate code
        const existingCoupon = coupons.find(c => c.code.toUpperCase() === couponData.code);
        if (existingCoupon) {
          toast.error('هذا الكود موجود بالفعل');
          return;
        }
        await addCoupon.mutateAsync(couponData);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        await deleteCoupon.mutateAsync(id);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('تم نسخ الكود');
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const isSubmitting = addCoupon.isPending || updateCoupon.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold gold-text">كوبونات الخصم</h2>
            <p className="text-sm text-muted-foreground">إدارة أكواد الخصم والعروض</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => handleOpenDialog()} className="gap-2 btn-royal rounded-none px-6">
                <Plus className="w-4 h-4" />
                إضافة كوبون
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-none" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl gold-text">
                {editingCoupon ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-display">كود الخصم</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.code}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="مثال: SAVE20"
                    className="font-mono rounded-none"
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="button" variant="outline" onClick={generateRandomCode} className="rounded-none">
                      توليد
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-display">نوع الخصم</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت (دج)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-display">القيمة</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={formData.type === 'percentage' ? '10' : '500'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-display">الحد الأدنى للطلب (دج)</Label>
                  <Input
                    type="number"
                    value={formData.minOrder}
                    onChange={e => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-display">الحد الأقصى للاستخدام</Label>
                  <Input
                    type="number"
                    value={formData.maxUses}
                    onChange={e => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                    placeholder="0 = غير محدود"
                    min="0"
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-display">تاريخ الانتهاء (اختياري)</Label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-none"
                />
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 border border-border">
                <Label className="font-display">الكوبون فعال</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-none font-display" disabled={isSubmitting}>
                  إلغاء
                </Button>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full btn-royal rounded-none" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                    {editingCoupon ? 'حفظ التغييرات' : 'إنشاء الكوبون'}
                  </Button>
                </motion.div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <motion.div 
          className="card-royal rounded-none py-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto border-2 border-primary/30 flex items-center justify-center mb-6">
            <Ticket className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="font-display text-xl mb-2">لا توجد كوبونات</h3>
          <p className="text-sm text-muted-foreground">أنشئ كوبون خصم لعملائك</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {coupons.map((coupon) => {
              const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
              const isMaxedOut = coupon.max_uses && coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses;
              const isInactive = !coupon.is_active || isExpired || isMaxedOut;

              return (
                <motion.div
                  key={coupon.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`card-royal rounded-none p-6 ${isInactive ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="w-14 h-14 border-2 border-primary flex items-center justify-center bg-primary/5"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        <Ticket className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-semibold text-xl">{coupon.code}</span>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopyCode(coupon.code)}
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </motion.div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/30 rounded-none font-display">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} دج`}
                          </Badge>
                          {coupon.min_order && coupon.min_order > 0 && (
                            <Badge variant="outline" className="rounded-none">الحد الأدنى: {coupon.min_order.toLocaleString()} دج</Badge>
                          )}
                          {coupon.max_uses && coupon.max_uses > 0 && (
                            <Badge variant="outline" className="rounded-none">
                              {coupon.used_count}/{coupon.max_uses} استخدام
                            </Badge>
                          )}
                          {isExpired && <Badge variant="destructive" className="rounded-none">منتهي</Badge>}
                          {isMaxedOut && <Badge variant="destructive" className="rounded-none">مستنفد</Badge>}
                          {!coupon.is_active && <Badge variant="secondary" className="rounded-none">معطل</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {coupon.expires_at && !isExpired && (
                        <span className="text-xs text-muted-foreground">
                          ينتهي: {format(new Date(coupon.expires_at), 'dd/MM/yyyy')}
                        </span>
                      )}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(coupon)}
                          className="rounded-none border-border hover:border-primary hover:bg-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive rounded-none border-border hover:border-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default CouponManager;
