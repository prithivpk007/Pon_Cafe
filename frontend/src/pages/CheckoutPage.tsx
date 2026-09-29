import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Truck,
  Clock,
  Calendar,
  MapPin,
  Phone,
  User as UserIcon,
  Mail,
  FileText,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, discount, total, deliveryType, setDeliveryType, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Today's date formatted as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('638051');
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [preferredTime, setPreferredTime] = useState('05:00 PM - 06:00 PM');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
    '08:00 PM - 09:30 PM'
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-sm text-stone-600">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
        >
          Browse Bakery Menu
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      toast.error('Delivery address is required for doorstep delivery.');
      return;
    }

    if (!preferredDate || !preferredTime) {
      toast.error('Please select preferred date and time slot.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        deliveryType,
        address: deliveryType === 'delivery' ? address.trim() : undefined,
        landmark: landmark.trim() || undefined,
        pincode: pincode.trim() || '638051',
        preferredDate,
        preferredTime,
        notes: notes.trim(),
        paymentMethod,
        couponCode: appliedCoupon?.code,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          category: i.product.category,
          price: i.product.price,
          quantity: i.quantity,
          selectedWeight: i.selectedWeight
        }))
      };

      const res = await api.orders.create(orderPayload);

      if (res.success && res.order) {
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // Ignore if confetti not supported
        }

        toast.success(res.message, 'Order Placed!');
        clearCart();
        navigate(`/order-confirmation/${res.order.id}`, { state: { order: res.order } });
      } else {
        toast.error(res.message || 'Failed to place order.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/cart" className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Secure Bakery Checkout
          </h1>
          <p className="text-xs text-stone-500">
            Confirm your delivery/pickup preferences and place your order.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Fulfillment Method */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans">
                1
              </span>
              <span>Delivery or Store Pickup</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50'
                }`}
              >
                <Truck className={`w-5 h-5 mt-0.5 ${deliveryType === 'delivery' ? 'text-amber-600' : 'text-stone-400'}`} />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Home Delivery</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Delivered fresh across Chennimalai town</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50'
                }`}
              >
                <Clock className={`w-5 h-5 mt-0.5 ${deliveryType === 'pickup' ? 'text-amber-600' : 'text-stone-400'}`} />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Store Pickup</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Collect from Kangeayam Road, Chennimalai</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Customer Contact Details */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans">
                2
              </span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Raja"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address (Optional for invoice)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. customer@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Address if Delivery selected */}
            {deliveryType === 'delivery' && (
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Complete Street Address *
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      required
                      placeholder="Door No, Street Name, Residential Area..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Near Temple / Bus Stop"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Schedule Date & Time Slot */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans">
                3
              </span>
              <span>Preferred Date & Time Slot</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Required Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    required
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Time Slot *
                </label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Special Baking / Delivery Notes (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Please add birthday candles, ring doorbell..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-sans">
                4
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-900">Cash on Delivery / Pickup</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-900">UPI / QR Code</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-900">Card / NetBanking</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-amber-200 shadow-warm p-6 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <span>Order Summary ({items.length} Items)</span>
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
              {items.map(i => (
                <div key={i.product.id} className="pt-2 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block truncate max-w-[170px]">
                        {i.product.name}
                      </span>
                      <span className="text-stone-500">
                        {i.quantity}x @ ₹{i.product.price}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{i.product.price * i.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal}</span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                <span>Final Total Amount</span>
                <span className="text-amber-700">₹{total}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Place Order (₹{total})</span>
              )}
            </button>

            <div className="text-[11px] text-stone-500 space-y-1 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PON CAFE guarantees 100% fresh baking standards.</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
