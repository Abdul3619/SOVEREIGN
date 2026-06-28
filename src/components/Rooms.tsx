import React, { useState } from 'react';
import { RoomCategory } from '../types.ts';
import { Users, Wifi, Wind, Flame, Eye, Tv, Waves, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface RoomsProps {
  categories: RoomCategory[];
  onBookCategory: (category: RoomCategory) => void;
}

export const Rooms: React.FC<RoomsProps> = ({ categories, onBookCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);

  const getFeatureIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
      case 'High-Speed Wi-Fi':
        return <Wifi className="h-3.5 w-3.5 text-[#c5a880]" />;
      case 'Private Pool':
      case 'Infinity Plunge Pool':
      case 'Freestanding Tub':
        return <Waves className="h-3.5 w-3.5 text-[#c5a880]" />;
      case 'Marble Fireplace':
        return <Flame className="h-3.5 w-3.5 text-[#c5a880]" />;
      case 'Ocean View':
      case '360 Panoramic Views':
        return <Eye className="h-3.5 w-3.5 text-[#c5a880]" />;
      default:
        return <Wind className="h-3.5 w-3.5 text-[#c5a880]" />;
    }
  };

  return (
    <div className="bg-[#0a0c10] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#c5a880] block mb-2">Bespoke Living</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light italic tracking-tight text-[#1a1a1a]">
            Palatial Suites & Secluded Sanctuary Villas
          </h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Every suite is individually styled, utilizing timeless marble masonry, custom hand-carved millwork, and state-of-the-art residential comfort systems.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden flex flex-col hover:border-[#c5a880]/30 transition-all group"
            >
              {/* Image Gallery Header */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={cat.images[0]} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Price Tag Overlay */}
                <div className="absolute top-4 right-4 bg-[#0a0c10]/80 border border-[#c5a880]/30 backdrop-blur-md px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block">From</span>
                  <span className="text-lg font-bold text-[#c5a880] font-sans">
                    ${(cat.basePrice / 100).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400"> / night</span>
                </div>

                {/* Available Badge */}
                <div className="absolute top-4 left-4">
                  {cat.availableCount > 0 ? (
                    <span className="bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold backdrop-blur-md">
                      {cat.availableCount} Available Suites
                    </span>
                  ) : (
                    <span className="bg-red-500/15 text-red-400 border border-red-500/25 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold backdrop-blur-md">
                      Fully Booked
                    </span>
                  )}
                </div>
              </div>

              {/* Contents */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#c5a880] font-bold">Category ID: #{cat.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 font-sans group-hover:text-[#c5a880] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-3 leading-relaxed min-h-[64px]">
                    {cat.description}
                  </p>

                  {/* Room metadata info */}
                  <div className="flex items-center gap-6 mt-5 border-t border-b border-[#2d3139]/30 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#c5a880]" />
                      <span className="text-xs text-gray-300">Up to {cat.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#c5a880]" />
                      <span className="text-xs text-gray-300">Bespoke Butler Care</span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="mt-5">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 font-semibold">Premium Features</span>
                    <div className="flex flex-wrap gap-2">
                      {cat.amenities.map((amen, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 bg-[#1a1e27] text-gray-300 px-3 py-1.5 rounded-lg text-[10.5px] border border-[#2d3139]/20"
                        >
                          {getFeatureIcon(amen)}
                          {amen}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Seasonal pricing dropdown display */}
                  {cat.seasonalPricing && Object.keys(cat.seasonalPricing).length > 0 && (
                    <div className="mt-5 p-3.5 bg-[#191d26] border border-[#2d3139]/30 rounded-xl">
                      <span className="text-[10px] uppercase tracking-wider text-[#c5a880] block font-bold mb-2">Seasonal Pricing Estimator</span>
                      <div className="grid grid-cols-2 gap-2 divide-x divide-[#2d3139]/40">
                        {Object.entries(cat.seasonalPricing).map(([key, val]) => {
                          const value = val as { label: string; rate: number };
                          return (
                            <div key={key} className="px-2">
                              <span className="text-[10px] text-gray-400 block truncate">{value.label}</span>
                              <span className="font-sans text-xs font-bold text-gray-200 mt-0.5 block">${(value.rate / 100).toLocaleString()}/n</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={() => onBookCategory(cat)}
                    disabled={cat.availableCount === 0}
                    className={`flex-1 text-center py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                      cat.availableCount > 0 
                        ? 'bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] hover:opacity-95 active:scale-[0.98] shadow-lg shadow-[#c5a880]/5' 
                        : 'bg-[#1c1f26] text-gray-600 border border-gray-800 cursor-not-allowed'
                    }`}
                  >
                    {cat.availableCount > 0 ? 'Reserve Suite' : 'Fully Booked'}
                  </button>
                  <button 
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-[#1c202a] border border-[#2d3139] text-gray-300 hover:text-white px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-4xl w-full">
              <div className="p-6 border-b border-[#2d3139]/40 flex justify-between items-center bg-[#1c212a]">
                <h4 className="text-md font-bold text-[#c5a880]">{selectedCategory.name} Gallery</h4>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-white text-xs font-mono border border-[#2d3139] px-3 py-1 rounded-lg"
                >
                  Close
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory.images.map((img, idx) => (
                    <div key={idx} className="h-64 sm:h-80 rounded-xl overflow-hidden border border-[#2d3139]">
                      <img src={img} alt={`${selectedCategory.name} Image ${idx+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
