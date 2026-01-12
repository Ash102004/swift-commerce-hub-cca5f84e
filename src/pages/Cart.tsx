import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, Package, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { addOrder } = useStore();
  const [isCheckout, setIsCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all fields');
      return;
    }

    addOrder({
      items: items,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      total: total,
      status: 'pending',
    });

    clearCart();
    setIsCheckout(false);
    setCustomerInfo({ name: '', phone: '', address: '' });
    toast.success('Order placed successfully! We will contact you soon.');
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
                <h2 className="font-display text-xl font-medium">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your full address"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCheckout(false)}>
                    Back to Cart
                  </Button>
                  <Button type="submit" className="flex-1">
                    Place Order
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
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-display font-semibold text-primary">${total.toFixed(2)}</span>
                </div>
                {!isCheckout && (
                  <Button className="w-full btn-primary-shadow" onClick={() => setIsCheckout(true)}>
                    Proceed to Checkout
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
