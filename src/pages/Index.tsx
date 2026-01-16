import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Zap, Star, ChevronRight, Flame, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm mb-6">
              <Flame className="w-4 h-4 text-primary" />
              عروض حصرية - خصم يصل إلى 50%
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              تسوق بأسعار
              <span className="gradient-fire-text block mt-2">لا تُقاوم</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl mx-auto">
              اكتشف أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع ولايات الجزائر
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-fire text-lg px-8 py-6 rounded-xl">
                <Link to="/products">
                  تسوق الآن
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                <Link to="/track-order">
                  تتبع طلبك
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Truck className="w-6 h-6" />}
              title="توصيل سريع"
              description="توصيل لجميع الولايات خلال 24-72 ساعة"
              delay="0s"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="دفع عند الاستلام"
              description="ادفع نقداً عند استلام طلبك"
              delay="0.1s"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="منتجات أصلية"
              description="ضمان جودة المنتجات 100%"
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                منتجات مميزة
              </h2>
              <p className="text-muted-foreground mt-1">اكتشف أحدث المنتجات وأكثرها طلباً</p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:flex items-center gap-1 text-primary hover:gap-2 transition-all font-medium"
            >
              عرض الكل
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">لا توجد منتجات حالياً</h3>
              <p className="text-muted-foreground mb-6">أضف منتجات من لوحة التحكم</p>
              <Button asChild>
                <Link to="/admin">
                  لوحة التحكم
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile View All Button */}
          {featuredProducts.length > 0 && (
            <div className="md:hidden mt-8 text-center">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/products">
                  عرض جميع المنتجات
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز للتسوق؟
            </h2>
            <p className="text-white/70 text-lg mb-8">
              انضم إلى آلاف العملاء السعداء واحصل على أفضل الصفقات
            </p>
            <Button asChild size="lg" className="btn-fire text-lg px-10 py-6 rounded-xl">
              <Link to="/products">
                ابدأ التسوق الآن
                <Flame className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: string;
}) => (
  <div 
    className="flex items-center gap-4 p-5 rounded-2xl bg-card card-elevated fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="w-14 h-14 rounded-xl gradient-fire flex items-center justify-center shrink-0 text-white">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
