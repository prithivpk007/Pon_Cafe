import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Upload,
  Layers,
  Star,
  Sparkles,
  X,
  RefreshCw
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Product, ProductCategory, AvailabilityStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Cakes');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [stock, setStock] = useState<number>(20);
  const [unit, setUnit] = useState('1 pc');
  const [image, setImage] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [allergensStr, setAllergensStr] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.products.getAll({
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchQuery]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Cakes');
    setDescription('');
    setPrice(100);
    setStock(20);
    setUnit('1 pc');
    setImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');
    setAvailability('available');
    setFeatured(false);
    setIsNew(false);
    setIngredientsStr('');
    setAllergensStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price);
    setStock(p.stock);
    setUnit(p.unit || '1 pc');
    setImage(p.image);
    setAvailability(p.availability);
    setFeatured(p.featured);
    setIsNew(Boolean(p.isNew));
    setIngredientsStr(p.ingredients ? p.ingredients.join(', ') : '');
    setAllergensStr(p.allergens ? p.allergens.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await api.upload(file);
      if (res.success && res.imageUrl) {
        setImage(res.imageUrl);
        toast.success('Product image uploaded successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) {
      toast.error('Product name and a valid price are required.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      unit: unit.trim(),
      image: image.trim(),
      availability,
      featured,
      isNew,
      ingredients: ingredientsStr.split(',').map(s => s.trim()).filter(Boolean),
      allergens: allergensStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProduct) {
        const res = await api.products.update(editingProduct.id, payload);
        if (res.success) {
          toast.success(`Product '${res.product.name}' updated!`);
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await api.products.create(payload);
        if (res.success) {
          toast.success(`New bakery item '${res.product.name}' created!`);
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, pName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${pName}'?`)) {
      return;
    }

    try {
      const res = await api.products.delete(id);
      if (res.success) {
        toast.success(res.message);
        fetchProducts();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const handleQuickStockToggle = async (p: Product, newStock: number) => {
    const newAvail: AvailabilityStatus = newStock <= 0 ? 'out_of_stock' : newStock <= 5 ? 'limited' : 'available';
    try {
      await api.products.updateStock(p.id, newStock, newAvail);
      toast.success(`Updated stock for '${p.name}' to ${newStock}.`);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Stock update failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-soft">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Product & Inventory Management
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Add new bakery items, update daily inventory, change prices, or mark specials.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-soft flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-xs rounded-xl px-3 py-2 text-stone-800"
            >
              <option value="All">All Categories</option>
              <option value="Cakes">Cakes</option>
              <option value="Snacks">Snacks</option>
              <option value="Breads">Breads</option>
              <option value="Cookies">Cookies</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-stone-200" />
                        <div>
                          <span className="font-bold text-stone-900 block">{p.name}</span>
                          <span className="text-stone-500 line-clamp-1 max-w-xs">{p.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">₹{p.price}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickStockToggle(p, Math.max(0, p.stock - 5))}
                          className="px-1.5 py-0.5 bg-stone-200 hover:bg-stone-300 rounded font-bold"
                          title="Reduce 5"
                        >
                          -5
                        </button>
                        <span className="font-bold text-stone-800 w-8 text-center">{p.stock}</span>
                        <button
                          onClick={() => handleQuickStockToggle(p, p.stock + 5)}
                          className="px-1.5 py-0.5 bg-stone-200 hover:bg-stone-300 rounded font-bold"
                          title="Add 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        p.availability === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.availability === 'limited'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {p.featured && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ★ Featured
                          </span>
                        )}
                        {p.isNew && (
                          <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Bakery Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Breads">Breads</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Daily Available Stock *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit Label</label>
                  <input
                    type="text"
                    placeholder="1 pc / 1 kg / 250g"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Availability Status</label>
                  <select
                    value={availability}
                    onChange={e => setAvailability(e.target.value as AvailabilityStatus)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <label className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 inline mr-1" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Cocoa, Butter, Milk, Sugar"
                    value={ingredientsStr}
                    onChange={e => setIngredientsStr(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Allergens (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Milk / Dairy, Gluten"
                    value={allergensStr}
                    onChange={e => setAllergensStr(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="text-amber-600 rounded"
                  />
                  <span>Mark as Chef's Special / Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={e => setIsNew(e.target.checked)}
                    className="text-amber-600 rounded"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-warm"
                >
                  {isSubmitting ? 'Saving...' : 'Save Bakery Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
