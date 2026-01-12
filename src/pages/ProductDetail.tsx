import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Package className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-2xl font-semibold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-secondary/50 rounded-xl overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
              {product.name}
            </h1>

            {product.nameAr && (
              <p className="text-lg text-muted-foreground mb-4 font-arabic" dir="rtl">
                {product.nameAr}
              </p>
            )}

            <div className="text-3xl font-display font-semibold text-primary mb-6">
              ${product.price}
            </div>

            <div className="mb-6">
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.descriptionAr && (
                <p className="text-muted-foreground leading-relaxed mt-3 font-arabic" dir="rtl">
                  {product.descriptionAr}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                  Out of Stock
                </span>
              ) : product.stock < 5 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="btn-primary-shadow w-full md:w-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
