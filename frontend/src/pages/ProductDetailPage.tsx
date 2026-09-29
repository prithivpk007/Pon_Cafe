import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.products.getById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          if (res.product.weightOptions && res.product.weightOptions.length > 0) {
            setSelectedWeight(res.product.weightOptions[0]);
          }

          // Fetch related in category
          const relRes = await api.products.getAll({ category: res.product.category });
          if (relRes.success) {
            setRelatedProducts(relRes.products.filter(p => p.id !== id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500 font-medium">Preparing fresh details from the bakery...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-sm text-stone-600">The bakery item you are looking for is currently unavailable or has been relocated.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.availability === 'out_of_stock' || product.stock <= 0;
  const isLimited = product.availability === 'limited' || (product.stock > 0 && product.stock <= 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedWeight);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-amber-700">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category}`} className="hover:text-amber-700">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Details Card */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-soft overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-stone-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    ★ Chef’s Signature
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Availability Badge */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    <AlertCircle className="w-4 h-4" /> Out of Stock in Bakery
                  </span>
                ) : isLimited ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full animate-pulse">
                    <AlertCircle className="w-4 h-4" /> Only {product.stock} Units Left in Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" /> Freshly Baked & Available
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span>•</span>
                  <span>{product.reviewCount || 34} Customer Reviews</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">100% Authentic Recipe</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 py-2 border-y border-stone-100">
                <span className="text-3xl font-extrabold text-stone-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-500 font-medium">
                  / {product.unit || 'unit'} (inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Weight Options if available */}
              {product.weightOptions && product.weightOptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-700 block">
                    Choose Weight / Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.weightOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedWeight(opt)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                          selectedWeight === opt
                            ? 'bg-amber-100 text-amber-900 border-amber-500 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Key Natural Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map(ing => (
                      <span
                        key={ing}
                        className="text-xs bg-amber-50/70 border border-amber-200 text-amber-900 px-2.5 py-0.5 rounded-lg"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergen Information */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Allergen Notice:</strong> Contains {product.allergens.join(', ')}.</span>
                </div>
              )}
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 text-sm font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 20, quantity + 1))}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-amber-100 text-amber-900 border border-amber-400 hover:bg-amber-200'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  <span>Add to Basket</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-warm transition-all ${
                    isOutOfStock
                      ? 'bg-stone-300 text-stone-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-105'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-200" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-600">
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Fresh Daily Batch</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>100% Hygienic</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Doorstep Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">
                More from {product.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/products?category=${product.category}`}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              View all {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
