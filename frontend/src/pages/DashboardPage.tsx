import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  ShoppingBag,
  Cake,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, CustomCakeRequest } from '../types';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cakeRequests, setCakeRequests] = useState<CustomCakeRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'cakes' | 'profile'>('orders');
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadUserData() {
      setIsLoading(true);
      try {
        const [ordersRes, cakesRes] = await Promise.all([
          api.orders.getMyOrders(),
          api.customCakes.getMyRequests()
        ]);
        if (ordersRes.success) setOrders(ordersRes.orders);
        if (cakesRes.success) setCakeRequests(cakesRes.requests);
      } catch (err) {
        console.error('Error fetching dashboard records:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [isAuthenticated, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.auth.updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim()
      });
      if (res.success && res.user) {
        updateUser(res.user);
        toast.success('Your profile details have been updated successfully.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Profile update failed.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-serif text-2xl font-bold flex items-center justify-center shadow-warm uppercase">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                {user?.name}
              </h1>
              {user?.role === 'admin' && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" /> Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {user?.email} • {user?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-warm transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Center</span>
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-stone-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cakes')}
          className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'cakes'
              ? 'bg-stone-900 text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Cake className="w-4 h-4" />
          <span>Custom Cake Bookings ({cakeRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-stone-900 text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile & Saved Info</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          {/* Active / In-Progress Orders */}
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>Active & In-Progress Orders ({activeOrders.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border-2 border-amber-300 shadow-warm p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block">
                          {order.deliveryType === 'delivery' ? '🚚 Home Delivery' : '🏬 Store Pickup'}
                        </span>
                        <span className="font-mono text-base font-extrabold text-stone-900">
                          {order.id}
                        </span>
                      </div>
                      <span className="bg-amber-500 text-stone-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-600 border-y border-stone-100 py-3">
                      <p><strong>Scheduled:</strong> {order.preferredDate} ({order.preferredTime})</p>
                      <p><strong>Items:</strong> {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                      <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
                      >
                        View Invoice
                      </Link>
                      <Link
                        to={`/track?id=${order.id}`}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
                      >
                        <span>Live Tracking</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Orders History */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-amber-100 shadow-soft max-w-md mx-auto space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-stone-800">No Past Orders Found</h3>
                <p className="text-xs text-stone-500">You haven’t placed any orders with PON CAFE yet.</p>
                <Link
                  to="/products"
                  className="inline-block px-5 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
                >
                  Order Fresh Treats
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-amber-100 shadow-soft overflow-hidden divide-y divide-stone-100">
                {orders.map(order => (
                  <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-stone-900">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          order.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items • ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-stone-700">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Receipt
                      </Link>
                      <Link
                        to={`/track?id=${order.id}`}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Track Status
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM CAKES */}
      {activeTab === 'cakes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Custom Cake Inquiries & Bookings
              </h2>
              <p className="text-xs text-stone-500">
                Track status, quotes, and chef updates for your customized celebration cakes.
              </p>
            </div>
            <Link
              to="/custom-cake"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded-xl shadow-warm transition-all"
            >
              + Book New Cake
            </Link>
          </div>

          {cakeRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-amber-100 shadow-soft max-w-md mx-auto space-y-3">
              <Cake className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-800">No Custom Cake Bookings</h3>
              <p className="text-xs text-stone-500">Planning a birthday or wedding? Customize your cake in our studio.</p>
              <Link
                to="/custom-cake"
                className="inline-block px-5 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
              >
                Launch Cake Studio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cakeRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-amber-200 shadow-soft p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-700 block">
                        {req.id}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        {req.cakeType}
                      </h3>
                      <p className="text-xs text-stone-500">{req.flavor} • {req.size}</p>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
                      req.status === 'Accepted' || req.status === 'In Preparation'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : req.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1 text-stone-700">
                    <p><strong>Required For:</strong> {req.requiredDate} ({req.requiredTime})</p>
                    <p><strong>Theme:</strong> {req.theme}</p>
                    {req.cakeMessage && <p><strong>Inscription:</strong> "{req.cakeMessage}"</p>}
                    {req.estimatedPrice && (
                      <p className="text-amber-800 font-bold">
                        <strong>Quote / Estimate:</strong> ₹{req.estimatedPrice}
                      </p>
                    )}
                    {req.adminNotes && (
                      <p className="text-stone-600 italic bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                        <strong>Rukmani's Note:</strong> {req.adminNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-amber-100 shadow-warm space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Manage Saved Information
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Default Delivery Address (Chennimalai)
              </label>
              <textarea
                rows={3}
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm transition-all flex items-center justify-center gap-2"
            >
              {isUpdatingProfile ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
