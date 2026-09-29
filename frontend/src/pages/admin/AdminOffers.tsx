import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  Tag,
  CheckCircle2,
  XCircle,
  Percent,
  Calendar,
  X
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Offer, ProductCategory } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(200);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [categoryLimit, setCategoryLimit] = useState<string>('All');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [active, setActive] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await api.offers.getAll();
      if (res.success) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAddModal = () => {
    setEditingOffer(null);
    setTitle('');
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderValue(200);
    setMaxDiscount(100);
    setCategoryLimit('All');
    setExpiryDate('2026-12-31');
    setActive(true);
    setBadgeText('10% OFF');
    setIsModalOpen(true);
  };

  const openEditModal = (o: Offer) => {
    setEditingOffer(o);
    setTitle(o.title);
    setCode(o.code);
    setDescription(o.description);
    setDiscountType(o.discountType);
    setDiscountValue(o.discountValue);
    setMinOrderValue(o.minOrderValue);
    setMaxDiscount(o.maxDiscount || 0);
    setCategoryLimit(o.categoryLimit || 'All');
    setExpiryDate(o.expiryDate.split('T')[0]);
    setActive(o.active);
    setBadgeText(o.badgeText || '');
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || discountValue <= 0) {
      toast.error('Title, coupon code, and discount value are required.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      categoryLimit: categoryLimit !== 'All' ? (categoryLimit as ProductCategory) : undefined,
      expiryDate: new Date(expiryDate).toISOString(),
      active,
      badgeText: badgeText.trim() || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} OFF`
    };

    try {
      if (editingOffer) {
        const res = await api.offers.update(editingOffer.id, payload);
        if (res.success) {
          toast.success(`Coupon '${res.offer.code}' updated!`);
          setIsModalOpen(false);
          fetchOffers();
        }
      } else {
        const res = await api.offers.create(payload);
        if (res.success) {
          toast.success(`New coupon '${res.offer.code}' created!`);
          setIsModalOpen(false);
          fetchOffers();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon code '${code}'?`)) return;
    try {
      const res = await api.offers.delete(id);
      if (res.success) {
        toast.success(`Coupon '${code}' removed.`);
        fetchOffers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete offer');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-soft">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Special Offers & Coupon Discounts
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Create seasonal discounts, festive deals, and celebration promo codes.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Promo Coupon</span>
          </button>
        </div>

        {/* Offers Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between space-y-4 shadow-soft ${
                offer.active ? 'border-amber-200' : 'border-stone-200 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm font-extrabold bg-stone-900 text-amber-300 px-3 py-1 rounded-xl">
                    {offer.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    offer.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {offer.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{offer.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{offer.description}</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1 text-stone-700">
                  <p><strong>Discount:</strong> {offer.discountValue}{offer.discountType === 'percentage' ? '%' : '₹ Flat'}</p>
                  <p><strong>Min. Order:</strong> ₹{offer.minOrderValue}</p>
                  {offer.maxDiscount && <p><strong>Max Cap:</strong> ₹{offer.maxDiscount}</p>}
                  {offer.categoryLimit && <p><strong>Applies To:</strong> {offer.categoryLimit}</p>}
                  <p className="text-stone-500 text-[11px]">Valid Until: {offer.expiryDate.split('T')[0]}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  onClick={() => openEditModal(offer)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer.id, offer.code)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingOffer ? `Edit Coupon: ${editingOffer.code}` : 'Create New Coupon Offer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI20"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs uppercase bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festival Special Discount"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as 'percentage' | 'flat')}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category Limit</label>
                  <select
                    value={categoryLimit}
                    onChange={e => setCategoryLimit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="All">All Categories</option>
                    <option value="Cakes">Cakes Only</option>
                    <option value="Snacks">Snacks Only</option>
                    <option value="Breads">Breads Only</option>
                    <option value="Cookies">Cookies Only</option>
                    <option value="Beverages">Beverages Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Get 20% discount on all artisan celebration cakes"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF CAKES"
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => setActive(e.target.checked)}
                    className="text-amber-600 rounded"
                  />
                  <span>Enable and activate this promo code</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-warm"
                >
                  {isSubmitting ? 'Saving...' : 'Save Promo Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
