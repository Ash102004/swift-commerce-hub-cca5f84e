import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Minus, Plus, Trash2, ShoppingBag, Package, ArrowLeft, Ticket, X, Check, Loader2, Crown, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { wilayas, getBaladiyas, getDeliveryPrice } from '@/data/algeriaLocations';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useValidateCoupon, useUseCoupon, DbCoupon } from '@/hooks/useCoupons';
import { useCreateOrder } from '@/hooks/useOrders';

type DeliveryType = 'home' | 'desk';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();
  const useCoupon = useUseCoupon();
  
  const [isCheckout, setIsCheckout] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('home');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DbCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    wilaya: '',
    baladiya: '',
    address: '',
  });

  const availableBaladiyas = customerInfo.wilaya ? getBaladiyas(customerInfo.wilaya) : [];
  const deliveryPrice = customerInfo.wilaya ? getDeliveryPrice(customerInfo.wilaya) : null;
  const deliveryCost = deliveryPrice 
    ? (deliveryType === 'home' ? deliveryPrice.homeDelivery : deliveryPrice.deskDelivery) 
    : 0;

  // Calculate discount
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (total * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, total)
    : 0;

  const grandTotal = total - discount + deliveryCost;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('يرجى إدخال كود الخصم');
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateCoupon.mutateAsync({ code: couponCode, orderTotal: total });
      if ('valid' in result && result.valid && 'coupon' in result && result.coupon) {
        setAppliedCoupon(result.coupon as DbCoupon);
        setCouponError('');
        toast.success('تم تطبيق كود الخصم بنجاح!');
      } else if ('error' in result) {
        setCouponError(result.error as string || 'كود غير صالح');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('حدث خطأ أثناء التحقق من الكود');
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.wilaya || !customerInfo.baladiya) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const selectedWilaya = wilayas.find(w => w.id === customerInfo.wilaya);
    const selectedBaladiya = availableBaladiyas.find(b => b.id === customerInfo.baladiya);

    try {
      // Use coupon if applied
      if (appliedCoupon) {
        useCoupon.mutate(appliedCoupon.code);
      }

      await createOrder.mutateAsync({
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        wilaya: selectedWilaya?.nameAr || customerInfo.wilaya,
        commune: selectedBaladiya?.nameAr || customerInfo.baladiya,
        address: customerInfo.address || `${selectedBaladiya?.nameAr}, ${selectedWilaya?.nameAr}`,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: (item.product as any).images?.[0] || item.product.image,
        })),
        subtotal: total,
        shipping_cost: deliveryCost,
        discount: discount,
        total: grandTotal,
        coupon_code: appliedCoupon?.code || null,
      });

      clearCart();
      setIsCheckout(false);
      setCustomerInfo({ name: '', phone: '', wilaya: '', baladiya: '', address: '' });
      setAppliedCoupon(null);
      setCouponCode('');
      toast.success('تم تأكيد الطلب بنجاح! سنتواصل معك قريباً.');
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  const handleWilayaChange = (value: string) => {
    setCustomerInfo(prev => ({ ...prev, wilaya: value, baladiya: '' }));
  };

  const isSubmitting = createOrder.isPending;

  if (items.length === 0 && !isCheckout) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-parchment">
          <div className="max-w-md mx-auto text-center px-4 py-16">
            <div className="w-24 h-24 mx-auto mb-8 border-2 border-primary/30 flex items-center justify-center bg-card">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <h1 className="font-display text-3xl font-semibold mb-4 gold-text">سلة التسوق فارغة</h1>
            <p className="text-muted-foreground text-body mb-8">
              يبدو أنك لم تضف أي منتجات إلى سلة التسوق بعد.
            </p>
            <Button asChild className="btn-royal px-8 py-3">
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                تابع التسوق
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-medieval py-12 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold gold-text mb-2">
            {isCheckout ? 'إتمام الطلب الملكي' : 'سلة التسوق الملكية'}
          </h1>
          <p className="text-secondary-foreground/60 text-body">
            {isCheckout ? 'أدخل معلومات التوصيل لإتمام طلبك' : 'راجع منتجاتك قبل إتمام الطلب'}
          </p>
        </div>
      </div>

      <div className="bg-parchment py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {!isCheckout ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.product.id}
                      className="card-royal rounded-none p-6 flex gap-6 fade-in hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-24 h-24 border border-border overflow-hidden shrink-0 bg-muted">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-10 h-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-medium truncate">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.product.price.toLocaleString()} دج</p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-none border-l border-border hover:bg-primary/10 hover:text-primary"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-display font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-none border-r border-border hover:bg-primary/10 hover:text-primary"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-lg font-semibold text-primary">
                          {(item.product.price * item.quantity).toLocaleString()} دج
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="card-royal rounded-none p-8 space-y-8">
                  <div className="flex items-center gap-3 pb-6 border-b border-border">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="font-display text-xl font-medium">معلومات التوصيل</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-display">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="أدخل اسمك الكامل"
                        dir="rtl"
                        className="rounded-none border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-display">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="أدخل رقم هاتفك"
                        dir="ltr"
                        className="rounded-none border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-display">الولاية *</Label>
                      <Select value={customerInfo.wilaya} onValueChange={handleWilayaChange}>
                        <SelectTrigger className="rounded-none bg-background border-border">
                          <SelectValue placeholder="اختر الولاية" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {wilayas.map(wilaya => (
                            <SelectItem key={wilaya.id} value={wilaya.id}>
                              {wilaya.id} - {wilaya.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-display">البلدية *</Label>
                      <Select 
                        value={customerInfo.baladiya} 
                        onValueChange={(value) => setCustomerInfo(prev => ({ ...prev, baladiya: value }))}
                        disabled={!customerInfo.wilaya}
                      >
                        <SelectTrigger className="rounded-none bg-background border-border">
                          <SelectValue placeholder={customerInfo.wilaya ? "اختر البلدية" : "اختر الولاية أولاً"} />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {availableBaladiyas.map(baladiya => (
                            <SelectItem key={baladiya.id} value={baladiya.id}>
                              {baladiya.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="font-display">العنوان التفصيلي</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="أدخل عنوانك التفصيلي (اختياري)"
                        dir="rtl"
                        className="rounded-none border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Delivery Type Selection */}
                  {customerInfo.wilaya && deliveryPrice && (
                    <div className="space-y-4 pt-6 border-t border-border">
                      <Label className="font-display text-lg">نوع التوصيل *</Label>
                      <RadioGroup 
                        value={deliveryType} 
                        onValueChange={(value) => setDeliveryType(value as DeliveryType)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className={`flex items-center justify-between p-5 border-2 transition-all cursor-pointer ${deliveryType === 'home' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="home" id="home" />
                            <Label htmlFor="home" className="cursor-pointer font-display">
                              توصيل للبيت
                            </Label>
                          </div>
                          <span className="font-display font-semibold text-primary">{deliveryPrice.homeDelivery} دج</span>
                        </div>
                        <div className={`flex items-center justify-between p-5 border-2 transition-all cursor-pointer ${deliveryType === 'desk' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="desk" id="desk" />
                            <Label htmlFor="desk" className="cursor-pointer font-display">
                              توصيل للمكتب
                            </Label>
                          </div>
                          <span className="font-display font-semibold text-primary">{deliveryPrice.deskDelivery} دج</span>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-6 border-t border-border">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCheckout(false)} 
                      disabled={isSubmitting}
                      className="rounded-none border-border font-display"
                    >
                      العودة للسلة
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-royal rounded-none" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      تأكيد الطلب الملكي
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-royal rounded-none p-8 sticky top-24">
                <div className="flex items-center gap-3 pb-6 border-b border-border mb-6">
                  <Crown className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-medium">ملخص الطلب</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground text-body">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-display">{(item.product.price * item.quantity).toLocaleString()} دج</span>
                    </div>
                  ))}
                </div>
                
                {/* Coupon Section */}
                <div className="border-t border-border pt-6 space-y-4">
                  {!appliedCoupon ? (
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 font-display">
                        <Ticket className="w-4 h-4 text-primary" />
                        كود الخصم
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={e => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          placeholder="أدخل الكود"
                          className="font-mono rounded-none border-border"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleApplyCoupon} 
                          disabled={isValidating}
                          className="rounded-none border-border hover:border-primary hover:bg-primary/10 font-display"
                        >
                          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تطبيق'}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-destructive">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="font-mono font-medium">{appliedCoupon.code}</span>
                        <span className="text-sm text-muted-foreground">
                          (-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${appliedCoupon.value} دج`})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-6 mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="font-display">{total.toLocaleString()} دج</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>الخصم</span>
                      <span className="font-display">-{discount.toLocaleString()} دج</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تكلفة التوصيل</span>
                    <span className={`font-display ${deliveryCost > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {deliveryCost > 0 ? `${deliveryCost.toLocaleString()} دج` : 'اختر الولاية'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-primary/30">
                    <span className="font-display font-medium">المجموع الكلي</span>
                    <span className="text-2xl font-display font-semibold gold-text">{grandTotal.toLocaleString()} دج</span>
                  </div>
                  {!isCheckout && (
                    <Button className="w-full btn-royal rounded-none mt-6" onClick={() => setIsCheckout(true)}>
                      متابعة الطلب الملكي
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
