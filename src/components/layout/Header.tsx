import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Flame, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-fire flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              متجري
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="الرئيسية" />
            <NavItem to="/products" label="المنتجات" />
            <NavItem to="/track-order" label="تتبع الطلب" icon={<MapPin className="w-4 h-4" />} />
            <NavItem to="/admin" label="لوحة التحكم" />
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 fade-in">
            <div className="flex flex-col gap-1">
              <MobileNavItem to="/" label="الرئيسية" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/products" label="المنتجات" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/track-order" label="تتبع الطلب" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/admin" label="لوحة التحكم" onClick={() => setIsMenuOpen(false)} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const NavItem = ({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) => (
  <Link
    to={to}
    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
  >
    {icon}
    {label}
  </Link>
);

const MobileNavItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Header;
