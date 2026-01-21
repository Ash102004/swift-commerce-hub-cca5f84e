import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/admin/ProductList';
import OrderList from '@/components/admin/OrderList';
import SalesStats from '@/components/admin/SalesStats';
import CouponManager from '@/components/admin/CouponManager';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { Package, ShoppingCart, ArrowLeft, TrendingUp, Box, DollarSign, BarChart3, Ticket, Loader2, Crown, Shield } from 'lucide-react';
import { MotionStat, staggerContainer, staggerItem } from '@/components/motion/MotionComponents';
import { ThemeToggle } from '@/components/ThemeToggle';

const Admin = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const isLoading = productsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <header className="bg-secondary/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon" className="border border-primary/30 hover:border-primary hover:bg-primary/10">
                <Link to="/">
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold text-secondary-foreground">لوحة التحكم</h1>
                  <span className="text-xs text-primary tracking-wider">الإدارة الملكية</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" className="border-primary/30 hover:border-primary hover:bg-primary/10 font-display rounded-none">
                <Link to="/products">عرض المتجر</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MotionStat
              icon={<Box className="w-7 h-7 text-primary" />}
              label="إجمالي المنتجات"
              value={isLoading ? '...' : products.length}
              delay={0}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MotionStat
              icon={<ShoppingCart className="w-7 h-7 text-primary" />}
              label="إجمالي الطلبات"
              value={isLoading ? '...' : orders.length}
              delay={0.1}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MotionStat
              icon={<TrendingUp className="w-7 h-7 text-primary" />}
              label="الطلبات المعلقة"
              value={isLoading ? '...' : pendingOrders}
              delay={0.2}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MotionStat
              icon={<DollarSign className="w-7 h-7 text-primary" />}
              label="إجمالي الإيرادات"
              value={isLoading ? '...' : totalRevenue.toLocaleString()}
              suffix=" دج"
              delay={0.3}
            />
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Tabs defaultValue="stats" className="space-y-8">
            <div className="card-royal rounded-none p-2">
              <TabsList className="w-full justify-start flex-wrap bg-transparent gap-2">
                <TabsTrigger 
                  value="stats" 
                  className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none px-6"
                >
                  <BarChart3 className="w-4 h-4" />
                  الإحصائيات
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none px-6"
                >
                  <Package className="w-4 h-4" />
                  المنتجات
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none px-6"
                >
                  <ShoppingCart className="w-4 h-4" />
                  الطلبات
                  {pendingOrders > 0 && (
                    <span className="ml-1 bg-destructive text-destructive-foreground text-xs px-2 py-0.5">
                      {pendingOrders}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="coupons" 
                  className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none px-6"
                >
                  <Ticket className="w-4 h-4" />
                  الكوبونات
                </TabsTrigger>
              </TabsList>
            </div>
            
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
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
