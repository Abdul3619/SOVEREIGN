import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { Rooms } from './components/Rooms.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { CustomerPortal } from './components/CustomerPortal.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { 
  ServicesView, GalleryView, AboutView, ContactView, FAQsView, FooterView 
} from './components/Pages.tsx';
import { RoomCategory, CMSConfig } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Hotel, HelpCircle, Activity } from 'lucide-react';

function AppContent() {
  const { dbUser } = useAuth();
  const [currentView, setView] = useState('landing');
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [cms, setCms] = useState<CMSConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Active reservation modal state
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);

  const fetchAppData = async () => {
    setLoading(true);
    try {
      // Load room categories
      const catRes = await fetch('/api/rooms');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }

      // Load CMS configuration
      const cmsRes = await fetch('/api/cms');
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        setCms(cmsData);
      }
    } catch (err) {
      console.error('Error loading hotel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handleBookCategory = (category: RoomCategory) => {
    setSelectedCategory(category);
  };

  const handleBookingSuccess = () => {
    setSelectedCategory(null);
    alert('Sovereign stay requested! Access your member portal to settle direct payments.');
    setView('portal');
  };

  // Guard routing for admin views
  const isAdmin = ['super_admin', 'hotel_manager', 'receptionist', 'accountant'].includes(dbUser?.role?.name || '');
  const renderView = () => {
    if (currentView === 'admin' && !isAdmin) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0a0c10] text-center p-8">
          <h2 className="text-xl font-bold text-red-400">Unauthorized Desk Access</h2>
          <p className="text-gray-400 text-xs mt-2 max-w-sm">Your security token lacks clearance to manage sovereign assets.</p>
          <button onClick={() => setView('landing')} className="mt-6 bg-[#c5a880] text-[#0f1115] px-6 py-2 rounded-xl text-xs font-bold uppercase">
            Return to Grand Lobby
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'portal':
        return <CustomerPortal />;
      case 'admin':
        return <Dashboard />;
      case 'rooms':
        return <Rooms categories={categories} onBookCategory={handleBookCategory} />;
      case 'services':
        return <ServicesView />;
      case 'gallery':
        return <GalleryView />;
      case 'about':
        return cms ? <AboutView story={cms.hotelStory} /> : null;
      case 'contact':
        return <ContactView cms={cms} />;
      default:
        // Default landing page sequence
        return (
          <>
            {cms && (
              <Hero 
                title={cms.heroTitle} 
                subtitle={cms.heroSubtitle} 
                onBookClick={() => setView('rooms')}
                setView={setView}
              />
            )}
            
            {/* Short Rooms Teaser */}
            <div className="bg-[#0f1115] py-20 border-t border-[#2d3139]/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c5a880] block mb-2">Exquisite Living</span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">The Grand Collections</h3>
                  </div>
                  <button 
                    onClick={() => setView('rooms')}
                    className="text-xs text-[#c5a880] hover:text-[#e6d5b8] font-mono tracking-widest uppercase flex items-center gap-1.5 border-b border-[#c5a880]/30 pb-1"
                  >
                    View All Suite Categories &rarr;
                  </button>
                </div>
                <Rooms categories={categories.slice(0, 2)} onBookCategory={handleBookCategory} />
              </div>
            </div>

            {/* Quick Services Preview */}
            <ServicesView />

            {/* FAQs */}
            {cms && <FAQsView faqs={cms.faqs} />}
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center gap-6 px-6" role="status" aria-label="Loading">
        <Sparkles className="h-6 w-6 text-[#c5a880] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
        <div className="skeleton h-4 w-64 max-w-full" />
        <div className="skeleton h-3 w-48 max-w-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#f5f2ed] min-h-screen text-[#1a1a1a] antialiased font-sans select-text selection:bg-[#c5a059]/30 selection:text-[#1a1a1a]">
      
      {/* Dynamic Header */}
      {currentView !== 'admin' && <Navbar currentView={currentView} setView={setView} />}

      {/* Main Viewport Content */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      {currentView !== 'admin' && <FooterView />}

      {/* Booking Form Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <BookingModal 
            category={selectedCategory} 
            onClose={() => setSelectedCategory(null)} 
            onSuccess={handleBookingSuccess}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
