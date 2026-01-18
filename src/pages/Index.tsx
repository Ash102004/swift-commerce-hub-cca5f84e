import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Shield, Award, ChevronLeft, Package, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <Layout>
      {/* Hero Section - Medieval Style */}
      <section className="hero-medieval min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-secondary z-10" />
        
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/30 hidden md:block" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/30 hidden md:block" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/30 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/30 hidden md:block" />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center slide-up">
            {/* Royal Crest */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 border-2 border-primary flex items-center justify-center">
                <Crown className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            {/* Decorative Divider */}
            <div className="divider-royal mb-8 max-w-md mx-auto">
              <span className="text-primary text-sm tracking-[0.4em] uppercase font-display">ترحيب ملكي</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-secondary-foreground mb-6 leading-tight tracking-wide">
              اكتشف عالماً من
              <span className="block gold-text mt-3">الفخامة والأناقة</span>
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed font-arabic">
              نقدم لك أرقى المنتجات بجودة لا مثيل لها، مع خدمة توصيل متميزة تليق بك
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-royal text-base px-10 py-7 rounded-none">
                <Link to="/products">
                  استكشف المنتجات
                  <ArrowLeft className="w-5 h-5 mr-3" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-base px-10 py-7 rounded-none border-primary/40 text-secondary-foreground hover:bg-primary/10 hover:border-primary font-display tracking-wider"
              >
                <Link to="/track-order">
                  تتبع طلبك
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Truck className="w-6 h-6" />}
              title="توصيل فاخر"
              description="توصيل سريع وآمن لجميع ولايات الجزائر"
              delay="0s"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="دفع عند الاستلام"
              description="ادفع بكل أريحية عند استلام طلبك"
              delay="0.1s"
            />
            <FeatureCard 
              icon={<Award className="w-6 h-6" />}
              title="جودة مضمونة"
              description="منتجات أصلية بضمان الجودة"
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-parchment">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="divider-royal mb-6 max-w-xs mx-auto">
              <span className="text-xs tracking-[0.3em] uppercase font-display">مختارات</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4 tracking-wide">
              المنتجات المميزة
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              اكتشف مجموعتنا المختارة بعناية من أفضل المنتجات
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* View All Link */}
              <div className="text-center mt-12">
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 font-display text-primary hover:text-primary/80 transition-colors tracking-wider uppercase text-sm"
                >
                  عرض جميع المنتجات
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20 border border-border bg-card">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h3 className="text-xl font-display text-muted-foreground mb-3">لا توجد منتجات حالياً</h3>
              <p className="text-muted-foreground mb-8">أضف منتجات من لوحة الإدارة</p>
              <Button asChild className="btn-royal rounded-none">
                <Link to="/admin">
                  لوحة الإدارة
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="divider-royal mb-8 max-w-xs mx-auto">
              <span className="text-xs tracking-[0.3em] uppercase font-display">دعوة خاصة</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-secondary-foreground mb-6 tracking-wide">
              انضم إلى عملائنا المميزين
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-10 leading-relaxed">
              احصل على أفضل المنتجات بأسعار حصرية مع خدمة عملاء متميزة
            </p>
            <Button asChild size="lg" className="btn-royal text-base px-12 py-7 rounded-none">
              <Link to="/products">
                ابدأ التسوق الآن
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
    className="text-center p-8 border border-border bg-card hover:border-primary/30 transition-all fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="w-16 h-16 mx-auto mb-6 border border-primary flex items-center justify-center text-primary">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-3 tracking-wide">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
