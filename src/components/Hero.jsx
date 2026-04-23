import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E9EDC9] rounded-full text-[#2D5A27] text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            New Season Arrival
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-[#2D5A27] leading-[1.1]">
            Locked by <span className="text-[#A3B18A] relative">Nature
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#E9EDC9]/60" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>, Delivered to You.
          </h1>
          <p className="text-xl text-[#344E41]/80 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            Premium, healthy, and 100% natural dried fruit snacks. Experience the real taste of tropical goodness in every bite.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2D5A27] text-[#FEFAE0] px-10 py-5 rounded-[2rem] font-bold text-xl hover-premium flex items-center justify-center gap-3 shadow-2xl shadow-[#2D5A27]/30"
            >
              Shop Collection
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#2D5A27]/20 text-[#2D5A27] px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-500"
            >
              Our Story
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="absolute -z-10 w-80 h-80 bg-[#E9EDC9] rounded-full blur-[100px] top-0 right-0 animate-pulse" />
          <div className="absolute -z-10 w-64 h-64 bg-[#A3B18A]/30 rounded-full blur-[80px] bottom-0 left-0" />
          
          <div className="relative group">
            <div className="absolute inset-0 bg-[#2D5A27] rounded-[3rem] rotate-6 group-hover:rotate-0 transition-transform duration-700 opacity-10" />
            <img 
              src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=1200" 
              alt="Natural Dried Fruits"
              className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] relative z-10"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl z-20 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E9EDC9] rounded-xl flex items-center justify-center text-[#2D5A27]">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Quality</p>
                  <p className="text-lg font-black text-[#2D5A27]">100% Organic</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
