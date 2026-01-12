import { Order } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig: Record<Order['status'], { label: string; icon: any; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' },
  confirmed: { label: 'Confirmed', icon: Package, variant: 'default' },
  shipped: { label: 'Shipped', icon: Truck, variant: 'outline' },
  delivered: { label: 'Delivered', icon: CheckCircle, variant: 'default' },
};

const OrderList = () => {
  const { orders, updateOrderStatus } = useStore();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="font-display text-xl text-muted-foreground">No orders yet</h3>
        <p className="text-sm text-muted-foreground mt-2">Orders will appear here when customers make purchases</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const status = statusConfig[order.status];
        const StatusIcon = status.icon;
        
        return (
          <div key={order.id} className="bg-card rounded-lg p-4 md:p-6 card-elevated">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-lg font-medium">Order #{order.id.slice(-6)}</h3>
                  <Badge variant={status.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), 'PPP p')}
                </p>
              </div>
              <Select
                value={order.status}
                onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Customer Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.customerName}</p>
                  <p>{order.customerPhone}</p>
                  <p>{order.customerAddress}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-display font-semibold text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
