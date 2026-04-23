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
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#2D5A27] text-[#FEFAE0] px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
