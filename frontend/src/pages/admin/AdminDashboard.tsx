import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Cake,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  RefreshCw,
  Phone
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { AdminStats, Order, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const toast = useToast();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.stats.getAdminStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusUpdate = async (orderId: string, nextStatus: OrderStatus) => {
    setIsUpdatingStatus(orderId);
    try {
      const res = await api.orders.updateStatus(orderId, nextStatus, `Updated by Rukmani via Dashboard`);
      if (res.success) {
        toast.success(`Order ${orderId} moved to '${nextStatus}'.`);
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-soft">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Welcome, Administrator Rukmani!
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Store: <strong>PON CAFE (Chennimalai, Erode – 638051)</strong> | Hotline: <strong>6374123265</strong>
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-stone-900">
              ₹{stats?.totalRevenue.toLocaleString() || '0'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">Total completed sales</span>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-stone-900">
              {stats?.totalOrders || 0}
            </p>
            <span className="text-[10px] text-stone-500 block">All-time received</span>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <p className="text-2xl font-extrabold text-amber-900">
              {stats?.pendingOrders || 0}
            </p>
            <span className="text-[10px] text-amber-800 font-semibold block">Needs preparation</span>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-stone-900">
              {stats?.completedOrders || 0}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">Fulfilled orders</span>
          </div>

          {/* Total Products & Low Stock */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Products</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-stone-900">
              {stats?.totalProducts || 0}
            </p>
            <span className="text-[10px] text-rose-600 font-bold block">
              {stats?.outOfStockProducts || 0} Out of Stock
            </span>
          </div>

          {/* Custom Cake Requests */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Cake Requests</span>
              <Cake className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-stone-900">
              {stats?.totalCakeRequests || 0}
            </p>
            <span className="text-[10px] text-amber-700 font-bold block">
              {stats?.newCakeRequests || 0} New inquiries
            </span>
          </div>
        </div>

        {/* Category Sales Breakdown & Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Category distribution */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Menu Category Performance
            </h2>
            <div className="space-y-4 pt-2">
              {stats?.categoryStats &&
                Object.entries(stats.categoryStats).map(([catName, data]) => (
                  <div key={catName} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>{catName} ({data.count} items)</span>
                      <span className="text-amber-800 font-bold">{data.totalSold} Units Sold</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (data.totalSold / Math.max(1, (stats.totalOrders * 2))) * 100 + 15)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right: Quick Administrator Actions */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Administrative Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                to="/admin/orders"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Process Customer Orders</h4>
                  <p className="text-[11px] text-stone-500">Update baking & delivery status</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Link>

              <Link
                to="/admin/products"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Add / Edit Bakery Items</h4>
                  <p className="text-[11px] text-stone-500">Manage prices & daily stock</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Link>

              <Link
                to="/admin/custom-cakes"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Custom Cake Requests</h4>
                  <p className="text-[11px] text-stone-500">View designs & set price quotes</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Link>

              <Link
                to="/admin/offers"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Manage Promo Discounts</h4>
                  <p className="text-[11px] text-stone-500">Create coupons & festival deals</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-soft p-6 sm:p-8 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-stone-500">1-click advance order status directly from overview</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Current Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats?.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                    <td className="py-3 px-4 font-semibold text-stone-800">{order.customerName}</td>
                    <td className="py-3 px-4 text-stone-600">
                      <a href={`tel:${order.phone}`} className="hover:text-amber-700 font-medium">
                        {order.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-[200px] truncate">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900">₹{order.totalAmount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        order.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'Order Placed' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(order.id, 'Order Confirmed')}
                          disabled={isUpdatingStatus === order.id}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[10px] hover:bg-amber-700"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'Order Confirmed' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(order.id, 'Preparing')}
                          disabled={isUpdatingStatus === order.id}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[10px] hover:bg-amber-700"
                        >
                          Start Baking
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(order.id, order.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup')}
                          disabled={isUpdatingStatus === order.id}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[10px] hover:bg-blue-700"
                        >
                          {order.deliveryType === 'delivery' ? 'Dispatch' : 'Mark Ready'}
                        </button>
                      )}
                      {(order.status === 'Preparing' || order.status === 'Ready for Pickup' || order.status === 'Out for Delivery') && (
                        <button
                          onClick={() => handleQuickStatusUpdate(order.id, 'Completed')}
                          disabled={isUpdatingStatus === order.id}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700 ml-1"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
