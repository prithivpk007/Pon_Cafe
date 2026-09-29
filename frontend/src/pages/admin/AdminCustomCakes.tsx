import React, { useState, useEffect } from 'react';
import {
  Cake,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Eye,
  X,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  UserCheck
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { CustomCakeRequest, CakeRequestStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCustomCakes: React.FC = () => {
  const [requests, setRequests] = useState<CustomCakeRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Quote Editor
  const [selectedReq, setSelectedReq] = useState<CustomCakeRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState<number>(1000);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await api.customCakes.getAll({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error('Failed to load cake requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, searchQuery]);

  const openQuoteModal = (req: CustomCakeRequest) => {
    setSelectedReq(req);
    setQuotePrice(req.estimatedPrice || 1200);
    setAdminNote(req.adminNotes || '');
  };

  const handleUpdateStatusAndQuote = async (newStatus?: CakeRequestStatus) => {
    if (!selectedReq) return;
    setIsUpdating(true);
    const targetStatus = newStatus || selectedReq.status;

    try {
      const res = await api.customCakes.updateStatus(
        selectedReq.id,
        targetStatus,
        quotePrice,
        adminNote.trim()
      );
      if (res.success) {
        toast.success(`Cake Request '${selectedReq.id}' updated!`);
        fetchRequests();
        setSelectedReq(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-soft">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Custom Cake Bookings & Consultations
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Review custom flavors, inscription text, reference designs, and quote prices.
            </p>
          </div>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs px-3 py-1.5 rounded-xl font-bold">
            Total Inquiries: {requests.length}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-soft flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Request ID, Customer, Flavor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800"
            >
              <option value="All">All Inquiries</option>
              <option value="New">New Inquiries</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Accepted">Accepted</option>
              <option value="In Preparation">In Preparation</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Cake Details</th>
                  <th className="py-3 px-4">Required Date</th>
                  <th className="py-3 px-4">Inscription</th>
                  <th className="py-3 px-4 text-right">Quote</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">{req.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{req.customerName}</span>
                      <a href={`tel:${req.phone}`} className="text-stone-600 hover:text-amber-700 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {req.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-800 block">{req.cakeType}</span>
                      <span className="text-stone-500">{req.flavor} ({req.size.split('~')[0]})</span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {req.requiredDate} at {req.requiredTime}
                    </td>
                    <td className="py-3 px-4 text-stone-600 italic max-w-[180px] truncate">
                      "{req.cakeMessage || 'None'}"
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-stone-900">
                      {req.estimatedPrice ? `₹${req.estimatedPrice}` : <span className="text-stone-400 font-normal">Pending</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        req.status === 'Accepted' || req.status === 'In Preparation'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openQuoteModal(req)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Review & Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review / Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs" onClick={() => setSelectedReq(null)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-stone-200 space-y-6">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">Custom Cake Booking</span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">{selectedReq.id} - {selectedReq.customerName}</h3>
                <p className="text-xs text-stone-500">Phone: {selectedReq.phone} | Required: {selectedReq.requiredDate} ({selectedReq.requiredTime})</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cake Specifications */}
            <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-stone-400 font-bold block uppercase text-[10px]">Type & Flavor:</span>
                <p className="font-bold text-stone-900">{selectedReq.cakeType}</p>
                <p className="text-stone-700">{selectedReq.flavor}</p>
                <p className="text-stone-700">{selectedReq.size}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold block uppercase text-[10px]">Theme & Colors:</span>
                <p className="font-bold text-stone-900">{selectedReq.theme}</p>
                <p className="text-stone-700">{selectedReq.color}</p>
              </div>
            </div>

            {selectedReq.cakeMessage && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block text-[10px] uppercase">Message on Cake:</span>
                <p className="font-serif font-bold text-stone-900 text-sm italic">"{selectedReq.cakeMessage}"</p>
              </div>
            )}

            {selectedReq.referenceImage && (
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">Customer Reference Photo:</span>
                <img
                  src={selectedReq.referenceImage}
                  alt="Customer Reference"
                  className="w-48 h-48 object-cover rounded-2xl border border-stone-200 shadow-md"
                />
              </div>
            )}

            {selectedReq.requirements && (
              <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl">
                <strong>Dietary / Specific Instructions:</strong> {selectedReq.requirements}
              </div>
            )}

            {/* Price Quote & Notes Editor */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Set Price Quote (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={quotePrice}
                    onChange={e => setQuotePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Administrator Note to Customer</label>
                  <input
                    type="text"
                    placeholder="e.g. Confirmed with customer over phone"
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Status Action Buttons */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">Update Request Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Reviewing', 'Accepted', 'In Preparation', 'Completed', 'Rejected'] as CakeRequestStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatusAndQuote(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedReq.status === st
                          ? 'bg-stone-900 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatusAndQuote()}
                disabled={isUpdating}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-warm"
              >
                {isUpdating ? 'Saving...' : 'Save Quote & Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
