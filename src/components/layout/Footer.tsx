import { Link } from 'react-router-dom';
import { Crown, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      {/* Decorative Top Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border-2 border-primary flex items-center justify-center">
                <Crown className="w-7 h-7 text-primary" />
              </div>
              <div>
                <span className="text-xl font-display font-semibold text-secondary-foreground tracking-wider block">
                  المتجر
                </span>
                <span className="text-xs text-primary tracking-[0.3em] uppercase">الملكي</span>
              </div>
            </Link>
            <p className="text-secondary-foreground/60 text-base leading-relaxed font-arabic">
              متجرك الفاخر للتسوق عبر الإنترنت مع توصيل راقي لجميع ولايات الجزائر
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-primary mb-6 tracking-wider text-sm uppercase">روابط سريعة</h4>
            <ul className="space-y-4">
              <FooterLink to="/products" label="تصفح المنتجات" />
              <FooterLink to="/cart" label="سلة التسوق" />
              <FooterLink to="/track-order" label="تتبع طلبك" />
              <FooterLink to="/admin" label="لوحة الإدارة" />
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-primary mb-6 tracking-wider text-sm uppercase">الأقسام</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                  الأكثر طلباً
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                  المنتجات المميزة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-primary mb-6 tracking-wider text-sm uppercase">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-secondary-foreground/60">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr">+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/60">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@royal-store.dz</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/60">
                <MapPin className="w-4 h-4 text-primary" />
                <span>الجزائر - توصيل لجميع الولايات</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-secondary-foreground/40 text-sm font-display tracking-wider">
              © {new Date().getFullYear()} المتجر الملكي — جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-2 text-primary/60">
              <span className="text-xs tracking-widest uppercase">صُنع بإتقان</span>
              <span className="text-primary">◆</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link 
      to={to} 
      className="text-secondary-foreground/60 hover:text-primary transition-colors"
    >
      {label}
    </Link>
  </li>
);

export default Footer;
