import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cake,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  Award,
  Truck,
  Star,
  Tag,
  Phone,
  MapPin,
  Flame,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Offer, ProductCategory } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, offerRes] = await Promise.all([
          api.products.getAll({ featured: true }),
          api.offers.getActive()
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.products.slice(0, 8));
        if (offerRes.success) setOffers(offerRes.offers);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const categories: Array<{ name: ProductCategory; label: string; count: string; image: string; emoji: string }> = [
    {
      name: 'Cakes',
      label: 'Celebration Cakes',
      count: '7 Varieties',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      emoji: '🎂'
    },
    {
      name: 'Snacks',
      label: 'Hot Puffs & Snacks',
      count: '6 Varieties',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
      emoji: '🥟'
    },
    {
      name: 'Breads',
      label: 'Artisan Breads & Buns',
      count: '4 Varieties',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      emoji: '🍞'
    },
    {
      name: 'Cookies',
      label: 'Crunchy Cookies',
      count: '3 Varieties',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
      emoji: '🍪'
    },
    {
      name: 'Beverages',
      label: 'Fresh Chai & Shakes',
      count: '4 Varieties',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      emoji: '☕'
    }
  ];

  const testimonials = [
    {
      name: 'Anandhu Krishnan',
      location: 'Chennimalai',
      comment: 'The Red Velvet cake we ordered for my sister’s birthday was sensational! Super soft, fresh cream, and delivered right on time.',
      rating: 5,
      date: 'Yesterday'
    },
    {
      name: 'Kavitha Ramasamy',
      location: 'Kangeyam Road',
      comment: 'Their chicken puffs and fresh tea are our family’s daily evening ritual. PON CAFE never compromises on hygiene and taste!',
      rating: 5,
      date: '3 days ago'
    },
    {
      name: 'Dr. Vigneshwaran',
      location: 'Erode',
      comment: 'Ordered a 2-tier customized fondant anniversary cake. Rukmani madam executed the design flawlessly with exact reference colors.',
      rating: 5,
      date: 'Last week'
    }
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code '${code}' copied to clipboard!`, 'Code Copied');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-white pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Background gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-amber-950/40 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 bg-cover bg-center hidden lg:block" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Oven Fresh in Chennimalai, Erode</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Freshly Baked.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Made with Love.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Welcome to <strong>PON CAFE (Rukmani Bakery)</strong>. Handcrafting delectable celebration cakes, golden flaky puffs, daily fresh breads, and crunchy cookies using 100% pure ingredients.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide uppercase shadow-glow hover:scale-105 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-950" />
                  <span>Order Now</span>
                </Link>

                <Link
                  to="/custom-cake"
                  className="px-8 py-4 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/40 font-bold text-sm tracking-wide uppercase backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <Cake className="w-4 h-4 text-amber-400" />
                  <span>Book Custom Cake</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-800/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-left">
                  <span className="block text-2xl font-extrabold text-amber-400 font-serif">24+</span>
                  <span className="text-xs text-stone-400">Bakery Items</span>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-extrabold text-amber-400 font-serif">100%</span>
                  <span className="text-xs text-stone-400">Fresh Daily</span>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-extrabold text-amber-400 font-serif">4.9★</span>
                  <span className="text-xs text-stone-400">Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur-xl opacity-50 animate-pulse" />

                <div className="relative bg-stone-900 rounded-3xl p-4 border border-amber-500/30 shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Chocolate Cake"
                    className="w-full h-80 object-cover rounded-2xl"
                  />

                  {/* Floating floating card on top of image */}
                  <div className="absolute bottom-6 left-6 right-6 bg-stone-950/90 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                        Today's Best Seller
                      </span>
                      <h4 className="font-serif font-bold text-white text-base">
                        Dutch Chocolate Truffle Cake
                      </h4>
                      <p className="text-xs text-stone-300">From ₹550 / 1 kg</p>
                    </div>
                    <button
                      onClick={() => navigate('/products?category=Cakes')}
                      className="p-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition-colors shrink-0 shadow-md"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIAL OFFERS MARQUEE */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-warm border border-amber-400/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center shrink-0">
                  <Flame className="w-8 h-8 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block">
                    Limited Time Bakery Deals
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Special Offers & Celebration Discounts
                  </h3>
                </div>
              </div>

              {/* Offer Badges Grid */}
              <div className="flex flex-wrap gap-3 justify-center">
                {offers.slice(0, 3).map(offer => (
                  <div
                    key={offer.id}
                    className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3 hover:bg-white/20 transition-all cursor-pointer group"
                    onClick={() => handleCopyCoupon(offer.code)}
                  >
                    <div>
                      <p className="text-[11px] text-amber-200 font-bold">{offer.badgeText || offer.title}</p>
                      <p className="text-xs text-white font-mono font-bold">{offer.code}</p>
                    </div>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-1 rounded-md group-hover:scale-105 transition-transform">
                      Copy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">
              Explore Our Kitchen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Bakery Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-3 md:mt-0"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-amber-100 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col"
            >
              <div className="h-36 sm:h-44 overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-2xl drop-shadow-md">
                  {cat.emoji}
                </span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-amber-300">
                  {cat.count}
                </span>
              </div>
              <div className="p-3.5 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. POPULAR & FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">
              Popular Delights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Chef’s Signature Selection
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-3 md:mt-0"
          >
            <span>Explore All 24 Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-stone-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. CUSTOM CAKE BOOKING HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white p-8 sm:p-12 shadow-2xl border border-amber-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Cake className="w-4 h-4" /> Custom Cake Studio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Celebrate Your Special Milestones with a Custom Designed Cake
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Choose your favorite flavor, weight (0.5kg to 5kg+), custom frosting theme, personal inscription message, and upload your reference picture. Rukmani will bake your dream centerpiece!
              </p>
              <div className="pt-2">
                <Link
                  to="/custom-cake"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide uppercase transition-all shadow-glow hover:scale-105"
                >
                  <span>Book Custom Cake Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
                  alt="Custom Anniversary & Birthday Cake"
                  className="rounded-2xl shadow-xl border-2 border-amber-400/30 object-cover w-full h-64 sm:h-72"
                />
                <div className="absolute -bottom-4 -left-4 bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                  ✨ 100% Custom Themes & Flavors
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">
            Our Quality Promise
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Why Chennimalai Loves PON CAFE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Baked Fresh Daily</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every loaf of bread, flaky puff, and sponge cake is baked fresh starting at 6:00 AM every morning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">100% Hygienic Kitchen</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Strict food safety standards, pure dairy cream, natural cocoa, and zero chemical preservatives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Artisan Recipes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Signature recipes perfected by Rukmani, combining classic baking elegance with beloved local flavors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Fast Local Delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Quick doorstep delivery across Chennimalai and convenient store pickup right on Kangeayam Road.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">
              Loved by Our Community
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Customer Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-amber-200/60 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900">{t.name}</h4>
                    <p className="text-[11px] text-stone-500">{t.location}</p>
                  </div>
                  <span className="text-[10px] text-stone-400">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STORE LOCATION & CONTACT CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
                Visit or Call Our Bakery
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">
                PON CAFE (Rukmani Bakery)
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Feel free to visit our bakery directly on Kangeayam Road in Chennimalai, or place your online order for swift pickup and delivery.
              </p>

              <div className="space-y-2.5 pt-2 text-sm">
                <p className="flex items-center gap-2 text-stone-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kangeayam Road, Chennimalai, Erode – 638051</span>
                </p>
                <p className="flex items-center gap-2 text-stone-200">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Contact: 6374123265 (Rukmani)</span>
                </p>
                <p className="flex items-center gap-2 text-stone-200">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Open Daily: 7:00 AM – 10:00 PM</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <a
                href="tel:6374123265"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Bakery: 6374123265</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-stone-700 transition-all flex items-center justify-center gap-2"
              >
                <span>View Contact & Map</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedQuickView && (
        <QuickViewModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
};
