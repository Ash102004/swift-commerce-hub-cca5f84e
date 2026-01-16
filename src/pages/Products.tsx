import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
    return cats as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                           (product.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            جميع المنتجات
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} منتج متوفر
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-10 h-12 rounded-xl bg-card text-base"
              dir="rtl"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="md:hidden h-12 rounded-xl"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            الفلاتر
          </Button>

          {/* Desktop Categories */}
          <div className="hidden md:flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl capitalize ${
                  selectedCategory === cat ? 'btn-fire' : ''
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Categories */}
        {showFilters && (
          <div className="md:hidden flex flex-wrap gap-2 mb-6 fade-in">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowFilters(false);
                }}
                className={`rounded-full capitalize ${
                  selectedCategory === cat ? 'btn-fire' : ''
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </Button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              لا توجد منتجات
            </h3>
            <p className="text-muted-foreground">
              {search ? 'جرب البحث بكلمات مختلفة' : 'لا توجد منتجات في هذا القسم'}
            </p>
            {(search || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
              >
                إعادة تعيين الفلاتر
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
