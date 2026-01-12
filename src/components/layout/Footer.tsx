const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">Elegance</h3>
            <p className="text-sm text-muted-foreground">
              Premium quality products for the discerning customer.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/products" className="hover:text-foreground transition-colors">Shop</a></li>
              <li><a href="/cart" className="hover:text-foreground transition-colors">Cart</a></li>
              <li><a href="/admin" className="hover:text-foreground transition-colors">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@elegance.store</li>
              <li>+1 234 567 890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2024 Elegance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
