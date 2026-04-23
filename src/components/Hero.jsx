import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E9EDC9] rounded-lg text-[#2D5A27] text-xs font-bold uppercase tracking-wider">
            Premium Quality
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#2D5A27] leading-tight">
            Natural Snacks <br />
            <span className="text-[#A3B18A]">Perfectly Preserved.</span>
          </h1>
          <p className="text-lg text-[#344E41]/70 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            100% natural dried fruit snacks. Experience the real taste of tropical goodness in every bite.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-[#2D5A27] text-[#FEFAE0] px-8 py-4 rounded-xl font-bold hover:bg-[#344E41] transition-colors flex items-center justify-center gap-2">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="text-[#2D5A27] px-8 py-4 font-bold hover:underline">
              Our Story
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=1200" 
              alt="Natural Dried Fruits"
              className="w-full h-[400px] md:h-[450px] object-cover rounded-2xl shadow-xl transition-transform duration-700"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E9EDC9] rounded-lg flex items-center justify-center text-[#2D5A27]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Purity</p>
                  <p className="text-base font-bold text-[#2D5A27]">100% Organic</p>
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
