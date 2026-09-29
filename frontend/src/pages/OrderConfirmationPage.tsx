import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Printer,
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    async function fetchOrder() {
      if (!id || order) return;
      setIsLoading(true);
      try {
        const res = await api.orders.track(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to retrieve confirmation order:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [id, order]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-600">Retrieving your order invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">We could not find the requested order ID.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 print:py-0 print:max-w-full">
      {/* Top Success Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-warm text-center space-y-4 relative overflow-hidden print:hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-700/80 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
            Thank you for ordering with us!
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Your Order Has Been Placed!
          </h1>
          <p className="text-emerald-100 text-sm max-w-md mx-auto">
            We have received your bakery order. Our kitchen is getting ready to prepare your fresh delights.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate(`/track?id=${order.id}`)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Track Order Progress</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-emerald-600 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-3xl border border-amber-200 shadow-warm p-8 sm:p-10 space-y-8 print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 leading-none">
              PON CAFE
            </h2>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mt-1">
              Rukmani Bakery
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Kangeayam Road, Chennimalai, Erode – 638051<br />
              Administrator: Rukmani | Phone: 6374123265
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 block">Order Reference ID:</span>
            <span className="font-mono text-xl font-extrabold text-amber-700">
              {order.id}
            </span>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-6 rounded-2xl border border-stone-200 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Customer Details:
            </h4>
            <p className="font-semibold text-stone-800">{order.customerName}</p>
            <p className="text-stone-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-400" /> {order.phone}
            </p>
            {order.email && <p className="text-stone-600">{order.email}</p>}
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Fulfillment & Schedule:
            </h4>
            <p className="capitalize font-semibold text-stone-800">
              {order.deliveryType === 'delivery' ? '🚚 Home Delivery' : '🏬 Store Pickup'}
            </p>
            <p className="text-stone-600">
              <strong>Date:</strong> {order.preferredDate} ({order.preferredTime})
            </p>
            {order.deliveryType === 'delivery' && (
              <p className="text-stone-600 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{order.address}{order.landmark ? `, Landmark: ${order.landmark}` : ''}, Pincode: {order.pincode}</span>
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Ordered Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map(item => (
                  <tr key={item.productId}>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{item.name}</span>
                      {item.selectedWeight && (
                        <span className="text-[11px] text-stone-500">Option: {item.selectedWeight}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-stone-600">{item.category}</td>
                    <td className="py-3.5 px-4 text-right text-stone-600">₹{item.price}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-stone-800">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Calculations */}
        <div className="flex justify-end pt-4 border-t border-stone-200">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
            </div>
            {order.deliveryCharge > 0 ? (
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-stone-900">₹{order.deliveryCharge}</span>
              </div>
            ) : (
              <div className="flex justify-between text-emerald-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold">FREE</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-semibold">- ₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Paid / Payable:</span>
              <span className="text-amber-700">₹{order.totalAmount}</span>
            </div>
            <div className="pt-1 text-[11px] text-stone-500 text-right">
              Payment Method: <span className="uppercase font-bold text-stone-700">{order.paymentMethod}</span> ({order.paymentStatus === 'paid' ? 'Paid' : 'Pay on Delivery/Pickup'})
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-500 space-y-1">
          <p className="font-serif text-stone-800 font-bold">Rukmani Bakery (PON CAFE) - Freshly Baked, Made with Love</p>
          <p>For any queries or order modifications, please call us at <strong>6374123265</strong></p>
          <p>© 2026 Rukmani Bakery. All Rights Reserved.</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center print:hidden">
        <Link
          to="/products"
          className="text-xs font-bold text-amber-700 hover:underline inline-flex items-center gap-1"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          to={`/track?id=${order.id}`}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2"
        >
          <span>Live Order Tracking</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
