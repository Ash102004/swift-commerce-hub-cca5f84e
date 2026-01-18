import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Crown, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-sm border-2 border-primary flex items-center justify-center bg-secondary group-hover:bg-primary/10 transition-colors">
              <Crown className="w-7 h-7 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-display font-semibold text-secondary-foreground tracking-wider">
                المتجر
              </span>
              <span className="block text-xs text-primary tracking-[0.3em] uppercase">الملكي</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItem to="/" label="الرئيسية" />
            <NavItem to="/products" label="المنتجات" />
            <NavItem to="/track-order" label="تتبع الطلب" />
            <NavItem to="/admin" label="الإدارة" />
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative p-3 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center font-display font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-secondary-foreground hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-primary/20 fade-in">
            <div className="flex flex-col gap-2">
              <MobileNavItem to="/" label="الرئيسية" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/products" label="المنتجات" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/track-order" label="تتبع الطلب" onClick={() => setIsMenuOpen(false)} />
              <MobileNavItem to="/admin" label="الإدارة" onClick={() => setIsMenuOpen(false)} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="relative font-display text-sm tracking-wider text-secondary-foreground/80 hover:text-primary transition-colors py-2 group"
  >
    {label}
    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
  </Link>
);

const MobileNavItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-4 font-display text-secondary-foreground/80 hover:text-primary hover:bg-primary/5 transition-all tracking-wider border-b border-primary/10 last:border-0"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Header;
