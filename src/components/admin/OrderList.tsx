import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Clock, Truck, CheckCircle, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { exportOrdersToExcel } from '@/utils/exportToExcel';
import { useOrders, useUpdateOrderStatus, DbOrder } from '@/hooks/useOrders';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

const statusConfig: Record<OrderStatus, { label: string; icon: any; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, variant: 'secondary' },
  confirmed: { label: 'تم التأكيد', icon: Package, variant: 'default' },
  shipped: { label: 'جاري الشحن', icon: Truck, variant: 'outline' },
  delivered: { label: 'تم التوصيل', icon: CheckCircle, variant: 'default' },
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="font-display text-xl text-muted-foreground">لا توجد طلبات بعد</h3>
        <p className="text-sm text-muted-foreground mt-2">ستظهر الطلبات هنا عند قيام العملاء بالشراء</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => exportOrdersToExcel(orders as any)}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          تصدير إلى Excel
        </Button>
      </div>
      {orders.map(order => {
        const status = statusConfig[order.status as OrderStatus] || statusConfig.pending;
        const StatusIcon = status.icon;
        
        return (
          <div key={order.id} className="bg-card rounded-lg p-4 md:p-6 card-elevated">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-lg font-medium">
                    طلب #{order.tracking_code || order.id.slice(-6)}
                  </h3>
                  <Badge variant={status.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), 'PPP p')}
                </p>
              </div>
              <Select
                value={order.status}
                onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="تحديث الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="confirmed">تم التأكيد</SelectItem>
                  <SelectItem value="shipped">جاري الشحن</SelectItem>
                  <SelectItem value="delivered">تم التوصيل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-sm mb-2">تفاصيل العميل</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.customer_name}</p>
                  <p>{order.customer_phone}</p>
                  <p>{order.commune}، {order.wilaya}</p>
                  <p>{order.address}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">عناصر الطلب</h4>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name || 'منتج'} × {item.quantity}
                      </span>
                      <span className="font-medium">{((item.product?.price || 0) * item.quantity).toFixed(2)} دج</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex flex-wrap gap-4 text-sm mb-2">
                <span className="text-muted-foreground">المجموع الفرعي: {order.subtotal} دج</span>
                {order.discount > 0 && (
                  <span className="text-green-600">الخصم: -{order.discount} دج</span>
                )}
                <span className="text-muted-foreground">التوصيل: {order.shipping_cost} دج</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">المجموع الكلي</span>
                <span className="text-xl font-display font-semibold text-primary">{order.total} دج</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
