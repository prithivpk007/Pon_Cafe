import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ShoppingBag, Zap, Plus, Minus, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(
    product?.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : undefined
  );

  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const isOutOfStock = product.availability === 'out_of_stock' || product.stock <= 0;
  const isLimited = product.availability === 'limited' || (product.stock > 0 && product.stock <= 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedWeight);
    setIsCartOpen(false);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 border border-amber-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 relative bg-stone-100 min-h-[260px] md:min-h-[380px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Availability Badge */}
            <div className="mb-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : isLimited ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Limited Stock ({product.stock} units left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Available in Bakery
                </span>
              )}
            </div>

            {/* Title & Price */}
            <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-stone-900">
                ₹{product.price}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                per {product.unit || 'unit'}
              </span>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Weight options */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Available Sizes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        selectedWeight === w
                          ? 'bg-amber-100 text-amber-900 border-amber-500 font-bold shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients & Allergens */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Key Ingredients:
                </span>
                <div className="flex flex-wrap gap-1">
                  {product.ingredients.map(ing => (
                    <span
                      key={ing}
                      className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span><strong>Allergen Info:</strong> Contains {product.allergens.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Controls & CTAs */}
          <div className="pt-6 mt-4 border-t border-stone-200 space-y-3">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 20, quantity + 1))}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-warm transition-all ${
                  isOutOfStock
                    ? 'bg-stone-300 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-105'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-200" />
                <span>Buy Now</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>View Full Product Page & Reviews</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
