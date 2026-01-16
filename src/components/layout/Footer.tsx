import { Link } from 'react-router-dom';
import { Flame, Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-fire flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">متجري</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              متجرك الموثوق للتسوق أونلاين مع توصيل سريع لجميع ولايات الجزائر
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Send className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <FooterLink to="/products" label="تصفح المنتجات" />
              <FooterLink to="/cart" label="سلة التسوق" />
              <FooterLink to="/track-order" label="تتبع طلبك" />
              <FooterLink to="/admin" label="لوحة التحكم" />
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">الأقسام</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-white/60 hover:text-primary transition-colors text-sm">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/60 hover:text-primary transition-colors text-sm">
                  الأكثر مبيعاً
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/60 hover:text-primary transition-colors text-sm">
                  العروض الحصرية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr">+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@mystore.dz</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>الجزائر - توصيل لجميع الولايات</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-white/40 text-sm">
            © {new Date().getFullYear()} متجري. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link 
      to={to} 
      className="text-white/60 hover:text-primary transition-colors text-sm"
    >
      {label}
    </Link>
  </li>
);

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href}
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white/60 hover:text-white transition-all"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

export default Footer;
