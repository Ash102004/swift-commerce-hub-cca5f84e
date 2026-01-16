import { Link } from 'react-router-dom';
import { DbProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Eye, Flame } from 'lucide-react';

interface ProductCardProps {
  product: DbProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const mainImage = product.images?.[0] || '';
  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert DbProduct to legacy Product format for cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: mainImage,
      category: product.category || '',
      stock: product.stock,
      createdAt: product.created_at,
    });
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden card-elevated">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="aspect-square bg-muted relative overflow-hidden product-image-container">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isLowStock && (
              <span className="badge-fire flex items-center gap-1">
                <Flame className="w-3 h-3" />
                آخر القطع
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                نفذت الكمية
              </span>
            )}
            {product.featured && !isLowStock && !isOutOfStock && (
              <span className="badge-fire">مميز</span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
              <Eye className="w-4 h-4" />
              عرض التفاصيل
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-primary">
            {product.price.toLocaleString()} دج
          </span>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn-fire rounded-xl"
          >
            <ShoppingBag className="w-4 h-4 ml-1" />
            <span className="hidden sm:inline">أضف</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
