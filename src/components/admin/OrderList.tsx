import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Clock, Truck, CheckCircle, Download, Loader2, Scroll, User, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { exportOrdersToExcel } from '@/utils/exportToExcel';
import { useOrders, useUpdateOrderStatus, DbOrder } from '@/hooks/useOrders';
import { staggerContainer, staggerItem } from '@/components/motion/MotionComponents';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  confirmed: { label: 'تم التأكيد', icon: Package, color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  shipped: { label: 'جاري الشحن', icon: Truck, color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  delivered: { label: 'تم التوصيل', icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
};

const OrderList = () => {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status });
    } catch (error) {
      // Error handled in hook
    }
  };

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
          <Package className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="font-display text-xl mb-2">لا توجد طلبات بعد</h3>
        <p className="text-sm text-muted-foreground">ستظهر الطلبات هنا عند قيام العملاء بالشراء</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center">
            <Scroll className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-semibold gold-text">الطلبات</h2>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={() => exportOrdersToExcel(orders as any)}
            className="gap-2 rounded-none border-border hover:border-primary hover:bg-primary/10 font-display"
          >
            <Download className="w-4 h-4" />
            تصدير إلى Excel
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {orders.map((order) => {
            const status = statusConfig[order.status as OrderStatus] || statusConfig.pending;
            const StatusIcon = status.icon;
            
            return (
              <motion.div 
                key={order.id} 
                variants={staggerItem}
                layout
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card-royal rounded-none overflow-hidden"
              >
                {/* Header */}
                <div className="bg-secondary p-5 border-b border-primary/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="w-12 h-12 border-2 border-primary flex items-center justify-center"
                        whileHover={{ rotate: 5 }}
                      >
                        <Scroll className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div>
                        <p className="text-xs text-secondary-foreground/60 uppercase tracking-wider mb-1">رقم الطلب</p>
                        <h3 className="font-display text-lg font-medium text-secondary-foreground font-mono">
                          #{order.tracking_code || order.id.slice(-6)}
                        </h3>
                        <p className="text-xs text-secondary-foreground/50 mt-1">
                          {format(new Date(order.created_at), 'PPP p')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${status.color} border px-4 py-2 font-display rounded-none`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {status.label}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-40 rounded-none border-primary/30 bg-secondary text-secondary-foreground">
                          <SelectValue placeholder="تحديث الحالة" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="confirmed">تم التأكيد</SelectItem>
                          <SelectItem value="shipped">جاري الشحن</SelectItem>
                          <SelectItem value="delivered">تم التوصيل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Details */}
                    <div className="space-y-3">
                      <h4 className="font-display font-medium text-sm flex items-center gap-2 pb-2 border-b border-border">
                        <User className="w-4 h-4 text-primary" />
                        تفاصيل العميل
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span dir="ltr">{order.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{order.commune}، {order.wilaya}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-display font-medium text-sm flex items-center gap-2 pb-2 border-b border-border">
                        <Package className="w-4 h-4 text-primary" />
                        عناصر الطلب
                      </h4>
                      <div className="space-y-2 p-3 bg-muted/50 border border-border">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                            <span className="text-muted-foreground">
                              {item.productName || item.product?.name || 'منتج'} × {item.quantity}
                            </span>
                            <span className="font-display">{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()} دج</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-4 border-t border-primary/20">
                    <div className="flex flex-wrap gap-6 text-sm mb-3">
                      <span className="text-muted-foreground">المجموع الفرعي: <strong className="text-foreground">{order.subtotal.toLocaleString()} دج</strong></span>
                      {order.discount > 0 && (
                        <span className="text-primary">الخصم: <strong>-{order.discount.toLocaleString()} دج</strong></span>
                      )}
                      <span className="text-muted-foreground">التوصيل: <strong className="text-foreground">{order.shipping_cost.toLocaleString()} دج</strong></span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="font-display font-medium">المجموع الكلي</span>
                      <span className="text-2xl font-display font-semibold gold-text">{order.total.toLocaleString()} دج</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OrderList;
