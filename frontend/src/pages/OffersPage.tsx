import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, Copy, Check, Gift, ArrowRight, Percent, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { Offer } from '../types';
import { useToast } from '../context/ToastContext';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await api.offers.getActive();
        if (res.success) {
          setOffers(res.offers);
        }
      } catch (err) {
        console.error('Failed to load offers:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code '${code}' copied! Apply at checkout for instant savings.`, 'Coupon Copied');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const comboDeals = [
    {
      title: 'Evening Snack Combo',
      items: '2x Egg Puffs + 2x Filter Coffee',
      originalPrice: 120,
      comboPrice: 100,
      badge: 'Save ₹20',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Family Tea-Time Box',
      items: '1x Milk Bread + 1x Butter Cookies (250g) + 2x Tea',
      originalPrice: 200,
      comboPrice: 165,
      badge: 'Save ₹35',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Birthday Celebration Pack',
      items: '1kg Dutch Chocolate Cake + 4x Chicken Puffs',
      originalPrice: 710,
      comboPrice: 620,
      badge: 'Save ₹90',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-warm text-center max-w-4xl mx-auto space-y-3 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300">
          <Gift className="w-7 h-7" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
          Special Discounts & Offers
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Exclusive Bakery Offers & Combos
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Enjoy mouth-watering discounts on freshly baked celebration cakes, morning bread loaves, crispy hot puffs, and tea-time combos!
        </p>
      </div>

      {/* Active Coupon Codes Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Active Promo Codes
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-52 bg-stone-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map(offer => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-soft hover:shadow-warm transition-all p-6 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Top Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-xs">
                    {offer.badgeText || `${offer.discountValue}% OFF`}
                  </span>
                  <Percent className="w-5 h-5 text-amber-300" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {offer.description}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Min. Order: <strong>₹{offer.minOrderValue}</strong>
                    {offer.categoryLimit && <span> (Valid on {offer.categoryLimit})</span>}
                  </p>
                </div>

                {/* Coupon Copy Box */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="bg-stone-100 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-stone-800 border border-stone-200">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl border border-amber-300 transition-all flex items-center gap-1"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Special Combo Deals */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Value Bakery Combos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comboDeals.map((combo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-amber-100 shadow-soft overflow-hidden flex flex-col justify-between"
            >
              <div className="h-48 relative overflow-hidden bg-stone-100">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {combo.badge}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {combo.items}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 line-through mr-1.5">
                      ₹{combo.originalPrice}
                    </span>
                    <span className="text-xl font-extrabold text-stone-900">
                      ₹{combo.comboPrice}
                    </span>
                  </div>
                  <Link
                    to="/products"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded-xl shadow-warm transition-all flex items-center gap-1"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
