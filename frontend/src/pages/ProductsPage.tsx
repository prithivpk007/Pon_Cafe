import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductCategory, AvailabilityStatus } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);

  // Filter States from URL or defaults
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const activeAvailability = searchParams.get('availability') || 'All';
  const activeSort = searchParams.get('sort') || 'default';
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  const categories: Array<{ id: string; label: string; emoji: string }> = [
    { id: 'All', label: 'All Items (24)', emoji: '✨' },
    { id: 'Cakes', label: 'Cakes', emoji: '🎂' },
    { id: 'Snacks', label: 'Snacks & Puffs', emoji: '🥟' },
    { id: 'Breads', label: 'Breads & Buns', emoji: '🍞' },
    { id: 'Cookies', label: 'Cookies', emoji: '🍪' },
    { id: 'Beverages', label: 'Beverages', emoji: '☕' }
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.products.getAll({
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchQuery || undefined,
        availability: activeAvailability !== 'All' ? activeAvailability : undefined,
        sort: activeSort !== 'default' ? activeSort : undefined
      });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, activeAvailability, activeSort]);

  const handleCategoryChange = (category: string) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') next.delete('category');
    else next.set('category', category);
    setSearchParams(next);
  };

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val.trim()) next.delete('search');
    else next.set('search', val.trim());
    setSearchParams(next);
  };

  const handleSortChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'default') next.delete('sort');
    else next.set('sort', val);
    setSearchParams(next);
  };

  const handleAvailabilityChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All') next.delete('availability');
    else next.set('availability', val);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setMaxPriceFilter(1000);
  };

  // Client-side price slider filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.price <= maxPriceFilter);
  }, [products, maxPriceFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-warm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-1">
            Artisanal Bakery Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
            Freshly Baked Every Morning
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Browse our entire range of celebration cakes, savory hot puffs, daily breads, butter cookies, and freshly brewed beverages.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-600/20 rounded-full blur-2xl" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-warm scale-105'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 shadow-soft flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, chocolate, puffs, eggless..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls: Availability & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Availability Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-medium hidden sm:inline">Status:</span>
            <select
              value={activeAvailability}
              onChange={e => handleAvailabilityChange(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Availability</option>
              <option value="available">Available in Bakery</option>
              <option value="limited">Limited Stock</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={activeSort}
              onChange={e => handleSortChange(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="default">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Reset Filters button if any filter active */}
          {(activeCategory !== 'All' || searchQuery || activeAvailability !== 'All' || activeSort !== 'default') && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Category Indicator */}
      <div className="flex justify-between items-center text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> bakery items
          {activeCategory !== 'All' && <span> in <strong>{activeCategory}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </span>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-80 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-soft max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No bakery items matched
          </h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search keyword or switching category tabs.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-full hover:bg-amber-700 transition-colors shadow-warm"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedQuickView}
            />
          ))}
        </div>
      )}

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
