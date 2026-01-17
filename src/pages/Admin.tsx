import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/admin/ProductList';
import OrderList from '@/components/admin/OrderList';
import SalesStats from '@/components/admin/SalesStats';
import CouponManager from '@/components/admin/CouponManager';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { Package, ShoppingCart, ArrowLeft, TrendingUp, Box, DollarSign, BarChart3, Ticket, Loader2 } from 'lucide-react';

const Admin = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const isLoading = productsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <h1 className="font-display text-xl font-semibold gradient-text">لوحة التحكم</h1>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">عرض المتجر</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-5 card-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Box className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                <p className="text-2xl font-display font-semibold">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : products.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-5 card-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-display font-semibold">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : orders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-5 card-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الطلبات المعلقة</p>
                <p className="text-2xl font-display font-semibold">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : pendingOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-5 card-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-display font-semibold">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${totalRevenue.toFixed(2)} دج`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              الطلبات
              {pendingOrders > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {pendingOrders}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Ticket className="w-4 h-4" />
              الكوبونات
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <SalesStats />
          </TabsContent>
          <TabsContent value="products">
            <ProductList />
          </TabsContent>
          <TabsContent value="orders">
            <OrderList />
          </TabsContent>
          <TabsContent value="coupons">
            <CouponManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
