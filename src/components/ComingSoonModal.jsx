import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const ComingSoonModal = ({ isOpen, onClose, title }) => {
  // Use the generated illustration
  const illustration = "https://images.unsplash.com/photo-1543158023-74591a78440c?auto=format&fit=crop&q=80&w=1200"; // Fallback to a high-end food photography
  // Since we just generated an image, I'll use the path provided in the previous turn
  const generatedImg = "/Users/bintangsuharsono/.gemini/antigravity/brain/73caa129-3bdd-4de5-8bab-90a9e3ce6f07/coming_soon_illustration_1778042126995.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/98 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 relative bg-[#F9F9F9]">
              <img 
                src={generatedImg} 
                alt="Coming Soon" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center items-start text-left space-y-8">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-[#2D5A27]/20 hover:text-[#2D5A27] transition-all"
              >
                <X size={24} strokeWidth={1} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#2D5A27]/40">
                  <Sparkles size={16} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Feature Under Curation</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#2D5A27] leading-tight">
                  {title || 'Coming Soon'}
                </h2>
              </div>

              <div className="w-12 h-px bg-[#2D5A27]/20" />

              <p className="text-sm leading-relaxed tracking-wide text-[#2D5A27]/60 font-medium max-w-xs">
                We are currently perfecting this experience. Our artisans are working to ensure every detail meets the Garing Alami standard of excellence.
              </p>

              <div className="pt-8 w-full">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-[#2D5A27] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#1A3A16] transition-all shadow-xl shadow-[#2D5A27]/10"
                >
                  Return to Atelier
                </button>
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2D5A27]/20 w-full text-center md:text-left">
                Estimated Launch: Summer 2026
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
