import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders, DbOrder } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, Package, Users, Calendar, Download, Loader2, BarChart3, Crown } from 'lucide-react';
import { exportStatsToExcel } from '@/utils/exportToExcel';
import { staggerContainer, staggerItem } from '@/components/motion/MotionComponents';

const statusColors = {
  pending: '#d97706',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
};

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'تم التأكيد',
  shipped: 'جاري الشحن',
  delivered: 'تم التوصيل',
};

const SalesStats = () => {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const isLoading = ordersLoading || productsLoading;

  // Calculate order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusLabels[status as keyof typeof statusLabels] || status,
      value: count,
      color: statusColors[status as keyof typeof statusColors] || '#gray',
    }));
  }, [orders]);

  // Calculate top selling products
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    orders.forEach((order) => {
      (order.items as any[]).forEach((item) => {
        const id = item.product?.id || item.productId;
        if (!productSales[id]) {
          productSales[id] = {
            name: item.productName || item.product?.name || 'منتج',
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[id].quantity += item.quantity;
        productSales[id].revenue += (item.price || item.product?.price || 0) * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // Calculate sales by day (last 7 days)
  const salesByDay = useMemo(() => {
    const today = new Date();
    const days: { date: string; sales: number; orders: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      days.push({
        date: date.toLocaleDateString('ar-DZ', { weekday: 'short', day: 'numeric' }),
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    return days;
  }, [orders]);

  // Calculate additional stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const uniqueCustomers = new Set(orders.map((o) => o.customer_phone)).size;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const deliveryRate = orders.length > 0 ? (deliveredOrders / orders.length) * 100 : 0;

    return {
      totalRevenue,
      avgOrderValue,
      uniqueCustomers,
      deliveryRate,
    };
  }, [orders]);

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

  if (orders.length === 0) {
    return (
      <motion.div 
        className="card-royal rounded-none py-16 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 mx-auto border-2 border-primary/30 flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="font-display text-xl mb-2">لا توجد بيانات بعد</h3>
        <p className="text-sm text-muted-foreground">ستظهر الإحصائيات هنا بعد استلام الطلبات</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-semibold gold-text">الإحصائيات</h2>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={() => exportStatsToExcel(orders as any, topProducts, salesByDay)}
            className="gap-2 rounded-none border-border hover:border-primary hover:bg-primary/10 font-display"
          >
            <Download className="w-4 h-4" />
            تصدير إلى Excel
          </Button>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="card-royal rounded-none p-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/5"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط قيمة الطلب</p>
                <p className="text-xl font-display font-semibold">{stats.avgOrderValue.toLocaleString()} دج</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="card-royal rounded-none p-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 border-2 border-blue-500 flex items-center justify-center bg-blue-500/5"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Users className="w-7 h-7 text-blue-600" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">عدد العملاء</p>
                <p className="text-xl font-display font-semibold">{stats.uniqueCustomers}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="card-royal rounded-none p-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 border-2 border-purple-500 flex items-center justify-center bg-purple-500/5"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Package className="w-7 h-7 text-purple-600" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">نسبة التوصيل</p>
                <p className="text-xl font-display font-semibold">{stats.deliveryRate.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="card-royal rounded-none p-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 border-2 border-amber-500 flex items-center justify-center bg-amber-500/5"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Calendar className="w-7 h-7 text-amber-600" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">طلبات اليوم</p>
                <p className="text-xl font-display font-semibold">
                  {salesByDay[salesByDay.length - 1]?.orders || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Sales Trend */}
        <div className="card-royal rounded-none overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              المبيعات خلال الأسبوع
            </h3>
          </div>
          <div className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--primary) / 0.3)',
                      borderRadius: '0',
                      fontFamily: 'Cormorant Garamond',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} دج`, 'المبيعات']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card-royal rounded-none overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg font-medium flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              توزيع حالات الطلبات
            </h3>
          </div>
          <div className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--primary) / 0.3)',
                      borderRadius: '0',
                      fontFamily: 'Cormorant Garamond',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card-royal rounded-none overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="font-display text-lg font-medium flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            المنتجات الأكثر مبيعاً
          </h3>
        </div>
        <div className="p-6">
          {topProducts.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--primary) / 0.3)',
                      borderRadius: '0',
                      fontFamily: 'Cormorant Garamond',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'quantity' ? `${value} قطعة` : `${value.toLocaleString()} دج`,
                      name === 'quantity' ? 'الكمية' : 'الإيرادات',
                    ]}
                  />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">لا توجد مبيعات بعد</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SalesStats;
