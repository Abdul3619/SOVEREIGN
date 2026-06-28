import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Award, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  onBookClick: () => void;
  setView: (view: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, onBookClick, setView }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0c10] pt-12">
      {/* Background video & gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0c10]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover object-center opacity-50 select-none scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-room-with-a-double-bed-4180-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-lobby-of-a-luxury-hotel-4184-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/70 to-[#0a0c10]/40" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 bg-[#c5a880]/10 border border-[#c5a880]/20 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#c5a880]" />
          <span className="font-mono text-[10px] text-[#c5a880] tracking-[0.2em] uppercase font-semibold">
            Voted Top 10 Luxury Hotels Globally
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-4xl sm:text-6xl font-light italic tracking-tight text-white leading-[1.1] max-w-4xl"
        >
          {title}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-gray-200 text-base sm:text-lg font-light tracking-wide max-w-2xl mt-6 leading-relaxed italic opacity-90"
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <button
            onClick={onBookClick}
            className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] px-8 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#c5a880]/15 flex items-center justify-center gap-2"
            id="hero-book-btn"
          >
            Explore Suites & Book
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setView('about')}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase transition-colors"
            id="hero-story-btn"
          >
            Our Heritage Story
          </button>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-20 w-full border-t border-[#2d3139]/30 pt-10"
        >
          {[
            { icon: Award, label: 'Michelin Dining', desc: 'Savour fine culinary arts' },
            { icon: Compass, label: 'Butler Service', desc: 'Bespoke around-the-clock' },
            { icon: ShieldCheck, label: 'Elite Privacy', desc: 'Quiet gated estate security' },
            { icon: Sparkles, label: 'Royal Botanical Spa', desc: 'Curative hydrothermal pools' },
          ].map((feat, index) => (
            <div key={index} className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="bg-[#c5a880]/10 p-2.5 rounded-lg text-[#c5a880] mb-3">
                <feat.icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-bold text-gray-200 tracking-wide">{feat.label}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{feat.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
