import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Plus, Minus, Zap, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : undefined
  );

  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const isOutOfStock = product.availability === 'out_of_stock' || product.stock <= 0;
  const isLimited = product.availability === 'limited' || (product.stock > 0 && product.stock <= 5);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity, selectedWeight);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-2xl border border-amber-100/80 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image & Badges Container */}
      <div
        className="relative h-52 sm:h-56 bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView ? onQuickView(product) : navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              ★ Chef's Special
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-900/90 text-rose-100 backdrop-blur-xs text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-700 shadow-xs">
              Out of Stock
            </span>
          ) : isLimited ? (
            <span className="bg-amber-800/90 text-amber-100 backdrop-blur-xs text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-600 shadow-xs animate-pulse">
              Limited Stock ({product.stock} left)
            </span>
          ) : (
            <span className="bg-emerald-800/90 text-emerald-100 backdrop-blur-xs text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600 shadow-xs">
              Available
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
            else navigate(`/product/${product.id}`);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 text-stone-800 hover:bg-amber-600 hover:text-white shadow-md transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1.5 text-xs text-stone-500">
            <span className="font-semibold text-amber-700 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating}
                <span className="text-stone-400 font-normal">({product.reviewCount || 12})</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            className="font-serif text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors cursor-pointer"
            onClick={() => onQuickView ? onQuickView(product) : navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Weight Options for Cakes if present */}
          {product.weightOptions && product.weightOptions.length > 0 && (
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">Select Size/Weight:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.weightOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeight(opt);
                    }}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium transition-all ${
                      selectedWeight === opt
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Interactive Action Buttons */}
        <div className="pt-4 mt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-stone-400">Price:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-stone-900">
                  ₹{product.price}
                </span>
                <span className="text-xs text-stone-500">
                  /{product.unit || 'unit'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-bold text-stone-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.min(product.stock || 20, quantity + 1));
                  }}
                  className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Action CTAs: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-warm transition-all ${
                isOutOfStock
                  ? 'bg-stone-300 text-stone-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-105'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-200" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
