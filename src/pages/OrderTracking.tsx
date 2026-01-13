import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react';
import { Order } from '@/types';

const statusConfig = {
  pending: {
    label: 'قيد الانتظار',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: 'تم التأكيد',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: CheckCircle,
    step: 2,
  },
  shipped: {
    label: 'جاري الشحن',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: 'تم التوصيل',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    icon: CheckCircle,
    step: 4,
  },
};

const OrderTracking = () => {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Search by phone number or order ID
    const results = orders.filter(
      order => 
        order.customerPhone.includes(searchQuery) || 
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              تتبع طلبك
            </h1>
            <p className="text-muted-foreground">
              أدخل رقم هاتفك أو رقم الطلب لمتابعة حالة طلبك
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">رقم الهاتف أو رقم الطلب</Label>
                  <div className="flex gap-3">
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="أدخل رقم الهاتف أو رقم الطلب"
                      className="flex-1"
                      dir="ltr"
                    />
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      بحث
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && (
            <>
              {foundOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-medium text-lg mb-2">لم يتم العثور على طلبات</h3>
                    <p className="text-muted-foreground text-sm">
                      تأكد من إدخال رقم الهاتف أو رقم الطلب الصحيح
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <h2 className="font-medium text-lg">
                    تم العثور على {foundOrders.length} طلب
                  </h2>
                  
                  {foundOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    
                    return (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">رقم الطلب</p>
                              <CardTitle className="text-lg font-mono">#{order.id}</CardTitle>
                            </div>
                            <Badge className={status.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-6 space-y-6">
                          {/* Progress Steps */}
                          <div className="relative">
                            <div className="flex justify-between items-center">
                              {Object.entries(statusConfig).map(([key, config], index) => {
                                const isActive = status.step >= config.step;
                                const Icon = config.icon;
                                
                                return (
                                  <div key={key} className="flex flex-col items-center relative z-10">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        isActive
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted text-muted-foreground'
                                      }`}
                                    >
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs mt-2 text-center hidden sm:block">
                                      {config.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${((status.step - 1) / 3) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">الاسم</p>
                                <p className="font-medium">{order.customerName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                                <p className="font-medium" dir="ltr">{order.customerPhone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:col-span-2">
                              <MapPin className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">العنوان</p>
                                <p className="font-medium">{order.customerAddress}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-3">المنتجات</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {item.product.nameAr || item.product.name} × {item.quantity}
                                  </span>
                                  <span>{(item.product.price * item.quantity).toFixed(2)} دج</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
                              <span>المجموع الكلي</span>
                              <span className="text-primary">{order.total.toFixed(2)} دج</span>
                            </div>
                          </div>

                          {/* Order Date */}
                          <div className="text-sm text-muted-foreground pt-4 border-t">
                            تاريخ الطلب: {formatDate(order.createdAt)}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
