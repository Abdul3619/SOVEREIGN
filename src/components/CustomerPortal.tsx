import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Booking, Payment } from '../types.ts';
import { 
  Calendar, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, 
  FileText, Upload, RefreshCw, Smartphone, User, ArrowLeftRight
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { dbUser, token, notifications, fetchNotifications } = useAuth();
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [uploadingBooking, setUploadingBooking] = useState<Booking | null>(null);
  
  // Payment upload form
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [amountInput, setAmountInput] = useState('');
  const [receiptBase64, setReceiptBase64] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBookings = async () => {
    if (!token) return;
    setLoadingBookings(true);
    try {
      const response = await fetch('/api/user/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBookingsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const handleCancelBooking = async (id: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to cancel this reservation request?')) return;
    try {
      const response = await fetch(`/api/user/bookings/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        await fetchBookings();
        await fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !uploadingBooking || !receiptBase64) {
      setError('Please upload a payment confirmation image.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`/api/user/bookings/${uploadingBooking.id}/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiptUrl: receiptBase64,
          paymentMethod,
          amount: amountInput ? parseFloat(amountInput) * 100 : uploadingBooking.totalPrice,
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Receipt uploaded successfully! Accounting team will verify it shortly.');
        setReceiptBase64('');
        setAmountInput('');
        setTimeout(() => {
          setUploadingBooking(null);
          setSuccessMsg('');
          fetchBookings();
        }, 1500);
      } else {
        setError(data.error || 'Failed to submit payment receipt.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full text-[10.5px] font-semibold text-[#10b981] font-mono uppercase tracking-wider">Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10.5px] font-semibold text-amber-500 font-mono uppercase tracking-wider">Pending Pay</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10.5px] font-semibold text-red-400 font-mono uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full text-[10.5px] font-semibold text-gray-400 font-mono uppercase tracking-wider">Cancelled</span>;
    }
  };

  return (
    <div className="bg-[#0a0c10] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#2d3139]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-mono text-xs text-[#c5a880] tracking-widest block mb-1">MEMBERSHIP PORTAL</span>
            <h2 className="font-sans text-3xl font-bold text-white tracking-tight">Your Sovereign Residences</h2>
            <p className="text-gray-400 text-xs mt-1">Manage active suites, complete payment transfers, and monitor concierge logs.</p>
          </div>
          <button 
            onClick={fetchBookings}
            className="bg-[#161920] border border-[#2d3139] text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Reservations
          </button>
        </div>

        {/* Portal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#c5a880]" />
              Booking & Stay History
            </h3>

            {loadingBookings ? (
              <div className="text-center py-20 text-gray-500 text-sm">
                Loading secure sovereign files...
              </div>
            ) : bookingsList.length === 0 ? (
              <div className="bg-[#12141c] border border-[#2d3139]/30 rounded-2xl p-12 text-center">
                <p className="text-sm text-gray-400">You have no reservations on file.</p>
                <p className="text-xs text-gray-500 mt-2">Explore our list of luxury suites and schedule your escape!</p>
              </div>
            ) : (
              bookingsList.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#12141c] border border-[#2d3139]/30 rounded-2xl overflow-hidden hover:border-[#c5a880]/20 transition-all"
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-6">
                    {/* Image block */}
                    <div className="w-full sm:w-44 h-28 sm:h-auto rounded-xl overflow-hidden border border-[#2d3139]/40 flex-shrink-0">
                      <img src={item.room?.category?.images[0]} alt="Suite Thumbnail" className="w-full h-full object-cover" />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[9px] font-bold text-[#c5a880] tracking-wider uppercase">
                            RESERVATION #{item.id} &bull; Room {item.room?.roomNumber} ({item.room?.floor})
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <h4 className="text-lg font-bold text-gray-100 font-sans">
                          {item.room?.category?.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-[#191d26]/40 p-3 rounded-xl border border-[#2d3139]/10">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold block">Check-In</span>
                            <span className="text-xs font-medium text-gray-200 mt-0.5 block">{item.checkIn}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold block">Check-Out</span>
                            <span className="text-xs font-medium text-gray-200 mt-0.5 block">{item.checkOut}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t border-[#2d3139]/20 pt-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Total Price:</span>
                          <span className="text-sm font-bold text-[#c5a880] font-sans">
                            ${(item.totalPrice / 100).toLocaleString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setUploadingBooking(item)}
                                className="bg-[#c5a880]/10 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 text-[#c5a880] px-3.5 py-2 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-colors"
                              >
                                Upload Pay Receipt
                              </button>
                              <button
                                onClick={() => handleCancelBooking(item.id)}
                                className="text-red-400 hover:text-red-300 border border-red-500/10 hover:bg-red-500/5 px-3.5 py-2 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-colors"
                              >
                                Cancel Request
                              </button>
                            </>
                          )}
                          
                          {item.status === 'approved' && (
                            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" /> Ready for Arrival
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            
            {/* Bank details to make manual transfer */}
            <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#c5a880]" />
                Direct Settlement Desk
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                To confirm your reservation request, transfer the invoice amount directly to our secure bank desk.
              </p>
              <div className="space-y-3 bg-[#191d26]/60 p-4 rounded-xl border border-[#2d3139]/30 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans">Bank Institution</span>
                  <span className="text-gray-200 font-bold block">Goldman Sovereign Ltd, Monaco</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans">Swift / BIC Code</span>
                  <span className="text-gray-200 block">SOVRMC33XXX</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans">Account IBAN</span>
                  <span className="text-gray-200 font-bold block">MC33 9005 1004 5555 8011 20</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans">Reference Mandate</span>
                  <span className="text-[#c5a880] font-bold block">SOVEREIGN-BOOK-[BOOKING_ID]</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Message Log */}
            <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#c5a880]" />
                Simulated Notification logs
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-4 uppercase font-bold">
                Trace email and whatsapp dispatches:
              </p>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-[11px] leading-relaxed">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-600">No logs sent.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-[#181a22] rounded-xl border border-[#2d3139]/30">
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${
                          n.type === 'email' ? 'text-blue-400' : n.type === 'whatsapp' ? 'text-emerald-400' : 'text-[#c5a880]'
                        }`}>{n.type} LOG</span>
                        <span className="text-[9px] text-gray-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-300 mt-1 font-mono">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Upload Payment Modal */}
      {uploadingBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] p-5 text-[#0f1115]">
              <h4 className="text-sm font-bold uppercase tracking-wider">Upload Settlement Receipt</h4>
              <p className="text-[11px] opacity-90 mt-1">Submit confirmation copy for Booking #{uploadingBooking.id}</p>
            </div>
            
            <form onSubmit={handleUploadPayment} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer / Swift</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Crypto">Crypto (USDT/BTC)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Settled Amount ($)</label>
                <input 
                  type="number"
                  placeholder={`Default: $${(uploadingBooking.totalPrice / 100).toFixed(2)}`}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-bold">Receipt Copy / Screenshot</label>
                <div className="border-2 border-dashed border-[#2d3139] rounded-xl p-6 text-center hover:border-[#c5a880]/50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {receiptBase64 ? (
                    <div className="space-y-2">
                      <img src={receiptBase64} alt="Receipt Preview" className="mx-auto max-h-32 object-contain rounded" />
                      <span className="text-[10px] text-emerald-400 block font-bold">Image loaded successfully!</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="h-8 w-8 text-[#c5a880] mx-auto mb-2" />
                      <span className="text-xs text-gray-400 block">Drag/Drop receipt image or click to select</span>
                      <span className="text-[10px] text-gray-500 block">JPEG, PNG files</span>
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="text-xs text-red-400 bg-red-500/10 p-2.5 border border-red-500/20 rounded-xl">{error}</div>}
              {successMsg && <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 border border-[#10b981]/20 rounded-xl">{successMsg}</div>}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setUploadingBooking(null)}
                  className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !receiptBase64}
                  className="flex-1 bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] py-2.5 rounded-xl text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                  {isUploading ? 'Uploading...' : 'Submit Receipt'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
