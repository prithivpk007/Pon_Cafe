import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, ShieldCheck, Heart, Clock, Award, MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="bg-stone-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-2">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            About PON CAFE (Rukmani Bakery)
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Founded with a passion for artisanal baking, pure ingredients, and warmth. Bringing Chennimalai the freshest celebration cakes, snacks, and morning bakery loaves every day.
          </p>
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                alt="Rukmani Bakery Artisan Baking"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-amber-600 text-white p-5 rounded-2xl shadow-xl max-w-xs">
              <p className="font-serif font-bold text-sm">"Baking is not just a process — it is an act of care and love."</p>
              <p className="text-xs text-amber-200 mt-1 font-semibold">— Rukmani, Founder & Administrator</p>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
              Handcrafted in Chennimalai
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              A Legacy of Freshness, Pure Ingredients & Local Trust
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Located on <strong>Kangeayam Road, Chennimalai</strong>, <strong>PON CAFE (Rukmani Bakery)</strong> has become a household name for families celebrating birthdays, anniversaries, evening tea-times, and special festivals.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Under the leadership of <strong>Administrator Rukmani</strong>, our kitchen adheres to rigorous hygiene practices. We select only the highest grade flours, 100% farm-fresh dairy milk and cream, pure churned butter, and premium dark cocoa. We never compromise with pre-mix powders or artificial preservatives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Zero Chemical Preservatives</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Daily 6:00 AM Fresh Batch Bakes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Eggless & Custom Dietary Options</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Fast & Gentle Local Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Our 4 Pillars of Baking Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Hygienic Preparation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sanitized workstations, stainless steel baking equipment, hair nets, and pristine food handling at all times.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Cake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Custom Cake Craft</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Specialized in multi-tier, photo printed, themed fondant, and delicate cream cakes designed to match your celebration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Punctual Service</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your orders are packed fresh right before pickup or delivery to guarantee maximum crispness and aroma.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Community Focused</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Proudly rooted in Chennimalai, dedicated to delighting every local family with honest pricing and joyful hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-warm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
              Direct Contact
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Get in Touch with Rukmani
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Have a query regarding bulk party catering, custom cake designs, or general bakery inquiries? We are always happy to help.
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-stone-700 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <strong>Address:</strong> Kangeayam Road, Chennimalai, Erode – 638051
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <strong>Phone:</strong> 6374123265 (Administrator: Rukmani)
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <strong>Hours:</strong> Monday – Sunday: 7:00 AM – 10:00 PM
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
            <a
              href="tel:6374123265"
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm transition-all text-center"
            >
              Call 6374123265
            </a>
            <Link
              to="/products"
              className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Explore Bakery Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
