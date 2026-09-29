import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Phone, MapPin, Clock, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Bakery Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-glow">
                <Cake className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-white tracking-tight leading-none">
                  PON CAFE
                </span>
                <span className="block text-xs uppercase tracking-widest font-semibold text-amber-400 mt-1">
                  Rukmani Bakery
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Freshly Baked. Made with Love. Serving the finest artisan celebration cakes, crispy hot puffs, fresh morning breads, and wholesome treats in Chennimalai.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Managed by Administrator <strong>Rukmani</strong></span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/custom-cake" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Custom Cake Booking
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Special Offers & Combos
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Order Status Tracking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Customer & Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-4 tracking-wide">
              Bakery Menu
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Cakes" className="text-stone-400 hover:text-amber-400 transition-colors">
                  🎂 Celebration Cakes & Pastries
                </Link>
              </li>
              <li>
                <Link to="/products?category=Snacks" className="text-stone-400 hover:text-amber-400 transition-colors">
                  🥟 Hot Puffs, Samosas & Sandwiches
                </Link>
              </li>
              <li>
                <Link to="/products?category=Breads" className="text-stone-400 hover:text-amber-400 transition-colors">
                  🍞 Fresh Breads & Cream Buns
                </Link>
              </li>
              <li>
                <Link to="/products?category=Cookies" className="text-stone-400 hover:text-amber-400 transition-colors">
                  🍪 Butter & Coconut Cookies
                </Link>
              </li>
              <li>
                <Link to="/products?category=Beverages" className="text-stone-400 hover:text-amber-400 transition-colors">
                  ☕ Tea, Filter Coffee & Shakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Contact Info */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-4 tracking-wide">
              Store & Contact Info
            </h4>
            <div className="space-y-3.5 text-sm text-stone-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Rukmani Bakery (PON CAFE)</strong><br />
                  Kangeayam Road, Chennimalai,<br />
                  Erode – 638051, Tamil Nadu
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs text-stone-500 font-medium">Direct Order Hotline</p>
                  <a
                    href="tel:6374123265"
                    className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-base"
                  >
                    6374123265
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-stone-500 font-medium">Baking & Service Hours</p>
                  <p className="text-stone-300">Monday – Sunday: 7:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with exact required copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 Rukmani Bakery. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Freshly handcrafted in Chennimalai with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Rukmani</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
