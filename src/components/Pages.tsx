import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Utensils, Wine, Shirt, Calendar, HeartPulse, Activity,
  Phone, Mail, MapPin, Send, HelpCircle, ChevronRight, Clock,
  ArrowRight
} from 'lucide-react';
import { Service, GalleryItem, CMSConfig } from '../types.ts';

// 1. --- SERVICES COMPONENT ---
export const ServicesView: React.FC = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServicesList(data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchServices();
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="h-6 w-6 text-[#c5a059]" />;
      case 'Wine': return <Wine className="h-6 w-6 text-[#c5a059]" />;
      case 'HeartPulse': return <HeartPulse className="h-6 w-6 text-[#c5a059]" />;
      case 'Shirt': return <Shirt className="h-6 w-6 text-[#c5a059]" />;
      case 'Calendar': return <Calendar className="h-6 w-6 text-[#c5a059]" />;
      default: return <Activity className="h-6 w-6 text-[#c5a059]" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f5f2ed] py-16 min-h-[90vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c5a059] block mb-2">Bespoke Guest Privileges</span>
          <h2 className="text-3xl sm:text-4xl font-light italic tracking-tight text-[#1a1a1a] font-serif">
            Curated Services for Refined Living
          </h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            The Sovereign Grand goes beyond standard accommodations to provide tailored butler care, Michelin-starred gastronomy, and curative botanical therapies.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500 font-mono text-xs">Loading premium guest features...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((srv, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={srv.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-[#d9d5ce] p-6 rounded-2xl flex flex-col justify-between hover:border-[#c5a059]/50 hover:shadow-xl hover:shadow-[#c5a059]/5 transition-all group cursor-pointer"
              >
                <div>
                  <div className="bg-[#f5f2ed] p-3 rounded-xl border border-[#d9d5ce] inline-block mb-5 group-hover:scale-105 group-hover:bg-[#c5a059]/10 transition-transform">
                    {getServiceIcon(srv.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] font-serif group-hover:text-[#c5a059] transition-colors">{srv.name}</h3>
                  <p className="text-gray-500 text-xs mt-3 leading-relaxed">{srv.description}</p>
                </div>

                <div className="border-t border-[#d9d5ce] pt-4 mt-6 flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-mono text-[10px]">ESTIMATED RATE</span>
                  <span className="text-[#1a1a1a] font-bold">
                    {srv.price > 0 ? `From $${(srv.price / 100).toLocaleString()}` : 'Complimentary'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};


// 2. --- GALLERY VIEW ---
export const GalleryView: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchGallery();
  }, []);

  const filteredItems = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f5f2ed] py-16 min-h-[90vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c5a059] block mb-2">Visual Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-light italic tracking-tight text-[#1a1a1a] font-serif">
            Captivating Views of The Sovereign
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'rooms', label: 'Suites & Villas' },
            { id: 'restaurant', label: 'Fine Dining' },
            { id: 'spa', label: 'Botanical Spa' },
            { id: 'exterior', label: 'Gardens & Pools' }
          ].map(btn => (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                filter === btn.id 
                  ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' 
                  : 'text-gray-500 bg-white hover:text-black border border-[#d9d5ce]'
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-500 font-mono text-xs">Loading visual portfolio...</div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group relative h-72 rounded-2xl overflow-hidden border border-[#d9d5ce] bg-white cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="w-full"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059] font-bold block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white font-serif">{item.title}</h4>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};


// 3. --- ABOUT US VIEW ---
interface AboutProps {
  story: string;
}

export const AboutView: React.FC<AboutProps> = ({ story }) => {
  return (
    <div className="bg-[#0a0c10] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block">The Heritage Legacy</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-sans leading-tight">
              A Century of Discretion and Timeless Splendour
            </h2>
            <p className="text-gray-300 text-xs leading-relaxed">
              {story}
            </p>
          </div>

          <div className="h-[450px] rounded-2xl overflow-hidden border border-[#2d3139]/40 relative">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80" 
              alt="Sovereign Historical Facade" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-[#0a0c10]/95 border border-[#c5a880]/30 backdrop-blur-md p-6 rounded-xl max-w-sm">
              <span className="font-serif text-3xl font-bold text-[#c5a880] block">1924</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block mt-1">FOUNDATION DATE</span>
              <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">Rigidly adhering to Swiss service protocols and absolute diplomatic discretion.</p>
            </div>
          </div>
        </div>

        {/* Staff Team Section */}
        <div className="mt-24 border-t border-[#2d3139]/20 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block mb-2">Our Wardens</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Meet the Curators of Splendour</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: 'Jean-Laurent Dupere', role: 'General Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
              { name: 'Lady Eleanor Stirling', role: 'Head of Bespoke Concierge', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
              { name: 'Chef de Cuisine Marcus Vane', role: 'Culinary Director', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80' }
            ].map((team, idx) => (
              <div key={idx} className="bg-[#12141c] border border-[#2d3139]/30 rounded-2xl overflow-hidden text-center hover:border-[#c5a880]/20 transition-all p-6">
                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-[#c5a880]/30 mx-auto mb-4">
                  <img src={team.img} alt={team.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-md font-bold text-gray-100">{team.name}</h4>
                <p className="font-mono text-[10px] text-[#c5a880] uppercase tracking-wider mt-1">{team.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


// 4. --- CONTACT & MAP VIEW ---
interface ContactProps {
  cms: CMSConfig | null;
}

export const ContactView: React.FC<ContactProps> = ({ cms }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess('Thank you! Your message has been safely delivered to our private concierge desk.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError('Failed to deliver message. Please call our desk.');
      }
    } catch (err) {
      setError('A connection error occurred.');
    } finally {
      setSending(false);
    }
  };

  if (!cms) return null;

  return (
    <div className="bg-[#0a0c10] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block">Private Registry desk</span>
              <h2 className="text-3xl font-bold text-white font-sans mt-2">Reach The Sovereign Concierge</h2>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                Whether organizing a private helicopter charter, booking our presidential terrace, or planning bespoke dining courses, our desk is here to assist around the clock.
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-start gap-4 p-4 bg-[#12141c] border border-[#2d3139]/40 rounded-xl">
                <MapPin className="h-5 w-5 text-[#c5a880] mt-0.5" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Estate Address</span>
                  <p className="text-gray-200 mt-1">{cms.contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#12141c] border border-[#2d3139]/40 rounded-xl">
                <Phone className="h-5 w-5 text-[#c5a880] mt-0.5" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Direct Hotline</span>
                  <p className="text-gray-200 mt-1">{cms.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#12141c] border border-[#2d3139]/40 rounded-xl">
                <Mail className="h-5 w-5 text-[#c5a880] mt-0.5" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">General Registry</span>
                  <p className="text-gray-200 mt-1">{cms.contactInfo.email}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration button */}
            <div>
              <a 
                href={`https://wa.me/${cms.contactInfo.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#10b981] hover:bg-[#059669] text-[#0f1115] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#10b981]/15"
              >
                <Phone className="h-4 w-4" />
                Direct WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#12141c] border border-[#2d3139]/40 p-8 rounded-2xl">
            <h3 className="text-md font-bold text-gray-200 uppercase tracking-widest mb-6">Concierge Inquiry Form</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Your Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Email Address</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Subject</label>
                <input 
                  type="text" required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Mobile / Phone (Optional)</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Your Message Inquiry</label>
                <textarea 
                  rows={4} required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 p-3.5 rounded-xl text-xs outline-none focus:border-[#c5a880] resize-none"
                />
              </div>

              {success && <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 border border-[#10b981]/20 rounded-xl">{success}</div>}
              {error && <div className="text-xs text-red-400 bg-red-500/10 p-2.5 border border-red-500/20 rounded-xl">{error}</div>}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Delivering...' : 'Deliver Inquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Integration iframe */}
        <div className="mt-16 border-t border-[#2d3139]/20 pt-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block mb-4 text-center">Interactive Estate Coordinates</span>
          <div className="h-96 rounded-2xl overflow-hidden border border-[#2d3139]/40">
            <iframe 
              src={cms.contactInfo.googleMapEmbed}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer"
              title="Google Map of Sovereign Grand Hotel"
            />
          </div>
        </div>

      </div>
    </div>
  );
};


// 5. --- FAQS SECTION ---
interface FAQsProps {
  faqs: { q: string; a: string }[];
}

export const FAQsView: React.FC<FAQsProps> = ({ faqs }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="bg-[#0a0c10] py-16 border-t border-[#2d3139]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block mb-2">Helpful Inquiries</span>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#12141c] border border-[#2d3139]/40 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center text-xs font-semibold text-gray-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`h-4 w-4 text-[#c5a880] transition-transform ${openIdx === idx ? 'rotate-90' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="p-5 border-t border-[#2d3139]/20 text-[11px] text-gray-400 leading-relaxed bg-[#191d26]/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// 6. --- FOOTER ---
export const FooterView: React.FC = () => {
  return (
    <footer className="bg-[#08090d] border-t border-[#2d3139]/40 py-12 text-center text-xs text-gray-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <span className="text-xs uppercase tracking-[0.2em] text-[#c5a880] block font-bold">THE SOVEREIGN GRAND ESTATE</span>
        <p className="max-w-md mx-auto text-[11px] text-gray-400">Blended marble architecture, Swiss protocol service care, and private Riviera sanctuaries designed for elite quiet travel.</p>
        <p className="pt-6 border-t border-[#2d3139]/10 text-[10px] text-gray-600 font-mono uppercase tracking-widest">&copy; 2026 Sovereign Grand Hotel & Spa Monaco. All Rights Reserved.</p>
        <p className="text-[11px] text-gray-500">
          Built by Abdulwahab Abdullahi ·{' '}
          <a href="mailto:abdulwahababdullahi3619@gmail.com" className="text-[#c5a880] hover:underline">Contact the developer</a>
        </p>
      </div>
    </footer>
  );
};
