import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Cake,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  User as UserIcon,
  Mail,
  Palette,
  FileText,
  HelpCircle,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CustomCakePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cakeType, setCakeType] = useState('Fresh Cream Celebration Cake');
  const [size, setSize] = useState('1 kg (6-8 Servings)');
  const [flavor, setFlavor] = useState('Chocolate Truffle');
  const [theme, setTheme] = useState('Birthday Celebration');
  const [color, setColor] = useState('Golden Amber & Ivory');
  const [cakeMessage, setCakeMessage] = useState('Happy Birthday!');
  const [requiredDate, setRequiredDate] = useState(todayStr);
  const [requiredTime, setRequiredTime] = useState('06:00 PM');
  const [requirements, setRequirements] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post submit state
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const cakeTypes = [
    'Fresh Cream Celebration Cake',
    'Rich Chocolate Truffle Cake',
    'Custom Themed Fondant Cake',
    '2-Tier / Multi-Tier Wedding Cake',
    'Edible Photo Print Cake',
    'Pinata Surprise Hammer Cake',
    'Gourmet Cupcake Tower Set'
  ];

  const sizeOptions = [
    '0.5 kg (3-4 Servings) ~ ₹350 - ₹450',
    '1 kg (6-8 Servings) ~ ₹600 - ₹800',
    '1.5 kg (10-12 Servings) ~ ₹950 - ₹1200',
    '2 kg (14-16 Servings) ~ ₹1300 - ₹1600',
    '3 kg (20-25 Servings) ~ ₹2000 - ₹2500',
    '5 kg+ (Grand Celebration) ~ Custom Quote'
  ];

  const flavors = [
    'Chocolate Truffle & Dark Ganache',
    'Classic Red Velvet Cream Cheese',
    'German Black Forest with Cherries',
    'White Forest & Shaved White Choco',
    'Crunchy Butterscotch Praline',
    'Madagascar Pure Vanilla',
    'Royal Rasmalai & Pistachio',
    'Alphonso Mango & White Ganache',
    'Pineapple Delight with Glazed Cherries'
  ];

  const themes = [
    'Birthday Celebration & Confetti',
    'Anniversary & Romantic Roses',
    'Kids Cartoon / Superhero Theme',
    'Floral Elegance & Gold Foil',
    'Minimalist Modern Pastel',
    'Traditional South Indian Festive',
    'Corporate / Farewell Celebration'
  ];

  const colorPalettes = [
    'Golden Amber & Ivory',
    'Classic Pastel Pink & Gold',
    'Royal Midnight Blue & Silver',
    'Ruby Red & Cream Cheese White',
    'Emerald Green & Gold Accents',
    'Lavender & Soft Lilac',
    'Dark Chocolate & Caramel Swirl'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.upload(file);
      if (res.success && res.imageUrl) {
        setReferenceImageUrl(res.imageUrl);
        toast.success('Reference design photo uploaded successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed. Using reference note instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      toast.error('Please provide your name and contact phone number.');
      return;
    }

    if (phone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.customCakes.submit({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        cakeType,
        size,
        flavor,
        theme,
        color,
        cakeMessage: cakeMessage.trim(),
        referenceImage: referenceImageUrl || undefined,
        requiredDate,
        requiredTime,
        requirements: requirements.trim()
      });

      if (res.success && res.requestId) {
        try {
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch {}

        setSubmittedRequestId(res.requestId);
        toast.success('Your custom cake request has been submitted successfully.');
      } else {
        toast.error(res.message || 'Failed to submit request.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submitted successfully, show confirmation screen
  if (submittedRequestId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-700">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600">
            Booking Received
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Your custom cake request has been submitted successfully.
          </h1>
          <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
            Administrator <strong>Rukmani</strong> will review your custom design, theme, and date requirements and confirm your booking quote shortly.
          </p>
        </div>

        {/* Request ID Card */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 max-w-md mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-900 block">Your Cake Request ID:</span>
          <span className="font-mono text-3xl font-extrabold text-amber-700 block">
            {submittedRequestId}
          </span>
          <p className="text-xs text-stone-600">
            Please keep this ID for your reference or tracking on our website.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => setSubmittedRequestId(null)}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase rounded-xl transition-all"
          >
            Submit Another Request
          </button>
          <Link
            to="/products"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded-xl shadow-warm transition-all"
          >
            Browse Bakery Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Cake className="w-4 h-4" /> PON CAFE Custom Cake Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            Design Your Custom Celebration Cake
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed font-light">
            Every celebration deserves a showstopper centerpiece. Choose your weight, premium flavor, artistic theme, and personal cake message. Handcrafted with love by <strong>Rukmani</strong>.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Cake Specifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              <span>Cake Type, Size & Flavor</span>
            </h2>

            {/* Cake Type */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Select Cake Type *
              </label>
              <select
                value={cakeType}
                onChange={e => setCakeType(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {cakeTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Size / Weight */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Select Size / Weight *
              </label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {sizeOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Flavor */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Select Gourmet Flavor *
              </label>
              <select
                value={flavor}
                onChange={e => setFlavor(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {flavors.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Theme, Color & Live Message */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                2
              </span>
              <span>Theme, Color & Custom Message</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Occasion / Theme *
                </label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  {themes.map(th => (
                    <option key={th} value={th}>{th}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Preferred Color Palette *
                </label>
                <select
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  {colorPalettes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cake Inscription Message */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-stone-800">
                  Message on Cake (Max 40 Characters)
                </label>
                <span className="text-[11px] text-stone-400">
                  {cakeMessage.length}/40
                </span>
              </div>
              <input
                type="text"
                maxLength={40}
                placeholder="e.g. Happy 25th Anniversary Mom & Dad"
                value={cakeMessage}
                onChange={e => setCakeMessage(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white font-serif"
              />
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Upload Reference Design / Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center hover:border-amber-500 transition-colors bg-stone-50">
                {referenceImageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={referenceImageUrl}
                      alt="Uploaded Reference"
                      className="w-32 h-32 object-cover rounded-xl mx-auto border border-stone-200"
                    />
                    <p className="text-xs text-emerald-700 font-bold">Image Uploaded Successfully</p>
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600">
                      {isUploading ? 'Uploading reference...' : 'Click to browse and upload reference picture'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Schedule & Customer Contact */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              <span>Schedule & Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Required Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    required
                    value={requiredDate}
                    onChange={e => setRequiredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Required Time Slot *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 06:00 PM"
                    required
                    value={requiredTime}
                    onChange={e => setRequiredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Dietary Preferences / Special Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 100% Eggless, less sugar, edible sugar flowers, add 25 anniversary topper..."
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Visual Cake Preview & Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <span>Live Cake Preview & Summary</span>
              </h3>
              <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded uppercase">
                Interactive
              </span>
            </div>

            {/* Visual Cake Simulation Box */}
            <div className="bg-stone-950 rounded-2xl p-6 border border-amber-500/20 text-center relative overflow-hidden shadow-inner">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 mx-auto flex items-center justify-center text-stone-950 shadow-glow mb-4">
                <Cake className="w-12 h-12" />
              </div>

              {/* Inscription preview on cake */}
              <div className="bg-stone-900/90 border border-amber-400/40 px-4 py-2.5 rounded-xl max-w-xs mx-auto">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                  Cake Top Inscription:
                </span>
                <p className="font-serif text-base font-bold text-white italic truncate">
                  "{cakeMessage || 'Your Custom Message'}"
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-stone-300">
                <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                  <span className="text-stone-500 block">Theme:</span>
                  <span className="font-semibold text-amber-300 truncate block">{theme}</span>
                </div>
                <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                  <span className="text-stone-500 block">Colors:</span>
                  <span className="font-semibold text-amber-300 truncate block">{color}</span>
                </div>
              </div>
            </div>

            {/* Request Summary Specs */}
            <div className="space-y-2 text-xs text-stone-300 divide-y divide-stone-800/80">
              <div className="flex justify-between pt-2">
                <span className="text-stone-400">Type:</span>
                <span className="font-semibold text-white text-right">{cakeType}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-stone-400">Weight/Size:</span>
                <span className="font-semibold text-white text-right">{size.split('~')[0]}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-stone-400">Flavor:</span>
                <span className="font-semibold text-amber-300 text-right">{flavor}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-stone-400">Delivery/Pickup:</span>
                <span className="font-semibold text-white text-right">{requiredDate} at {requiredTime}</span>
              </div>
            </div>

            {/* Submit Request Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Submit Custom Cake Booking</span>
              )}
            </button>

            <div className="text-[11px] text-stone-400 text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Rukmani will confirm design & quote via phone.</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
