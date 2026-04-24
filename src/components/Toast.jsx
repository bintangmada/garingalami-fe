import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toast } = useCart();

  return (
    <AnimatePresence mode="wait">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] bg-[#2D5A27] text-[#FEFAE0] px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(45,90,39,0.3)] flex items-center gap-4 border border-[#FEFAE0]/10 whitespace-nowrap"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 bg-[#FEFAE0] rounded-full shrink-0" 
          />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
