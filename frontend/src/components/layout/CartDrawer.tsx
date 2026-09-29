import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
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

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Bakery Basket
              </h2>
              <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery or Pickup switcher */}
          <div className="px-6 py-3 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Order Method:</span>
            <div className="flex bg-white p-1 rounded-lg border border-amber-200 text-xs">
              <button
                onClick={() => setDeliveryType('delivery')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🚚 Delivery
              </button>
              <button
                onClick={() => setDeliveryType('pickup')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🏬 Store Pickup
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-stone-500 max-w-xs mb-6">
                  Explore our oven-fresh celebration cakes, crispy hot snacks, and artisan treats!
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors shadow-warm"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              items.map(item => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover border border-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-amber-700 font-medium mt-0.5">
                      ₹{item.product.price} {item.selectedWeight ? `(${item.selectedWeight})` : `/${item.product.unit || 'unit'}`}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controller */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-amber-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-amber-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-stone-900">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Calculations */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-4">
              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                        <span className="text-emerald-600 ml-1.5">applied!</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. FRESH10)"
                        value={couponCodeInput}
                        onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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

              {/* Cost summary */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-stone-800">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE (Above ₹500)</span>
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

                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-amber-700">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2.5 border border-amber-600 text-amber-700 font-semibold text-xs rounded-xl hover:bg-amber-50 transition-colors"
                >
                  View Full Cart
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs rounded-xl shadow-warm hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
