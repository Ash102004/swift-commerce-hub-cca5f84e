import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProduct, DbProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert DbProduct to cart-compatible format
  const convertToCartProduct = (dbProduct: DbProduct) => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    description: dbProduct.description,
    image: dbProduct.images?.[0] || '',
    images: dbProduct.images,
    category: dbProduct.category,
    stock: dbProduct.stock,
    featured: dbProduct.featured,
    created_at: dbProduct.created_at,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Package className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-2xl font-semibold mb-4">المنتج غير موجود</h1>
            <p className="text-muted-foreground mb-8">
              المنتج الذي تبحث عنه غير موجود أو تم حذفه.
            </p>
            <Button asChild className="btn-fire">
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للمنتجات
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = () => {
    const cartProduct = convertToCartProduct(product);
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    setQuantity(1);
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10">
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للمنتجات
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-secondary/50 rounded-2xl overflow-hidden card-elevated">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${product.name} - صورة ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-lg"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-lg"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - معاينة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col" dir="rtl">
            {product.category && (
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {product.name}
            </h1>

            <div className="text-4xl font-display font-bold text-primary mb-6">
              {product.price.toLocaleString()} <span className="text-xl">دج</span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2 text-lg">الوصف</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-destructive/10 text-destructive font-medium">
                  غير متوفر
                </span>
              ) : product.stock < 5 ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                  متبقي {product.stock} فقط!
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-medium">
                  متوفر ({product.stock} قطعة)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/30 rounded-xl">
              <span className="font-medium">الكمية:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="btn-fire w-full text-lg py-6"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="w-5 h-5 ml-2" />
              أضف للسلة - {(product.price * quantity).toLocaleString()} دج
            </Button>

            {/* Featured Badge */}
            {product.featured && (
              <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 text-center">
                <span className="text-sm font-medium text-primary">⭐ منتج مميز</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
