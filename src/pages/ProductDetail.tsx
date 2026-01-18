import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProduct, DbProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, ArrowRight, Minus, Plus, ChevronLeft, ChevronRight, Loader2, Crown } from 'lucide-react';
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
        <div className="container mx-auto px-4 py-20">
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
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Package className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-2xl font-semibold mb-4">المنتج غير موجود</h1>
            <p className="text-muted-foreground mb-8">
              المنتج الذي تبحث عنه غير موجود أو تم حذفه.
            </p>
            <Button asChild className="btn-royal rounded-none">
              <Link to="/products">
                <ArrowRight className="w-4 h-4 mr-2" />
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
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 font-display tracking-wider">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">الرئيسية</Link>
          <span className="text-muted-foreground/50">/</span>
          <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">المنتجات</Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted overflow-hidden border border-border">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${product.name} - صورة ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  {hasMultipleImages && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-secondary/80 hover:bg-secondary text-secondary-foreground flex items-center justify-center transition-colors"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-secondary/80 hover:bg-secondary text-secondary-foreground flex items-center justify-center transition-colors"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-secondary/80 px-4 py-2 text-secondary-foreground text-sm font-display tracking-wider">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground/20" />
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
                    className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-border opacity-60 hover:opacity-100'
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
            {/* Category */}
            {product.category && (
              <span className="text-sm text-primary font-display tracking-wider uppercase mb-4">
                {product.category}
              </span>
            )}

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-6 tracking-wide text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-display font-semibold text-primary">
                {product.price.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">دينار جزائري</span>
            </div>

            {/* Decorative Divider */}
            <div className="h-px bg-gradient-to-r from-primary via-primary/50 to-transparent mb-8" />

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="font-display text-sm tracking-wider uppercase text-muted-foreground mb-3">الوصف</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-4 py-2 border border-destructive text-destructive font-display text-sm tracking-wider">
                  غير متوفر حالياً
                </span>
              ) : product.stock < 5 ? (
                <span className="inline-flex items-center px-4 py-2 border border-primary text-primary font-display text-sm tracking-wider">
                  متبقي {product.stock} فقط
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 border border-accent text-accent font-display text-sm tracking-wider">
                  متوفر — {product.stock} قطعة
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-8 p-6 border border-border bg-muted/30">
              <span className="font-display text-sm tracking-wider uppercase text-muted-foreground">الكمية</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-display text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="btn-royal w-full py-7 rounded-none text-base"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="w-5 h-5 ml-3" />
              أضف للسلة — {(product.price * quantity).toLocaleString()} دج
            </Button>

            {/* Featured Badge */}
            {product.featured && (
              <div className="mt-6 p-4 border border-primary/30 bg-primary/5 flex items-center justify-center gap-3">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-sm font-display tracking-wider text-primary">منتج مميز</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
