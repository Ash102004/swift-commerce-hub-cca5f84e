import { Link } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DbProduct } from '@/hooks/useProducts';

interface ProductCardProps {
  product: DbProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const mainImage = product.images?.[0] || '';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: mainImage,
      images: product.images,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      created_at: product.created_at,
    };
    
    addToCart(cartProduct);
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block bg-card border border-border hover:border-primary/40 transition-all duration-500 hover-lift"
    >
      {/* Image Container */}
      <div className="aspect-square bg-muted overflow-hidden product-image-container relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-primary text-primary-foreground text-xs px-3 py-1 font-display tracking-wider uppercase">
              مميز
            </span>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 font-display tracking-wider">
              متبقي {product.stock}
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs px-3 py-1 font-display tracking-wider">
              نفذ
            </span>
          )}
        </div>

        {/* Quick Add Button - Appears on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-secondary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            أضف للسلة
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-primary font-display tracking-wider uppercase">
            {product.category}
          </span>
        )}
        
        {/* Name */}
        <h3 className="font-display text-lg font-medium text-foreground mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors tracking-wide">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-display font-semibold text-primary">
            {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">دج</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
