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
      <div className="bg-parchment min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="divider-royal mb-6 max-w-xs mx-auto">
              <span className="text-xs tracking-[0.3em] uppercase font-display">تشكيلتنا</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4 tracking-wide">
              جميع المنتجات
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} منتج متوفر
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pr-12 h-14 bg-card border-border text-base font-display"
                dir="rtl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="md:hidden h-14 font-display tracking-wider"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 ml-2" />
              الفلاتر
            </Button>

            {/* Desktop Categories */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-3 font-display text-sm tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border border-border hover:border-primary text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'الكل' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Categories */}
          {showFilters && (
            <div className="md:hidden flex flex-wrap gap-2 mb-8 fade-in justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 font-display text-sm tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border border-border text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'الكل' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-muted aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-border bg-card">
              <Package className="w-20 h-20 mx-auto text-muted-foreground/20 mb-6" />
              <h3 className="text-xl font-display text-muted-foreground mb-3">
                لا توجد منتجات
              </h3>
              <p className="text-muted-foreground mb-6">
                {search ? 'جرب البحث بكلمات مختلفة' : 'لا توجد منتجات في هذا القسم'}
              </p>
              {(search || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                  }}
                  className="font-display tracking-wider"
                >
                  إعادة تعيين الفلاتر
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
