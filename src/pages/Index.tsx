import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/contexts/StoreContext';

const Index = () => {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center slide-up">
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6 leading-tight">
              Discover <span className="text-primary">Timeless</span> Elegance
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Curated collection of premium products crafted with exceptional quality and sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary-shadow">
                <Link to="/products">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admin">Admin Panel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Handcrafted with finest materials</p>
              </div>
            </div>
            <div className="flex items-center gap-4 fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Free shipping on orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground">No products available. Add products from the admin panel.</p>
              <Button asChild className="mt-4">
                <Link to="/admin">Go to Admin</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
