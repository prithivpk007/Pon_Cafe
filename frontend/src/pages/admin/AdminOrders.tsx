import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ChefHat,
  PackageCheck,
  XCircle,
  Phone,
  Eye,
  X,
  Printer,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected order for detailed modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.orders.getAll({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        deliveryType: deliveryFilter !== 'All' ? deliveryFilter : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, deliveryFilter, searchQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await api.orders.updateStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order ${orderId} updated to '${newStatus}'.`);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (current: OrderStatus, deliveryType: 'delivery' | 'pickup'): OrderStatus | null => {
    switch (current) {
      case 'Order Placed':
        return 'Order Confirmed';
      case 'Order Confirmed':
        return 'Preparing';
      case 'Preparing':
        return deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup';
      case 'Ready for Pickup':
      case 'Out for Delivery':
        return 'Completed';
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-soft">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Customer Order Management
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Track, accept, prepare, and complete customer orders across Chennimalai.
            </p>
          </div>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs px-3 py-1.5 rounded-xl font-bold">
            Total Orders: {orders.length}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-soft flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800"
              >
                <option value="All">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-semibold">Type:</span>
              <select
                value={deliveryFilter}
                onChange={e => setDeliveryFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800"
              >
                <option value="All">All Fulfillment</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Delivery / Date</th>
                  <th className="py-3 px-4">Ordered Items</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map(order => {
                  const nextStatus = getNextStatus(order.status, order.deliveryType);
                  return (
                    <tr key={order.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block">{order.customerName}</span>
                        <a href={`tel:${order.phone}`} className="text-amber-700 font-medium hover:underline flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-stone-800 block">
                          {order.deliveryType === 'delivery' ? '🚚 Delivery' : '🏬 Pickup'}
                        </span>
                        <span className="text-stone-500 text-[11px] block">
                          {order.preferredDate} ({order.preferredTime})
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[220px]">
                        <p className="text-stone-700 line-clamp-2">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-stone-900">
                        ₹{order.totalAmount}
                      </td>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {nextStatus && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, nextStatus)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              {nextStatus === 'Order Confirmed' ? 'Confirm' : nextStatus === 'Preparing' ? 'Bake' : nextStatus === 'Completed' ? 'Complete' : 'Dispatch'}
                            </button>
                          )}

                          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal / Kitchen Ticket */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-stone-200 space-y-6">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">Order Invoice & Ticket</span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">{selectedOrder.id}</h3>
                <p className="text-xs text-stone-500">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-stone-500 font-bold block uppercase text-[10px]">Customer:</span>
                <p className="font-bold text-stone-900">{selectedOrder.customerName}</p>
                <p className="text-stone-700">{selectedOrder.phone}</p>
                {selectedOrder.email && <p className="text-stone-600">{selectedOrder.email}</p>}
              </div>
              <div>
                <span className="text-stone-500 font-bold block uppercase text-[10px]">Fulfillment Destination:</span>
                <p className="font-bold text-stone-900 capitalize">{selectedOrder.deliveryType}</p>
                <p className="text-stone-700">{selectedOrder.preferredDate} ({selectedOrder.preferredTime})</p>
                {selectedOrder.address && (
                  <p className="text-stone-600 mt-1">{selectedOrder.address} {selectedOrder.landmark ? `(Near ${selectedOrder.landmark})` : ''}</p>
                )}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Customer Notes:</strong> {selectedOrder.notes}
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-stone-900">Items to Prepare</h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="p-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        {item.selectedWeight && <span className="text-stone-500">{item.selectedWeight}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">{item.quantity}x @ ₹{item.price}</span>
                      <span className="block text-stone-500">₹{item.subtotal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Stepper Progression */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-700 block">Advance Order Status:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Order Placed',
                  'Order Confirmed',
                  'Preparing',
                  'Ready for Pickup',
                  'Out for Delivery',
                  'Completed',
                  'Cancelled'
                ].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st as OrderStatus)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.status === st
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
