import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
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
import { Minus, Plus, Trash2, ShoppingBag, Package, ArrowLeft, Ticket, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { wilayas, getBaladiyas, getDeliveryPrice } from '@/data/algeriaLocations';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Coupon } from '@/types';

type DeliveryType = 'home' | 'desk';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { addOrder, validateCoupon, useCoupon } = useStore();
  const [isCheckout, setIsCheckout] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('home');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    wilaya: '',
    baladiya: '',
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

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('يرجى إدخال كود الخصم');
      return;
    }

    const result = validateCoupon(couponCode, total);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponError('');
      toast.success('تم تطبيق كود الخصم بنجاح!');
    } else {
      setCouponError(result.error || 'كود غير صالح');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.wilaya || !customerInfo.baladiya) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    const selectedWilaya = wilayas.find(w => w.id === customerInfo.wilaya);
    const selectedBaladiya = availableBaladiyas.find(b => b.id === customerInfo.baladiya);
    const fullAddress = `${selectedBaladiya?.nameAr || ''}, ${selectedWilaya?.nameAr || ''}`;

    // Use coupon if applied
    if (appliedCoupon) {
      useCoupon(appliedCoupon.code);
    }

    addOrder({
      items: items,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: fullAddress,
      total: grandTotal,
      status: 'pending',
      couponCode: appliedCoupon?.code,
      discount: discount,
    });

    clearCart();
    setIsCheckout(false);
    setCustomerInfo({ name: '', phone: '', wilaya: '', baladiya: '' });
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('تم تأكيد الطلب بنجاح! سنتواصل معك قريباً.');
  };

  const handleWilayaChange = (value: string) => {
    setCustomerInfo(prev => ({ ...prev, wilaya: value, baladiya: '' }));
  };

  if (items.length === 0 && !isCheckout) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-2xl font-semibold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">
          {isCheckout ? 'Checkout' : 'Shopping Cart'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {!isCheckout ? (
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-card rounded-lg p-4 flex gap-4 card-elevated"
                  >
                    <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.product.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="bg-card rounded-lg p-6 card-elevated space-y-6">
                <h2 className="font-display text-xl font-medium">معلومات التوصيل</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="أدخل رقم هاتفك"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الولاية *</Label>
                    <Select value={customerInfo.wilaya} onValueChange={handleWilayaChange}>
                      <SelectTrigger className="bg-background">
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
                    <Label>البلدية *</Label>
                    <Select 
                      value={customerInfo.baladiya} 
                      onValueChange={(value) => setCustomerInfo(prev => ({ ...prev, baladiya: value }))}
                      disabled={!customerInfo.wilaya}
                    >
                      <SelectTrigger className="bg-background">
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
                  
                  {/* Delivery Type Selection */}
                  {customerInfo.wilaya && deliveryPrice && (
                    <div className="space-y-3">
                      <Label>نوع التوصيل *</Label>
                      <RadioGroup 
                        value={deliveryType} 
                        onValueChange={(value) => setDeliveryType(value as DeliveryType)}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="home" id="home" />
                            <Label htmlFor="home" className="cursor-pointer font-normal">
                              توصيل للبيت
                            </Label>
                          </div>
                          <span className="font-semibold text-primary">{deliveryPrice.homeDelivery} دج</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="desk" id="desk" />
                            <Label htmlFor="desk" className="cursor-pointer font-normal">
                              توصيل للمكتب
                            </Label>
                          </div>
                          <span className="font-semibold text-primary">{deliveryPrice.deskDelivery} دج</span>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCheckout(false)}>
                    العودة للسلة
                  </Button>
                  <Button type="submit" className="flex-1">
                    تأكيد الطلب
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 card-elevated sticky top-24">
              <h2 className="font-display text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <div className="border-t border-border pt-4 space-y-3">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
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
                        className="font-mono"
                      />
                      <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                        تطبيق
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-destructive">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-mono font-medium">{appliedCoupon.code}</span>
                      <span className="text-sm text-muted-foreground">
                        (-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${appliedCoupon.value} دج`})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{total.toFixed(2)} دج</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span>-{discount.toFixed(2)} دج</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تكلفة التوصيل</span>
                  <span className={deliveryCost > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                    {deliveryCost > 0 ? `${deliveryCost} دج` : 'اختر الولاية'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-medium">المجموع الكلي</span>
                  <span className="text-2xl font-display font-semibold text-primary">{grandTotal.toFixed(2)} دج</span>
                </div>
                {!isCheckout && (
                  <Button className="w-full btn-primary-shadow mt-4" onClick={() => setIsCheckout(true)}>
                    متابعة الطلب
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
