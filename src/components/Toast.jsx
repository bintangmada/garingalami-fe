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
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#2D5A27] text-white px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap"
        >
          <CheckCircle className="w-5 h-5 text-[#A3B18A]" />
          <span className="font-bold">{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
