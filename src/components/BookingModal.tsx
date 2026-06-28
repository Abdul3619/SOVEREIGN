import React, { useState } from 'react';
import { RoomCategory } from '../types.ts';
import { Calendar, Users, FileText, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface BookingModalProps {
  category: RoomCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ category, onClose, onSuccess }) => {
  const { token, dbUser, login } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!category) return null;

  // Compute stay price
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return category.basePrice;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = date2.getTime() - date1.getTime();
    if (diffTime <= 0) return category.basePrice;
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return category.basePrice * diffNights;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must log in before completing a reservation.');
      return;
    }

    if (!checkIn || !checkOut) {
      setError('Please select valid check-in and check-out dates.');
      return;
    }

    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (d2.getTime() <= d1.getTime()) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/user/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId: category.id,
          checkIn,
          checkOut,
          guestsCount,
          specialRequests
        })
      });

      const data = await response.json();
      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to submit booking reservation.');
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl relative">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] p-5 text-[#0f1115] relative">
          <h3 className="text-lg font-bold uppercase tracking-wider font-sans">Bespoke Suite Reservation</h3>
          <p className="text-xs opacity-90 mt-1">Book your absolute sanctuary in {category.name}</p>
        </div>

        {/* Content form */}
        <div className="p-6">
          {!dbUser ? (
            <div className="text-center py-10">
              <ShieldAlert className="h-12 w-12 text-[#c5a880] mx-auto mb-4" />
              <h4 className="text-md font-semibold text-gray-200">Authentication Required</h4>
              <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                To process reservation records and generate proper secure invoices, you must sign in via your secure Google Account profile.
              </p>
              <button
                onClick={login}
                className="mt-6 bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-transform hover:scale-102"
              >
                Sign In with Google
              </button>
              <button 
                onClick={onClose}
                className="block text-xs text-gray-500 hover:text-gray-300 mx-auto mt-4"
              >
                Go Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-semibold">Check-In Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 px-3.5 py-3 rounded-xl text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-semibold">Check-Out Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 px-3.5 py-3 rounded-xl text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-semibold">Number of Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 px-3.5 py-3 rounded-xl text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none"
                >
                  {Array.from({ length: category.capacity }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-semibold">Special Requests (Optional)</label>
                <textarea
                  placeholder="E.g., high floor, feather-free pillows, airport transfer request..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 p-3.5 rounded-xl text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none resize-none leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Price Calculation Display */}
              <div className="bg-[#181a22] border border-[#2d3139]/40 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Estimated Price</span>
                  <span className="text-[10px] text-[#c5a880] font-mono mt-0.5 block">
                    ${(category.basePrice/100).toLocaleString()} x nights
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white font-sans block">
                    ${(calculateTotal() / 100).toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Unpaid Invoice Draft</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a880]/10"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Reservation'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
