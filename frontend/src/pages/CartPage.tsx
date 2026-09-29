import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    deliveryType,
    setDeliveryType,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">
          Looks like you haven’t added any bakery treats yet. Treat yourself to our oven-fresh celebration cakes, spicy hot puffs, or fresh morning bread!
        </p>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-warm transition-all"
          >
            <span>Explore Product Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your selected items before proceeding to secure checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Empty Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-amber-100 shadow-soft overflow-hidden divide-y divide-stone-100">
            {items.map(item => (
              <div key={item.product.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                        <Link to={`/product/${item.product.id}`} className="hover:text-amber-700">
                          {item.product.name}
                        </Link>
                      </h3>
                      {item.selectedWeight && (
                        <p className="text-xs text-stone-500 font-medium">
                          Size: {item.selectedWeight}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    {/* Qty Counter */}
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Subtotal */}
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">
                        ₹{item.product.price} each
                      </span>
                      <span className="text-base font-bold text-stone-900">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Box */}
          <div className="bg-white rounded-3xl border border-amber-200 shadow-warm p-6 space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">
              Order Summary
            </h2>

            {/* Delivery / Pickup Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Fulfillment Preference:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-amber-100 text-amber-900 border-amber-500 font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Home Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-amber-100 text-amber-900 border-amber-500 font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Store Pickup</span>
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-700 block">
                Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 ml-1.5 font-medium">Applied!</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. FRESH10"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={() => applyCoupon(couponCodeInput)}
                    className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal}</span>
              </div>

              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Charge (Chennimalai)</span>
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
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Payable</span>
                <span className="text-amber-700">₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe & Secure Online Ordering Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
