import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Coupon } from '@/types';
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
import { Plus, Pencil, Trash2, Ticket, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CouponManager = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
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

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        minOrder: coupon.minOrder.toString(),
        maxUses: coupon.maxUses.toString(),
        isActive: coupon.isActive,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const couponData = {
      code: formData.code.toUpperCase().trim(),
      type: formData.type,
      value: parseFloat(formData.value),
      minOrder: parseFloat(formData.minOrder) || 0,
      maxUses: parseInt(formData.maxUses) || 0,
      isActive: formData.isActive,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
      toast.success('تم تحديث الكوبون بنجاح');
    } else {
      // Check for duplicate code
      const existingCoupon = coupons.find(c => c.code.toUpperCase() === couponData.code);
      if (existingCoupon) {
        toast.error('هذا الكود موجود بالفعل');
        return;
      }
      addCoupon(couponData);
      toast.success('تم إنشاء الكوبون بنجاح');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      deleteCoupon(id);
      toast.success('تم حذف الكوبون');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">كوبونات الخصم</h2>
          <p className="text-sm text-muted-foreground">إدارة أكواد الخصم والعروض</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة كوبون
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>كود الخصم</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.code}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="مثال: SAVE20"
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" onClick={generateRandomCode}>
                    توليد
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الخصم</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت (دج)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>القيمة</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={formData.type === 'percentage' ? '10' : '500'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الحد الأدنى للطلب (دج)</Label>
                  <Input
                    type="number"
                    value={formData.minOrder}
                    onChange={e => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحد الأقصى للاستخدام</Label>
                  <Input
                    type="number"
                    value={formData.maxUses}
                    onChange={e => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                    placeholder="0 = غير محدود"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>تاريخ الانتهاء (اختياري)</Label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label>الكوبون فعال</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCoupon ? 'حفظ التغييرات' : 'إنشاء الكوبون'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <Ticket className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl text-muted-foreground">لا توجد كوبونات</h3>
          <p className="text-sm text-muted-foreground mt-2">أنشئ كوبون خصم لعملائك</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map(coupon => {
            const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const isMaxedOut = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
            const isInactive = !coupon.isActive || isExpired || isMaxedOut;

            return (
              <div
                key={coupon.id}
                className={`bg-card rounded-lg p-4 card-elevated ${isInactive ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-lg">{coupon.code}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={coupon.isActive && !isExpired && !isMaxedOut ? 'default' : 'secondary'}>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} دج`}
                        </Badge>
                        {coupon.minOrder > 0 && (
                          <Badge variant="outline">الحد الأدنى: {coupon.minOrder} دج</Badge>
                        )}
                        {coupon.maxUses > 0 && (
                          <Badge variant="outline">
                            {coupon.usedCount}/{coupon.maxUses} استخدام
                          </Badge>
                        )}
                        {isExpired && <Badge variant="destructive">منتهي</Badge>}
                        {isMaxedOut && <Badge variant="destructive">مستنفد</Badge>}
                        {!coupon.isActive && <Badge variant="secondary">معطل</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {coupon.expiresAt && !isExpired && (
                      <span className="text-xs text-muted-foreground">
                        ينتهي: {format(new Date(coupon.expiresAt), 'dd/MM/yyyy')}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(coupon)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CouponManager;
