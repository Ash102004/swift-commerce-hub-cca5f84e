import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-lg overflow-hidden card-elevated slide-up">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-secondary/50 relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-foreground px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              عرض التفاصيل
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-medium text-card-foreground mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            ${product.price}
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="btn-primary-shadow"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
