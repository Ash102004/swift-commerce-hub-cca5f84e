import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, User, Crown, Shield, Scroll } from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

const statusConfig: Record<OrderStatus, {
  label: string;
  color: string;
  icon: typeof Clock;
  step: number;
}> = {
  pending: {
    label: 'قيد الانتظار',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: 'تم التأكيد',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    icon: CheckCircle,
    step: 2,
  },
  shipped: {
    label: 'جاري الشحن',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: 'تم التوصيل',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    icon: CheckCircle,
    step: 4,
  },
};

const OrderTracking = () => {
  const { data: orders = [] } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<typeof orders>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Search by phone number or order ID
    const results = orders.filter(
      order => 
        order.customer_phone.includes(searchQuery) || 
        order.id.includes(searchQuery)
    );
    
    setFoundOrders(results);
    setHasSearched(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-medieval py-16 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scroll className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold gold-text mb-4">
            تتبع طلبك الملكي
          </h1>
          <p className="text-secondary-foreground/60 text-body text-lg max-w-xl mx-auto">
            أدخل رقم هاتفك أو رقم الطلب لمتابعة حالة طلبك الملكي
          </p>
        </div>
      </div>

      <div className="bg-parchment py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Search Form */}
            <div className="card-royal rounded-none p-8 mb-10">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                  <Search className="w-5 h-5 text-primary" />
                  <Label htmlFor="search" className="font-display text-lg">البحث عن الطلب</Label>
                </div>
                <div className="flex gap-4">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="أدخل رقم الهاتف أو رقم الطلب"
                    className="flex-1 rounded-none border-border focus:border-primary h-12 text-lg"
                    dir="ltr"
                  />
                  <Button type="submit" className="btn-royal rounded-none px-8 h-12">
                    <Search className="w-4 h-4 mr-2" />
                    بحث
                  </Button>
                </div>
              </form>
            </div>

            {/* Results */}
            {hasSearched && (
              <>
                {foundOrders.length === 0 ? (
                  <div className="card-royal rounded-none py-16 text-center fade-in">
                    <div className="w-24 h-24 mx-auto mb-6 border-2 border-primary/30 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl mb-3">لم يتم العثور على طلبات</h3>
                    <p className="text-muted-foreground text-body">
                      تأكد من إدخال رقم الهاتف أو رقم الطلب الصحيح
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="divider-royal">
                      <span className="font-display">تم العثور على {foundOrders.length} طلب</span>
                    </div>
                    
                    {foundOrders.map((order, index) => {
                      const orderStatus = (order.status || 'pending') as OrderStatus;
                      const status = statusConfig[orderStatus] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      const items = Array.isArray(order.items) ? order.items : [];
                      
                      return (
                        <div 
                          key={order.id} 
                          className="card-royal rounded-none overflow-hidden fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Order Header */}
                          <div className="bg-secondary p-6 border-b border-primary/20">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center">
                                  <Crown className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-secondary-foreground/60 uppercase tracking-wider">رقم الطلب</p>
                                  <p className="font-display text-lg font-medium text-secondary-foreground font-mono">#{order.id.slice(0, 8)}</p>
                                </div>
                              </div>
                              <Badge className={`${status.color} border px-4 py-2 font-display rounded-none`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-8 space-y-8">
                            {/* Progress Steps */}
                            <div className="relative py-4">
                              <div className="flex justify-between items-center relative z-10">
                                {Object.entries(statusConfig).map(([key, config]) => {
                                  const isActive = status.step >= config.step;
                                  const Icon = config.icon;
                                  
                                  return (
                                    <div key={key} className="flex flex-col items-center">
                                      <div
                                        className={`w-14 h-14 flex items-center justify-center transition-all border-2 ${
                                          isActive
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'bg-muted border-border text-muted-foreground'
                                        }`}
                                      >
                                        <Icon className="w-6 h-6" />
                                      </div>
                                      <span className={`text-xs mt-3 text-center font-display hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {config.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Progress Line */}
                              <div className="absolute top-9 left-7 right-7 h-0.5 bg-border -z-0">
                                <div
                                  className="h-full bg-primary transition-all duration-700"
                                  style={{ width: `${((status.step - 1) / 3) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                              <div className="flex items-start gap-4 p-4 bg-muted/50 border border-border">
                                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                                  <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">الاسم</p>
                                  <p className="font-display font-medium">{order.customer_name}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4 p-4 bg-muted/50 border border-border">
                                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                                  <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">رقم الهاتف</p>
                                  <p className="font-display font-medium" dir="ltr">{order.customer_phone}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4 p-4 bg-muted/50 border border-border md:col-span-2">
                                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                                  <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">العنوان</p>
                                  <p className="font-display font-medium">{order.address}, {order.commune}, {order.wilaya}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="pt-6 border-t border-border">
                              <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-primary" />
                                <h4 className="font-display font-medium">المنتجات</h4>
                              </div>
                              <div className="space-y-3 bg-muted/30 p-4 border border-border">
                                {items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                                    <span className="text-muted-foreground text-body">
                                      {item.productName || item.name} × {item.quantity}
                                    </span>
                                    <span className="font-display">{((item.price || 0) * (item.quantity || 1)).toLocaleString()} دج</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-6 pt-4 border-t border-primary/30">
                                <span className="font-display font-medium">المجموع الكلي</span>
                                <span className="text-2xl font-display font-semibold gold-text">{order.total.toLocaleString()} دج</span>
                              </div>
                            </div>

                            {/* Order Date */}
                            <div className="text-sm text-muted-foreground pt-4 border-t border-border flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              تاريخ الطلب: {formatDate(order.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
