import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Truck,
  PartyPopper,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const [searchQuery, setSearchQuery] = useState(urlId || 'PON-84921');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const statusSteps: Array<{
    status: OrderStatus;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      status: 'Order Placed',
      label: 'Order Placed',
      description: 'Your order has been submitted to the bakery.',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      status: 'Order Confirmed',
      label: 'Order Confirmed',
      description: 'Confirmed by Administrator Rukmani.',
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      status: 'Preparing',
      label: 'Baking & Preparing',
      description: 'Master chef is preparing fresh treats in the kitchen.',
      icon: <ChefHat className="w-5 h-5" />
    },
    {
      status: 'Ready for Pickup',
      label: 'Ready for Pickup / Dispatch',
      description: 'Packed fresh and waiting at counter or dispatch desk.',
      icon: <PackageCheck className="w-5 h-5" />
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Delivery',
      description: 'En route to your doorstep in Chennimalai.',
      icon: <Truck className="w-5 h-5" />
    },
    {
      status: 'Completed',
      label: 'Order Delivered / Collected',
      description: 'Enjoy your fresh bakery treats!',
      icon: <PartyPopper className="w-5 h-5" />
    }
  ];

  const handleTrack = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.orders.track(q.trim());
      if (res.success && res.order) {
        setOrder(res.order);
        const next = new URLSearchParams();
        next.set('id', res.order.id);
        setSearchParams(next);
      }
    } catch (err: any) {
      setOrder(null);
      setErrorMsg(err.message || `No order found for '${q}'. Please check your Order ID or Phone number.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      handleTrack(urlId);
    } else {
      // Demo lookup with sample order
      handleTrack('PON-84921');
    }
  }, [urlId]);

  const getStepIndex = (currentStatus?: OrderStatus) => {
    if (!currentStatus) return -1;
    if (currentStatus === 'Cancelled') return -99;
    return statusSteps.findIndex(s => s.status === currentStatus);
  };

  const currentStepIdx = getStepIndex(order?.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">
          Live Bakery Fulfillment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Bakery Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your <strong>Order ID (e.g. PON-84921)</strong> or your <strong>10-digit mobile number</strong> to track live baking and delivery progress.
        </p>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(searchQuery);
          }}
          className="flex gap-2 max-w-md mx-auto pt-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Order ID (e.g. PON-84921) or Mobile..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-soft uppercase"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm transition-all flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Track</span>
            )}
          </button>
        </form>
      </div>

      {/* Error Message if lookup fails */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl max-w-lg mx-auto flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Order Status Display Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-warm overflow-hidden divide-y divide-stone-100">
          {/* Header Info */}
          <div className="p-6 sm:p-8 bg-stone-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Live Order Tracker
                </span>
                <span className="bg-amber-600 text-stone-950 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {order.id}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {order.customerName}
              </h2>
              <p className="text-xs text-stone-400">
                Scheduled for: {order.preferredDate} ({order.preferredTime})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-400 block">Current Status:</span>
              <span className={`inline-block text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mt-1 ${
                order.status === 'Completed'
                  ? 'bg-emerald-500 text-stone-950'
                  : order.status === 'Cancelled'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500 text-stone-950 animate-pulse'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Cancelled Alert if applicable */}
          {order.status === 'Cancelled' ? (
            <div className="p-8 text-center space-y-3 bg-rose-50/70">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-rose-900">Order Cancelled</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                This order has been marked as cancelled. If you believe this is a mistake or have questions, please contact Administrator Rukmani at <strong>6374123265</strong>.
              </p>
            </div>
          ) : (
            /* 7-Step Visual Timeline Component */
            <div className="p-6 sm:p-10 space-y-8">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Fulfillment Timeline
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-6 right-6 hidden md:block h-1 bg-stone-200 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                    style={{
                      width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%`
                    }}
                  />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx || order.status === 'Completed';
                    const isCurrent = idx === currentStepIdx && order.status !== 'Completed';

                    let circleClass = 'bg-stone-100 text-stone-400 border-stone-300';
                    let textClass = 'text-stone-400';

                    if (isCompleted) {
                      circleClass = 'bg-emerald-600 text-white border-emerald-600 shadow-md';
                      textClass = 'text-stone-900 font-bold';
                    } else if (isCurrent) {
                      circleClass = 'bg-amber-500 text-stone-950 border-amber-500 shadow-glow ring-4 ring-amber-200 animate-pulse';
                      textClass = 'text-amber-900 font-bold';
                    }

                    return (
                      <div key={step.status} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${circleClass}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                        </div>

                        <div>
                          <p className={`text-xs ${textClass}`}>{step.label}</p>
                          <p className="text-[11px] text-stone-500 leading-tight mt-0.5 hidden md:block">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status History Logs */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                    Status Update Log:
                  </h4>
                  <div className="space-y-2">
                    {order.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-bold text-stone-900">{h.status}</span>
                          {h.note && <span className="text-stone-600 ml-1.5">— {h.note}</span>}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Details & Summary Card */}
          <div className="p-6 sm:p-8 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Items in this Order ({order.items.length}):
              </h4>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {order.items.map(i => (
                  <div key={i.productId} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2">
                      <img src={i.image} alt={i.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-stone-900">{i.name}</span>
                        <span className="text-stone-500 block">{i.quantity}x @ ₹{i.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">₹{i.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info & Bakery Contact */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Fulfillment Destination:
                </h4>
                <p className="text-stone-700">
                  {order.deliveryType === 'delivery' ? (
                    <>
                      <strong>Home Delivery to:</strong> {order.address}
                      {order.landmark && <span> (Near {order.landmark})</span>}
                    </>
                  ) : (
                    <>
                      <strong>Store Pickup at:</strong> Kangeayam Road, Chennimalai, Erode – 638051
                    </>
                  )}
                </p>
                <p className="text-stone-700">
                  <strong>Total Amount:</strong> ₹{order.totalAmount} ({order.paymentMethod.toUpperCase()})
                </p>
              </div>

              {/* Direct Call Rukmani */}
              <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-950 text-xs">Need to change time or add candles?</p>
                  <p className="text-[11px] text-amber-800">Call Administrator Rukmani directly</p>
                </div>
                <a
                  href="tel:6374123265"
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>6374123265</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
