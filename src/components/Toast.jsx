import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-24 left-6 right-6 md:top-32 md:right-8 md:left-auto md:w-auto z-[200] bg-[#2D5A27]/95 backdrop-blur-md text-[#FEFAE0] px-8 py-5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center md:justify-start gap-4 border border-[#FEFAE0]/10"
        >
          <div className="w-1.5 h-1.5 bg-[#FEFAE0] rounded-full shrink-0 animate-pulse"></div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-center md:text-left leading-loose">{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
