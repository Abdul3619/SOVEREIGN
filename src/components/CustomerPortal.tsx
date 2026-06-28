import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f5f2ed] min-h-screen py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#d9d5ce] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <span className="font-mono text-[10px] text-[#c5a059] font-bold tracking-widest block mb-1">MEMBERSHIP PORTAL</span>
            <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] tracking-tight">Your Sovereign Residences</h2>
            <p className="text-gray-500 text-xs mt-1">Manage active suites, complete payment transfers, and monitor concierge logs.</p>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBookings}
            className="bg-white border border-[#d9d5ce] text-gray-700 hover:text-black px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Reservations
          </motion.button>
        </div>

        {/* Portal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold tracking-wider text-[#1a1a1a] font-serif uppercase mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#c5a059]" />
              Booking & Stay History
            </h3>

            {loadingBookings ? (
              <div className="text-center py-20 text-gray-500 text-sm font-mono">
                Loading secure sovereign files...
              </div>
            ) : bookingsList.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#d9d5ce] rounded-2xl p-12 text-center"
              >
                <p className="text-sm text-[#1a1a1a] font-semibold">You have no reservations on file.</p>
                <p className="text-xs text-gray-500 mt-2">Explore our list of luxury suites and schedule your escape!</p>
              </motion.div>
            ) : (
              bookingsList.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.id}
                  className="bg-white border border-[#d9d5ce] rounded-2xl overflow-hidden hover:border-[#c5a059]/40 hover:shadow-xl transition-all"
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-6">
                    {/* Image block */}
                    <div className="w-full sm:w-44 h-28 sm:h-auto rounded-xl overflow-hidden border border-[#d9d5ce] flex-shrink-0">
                      <img src={item.room?.category?.images[0]} alt="Suite Thumbnail" className="w-full h-full object-cover" />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[9px] font-bold text-[#c5a059] tracking-wider uppercase">
                            RESERVATION #{item.id} &bull; Room {item.room?.roomNumber} ({item.room?.floor})
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <h4 className="text-lg font-bold text-[#1a1a1a] font-serif">
                          {item.room?.category?.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-3 rounded-xl border border-[#d9d5ce]">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Check-In</span>
                            <span className="text-xs font-semibold text-[#1a1a1a] mt-0.5 block">{item.checkIn}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Check-Out</span>
                            <span className="text-xs font-semibold text-[#1a1a1a] mt-0.5 block">{item.checkOut}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t border-[#d9d5ce] pt-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 font-medium">Total Price:</span>
                          <span className="text-sm font-bold text-[#1a1a1a] font-sans">
                            ${(item.totalPrice / 100).toLocaleString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {item.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setUploadingBooking(item)}
                                className="bg-[#c5a059]/10 border border-[#c5a059]/30 hover:bg-[#c5a059]/20 text-[#c5a059] px-3.5 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-colors"
                              >
                                Upload Pay Receipt
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCancelBooking(item.id)}
                                className="text-red-500 hover:text-red-600 border border-red-500/20 hover:bg-red-50 px-3.5 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-colors"
                              >
                                Cancel Request
                              </motion.button>
                            </>
                          )}
                          
                          {item.status === 'approved' && (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" /> Ready for Arrival
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            
            {/* Bank details to make manual transfer */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-[#d9d5ce] rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#c5a059]" />
                Direct Settlement Desk
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4 font-medium">
                To confirm your reservation request, transfer the invoice amount directly to our secure bank desk.
              </p>
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-[#d9d5ce] font-mono text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans font-bold">Bank Institution</span>
                  <span className="text-[#1a1a1a] font-bold block">Goldman Sovereign Ltd, Monaco</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans font-bold">Swift / BIC Code</span>
                  <span className="text-[#1a1a1a] block">SOVRMC33XXX</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans font-bold">Account IBAN</span>
                  <span className="text-[#1a1a1a] font-bold block">MC33 9005 1004 5555 8011 20</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans font-bold">Reference Mandate</span>
                  <span className="text-[#c5a059] font-bold block">SOVEREIGN-BOOK-[BOOKING_ID]</span>
                </div>
              </div>
            </motion.div>

            {/* Simulated Live Message Log */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-[#d9d5ce] rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#c5a059]" />
                Simulated Notification logs
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-4 uppercase font-bold">
                Trace email and whatsapp dispatches:
              </p>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-[11px] leading-relaxed">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 font-medium">No logs sent.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-[#d9d5ce]">
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${
                          n.type === 'email' ? 'text-blue-600' : n.type === 'whatsapp' ? 'text-emerald-600' : 'text-[#c5a059]'
                        }`}>{n.type} LOG</span>
                        <span className="text-[9px] text-gray-500 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-700 mt-1 font-mono">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

          </div>

        </div>

      </div>

      {/* Upload Payment Modal */}
      <AnimatePresence>
      {uploadingBooking && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-[#d9d5ce] rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
          >
            <div className="bg-[#fcfbfa] border-b border-[#d9d5ce] p-5 text-[#1a1a1a]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#c5a059]">Upload Settlement Receipt</h4>
              <p className="text-[11px] text-gray-500 font-medium mt-1">Submit confirmation copy for Booking #{uploadingBooking.id}</p>
            </div>
            
            <form onSubmit={handleUploadPayment} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1 font-bold">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-[#d9d5ce] text-[#1a1a1a] px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a059] transition-colors"
                >
                  <option value="Bank Transfer">Bank Transfer / Swift</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Crypto">Crypto (USDT/BTC)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1 font-bold">Settled Amount ($)</label>
                <input 
                  type="number"
                  placeholder={`Default: $${(uploadingBooking.totalPrice / 100).toFixed(2)}`}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-white border border-[#d9d5ce] text-[#1a1a1a] px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1.5 font-bold">Receipt Copy / Screenshot</label>
                <div className="border-2 border-dashed border-[#d9d5ce] bg-gray-50 rounded-xl p-6 text-center hover:border-[#c5a059]/50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {receiptBase64 ? (
                    <div className="space-y-2">
                      <img src={receiptBase64} alt="Receipt Preview" className="mx-auto max-h-32 object-contain rounded shadow-sm border border-[#d9d5ce]" />
                      <span className="text-[10px] text-emerald-600 block font-bold">Image loaded successfully!</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="h-8 w-8 text-[#c5a059] mx-auto mb-2" />
                      <span className="text-xs text-gray-500 font-medium block">Drag/Drop receipt image or click to select</span>
                      <span className="text-[10px] text-gray-400 block font-bold">JPEG, PNG files</span>
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="text-xs text-red-600 bg-red-50 p-2.5 border border-red-100 rounded-xl font-medium">{error}</div>}
              {successMsg && <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 border border-emerald-100 rounded-xl font-medium">{successMsg}</div>}

              <div className="flex gap-2 pt-4 border-t border-[#d9d5ce]">
                <button
                  type="button"
                  onClick={() => setUploadingBooking(null)}
                  className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !receiptBase64}
                  className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Submit Receipt'}
                </button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </motion.div>
  );
};
