import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, type = 'fixed' }) => {
  const getContainerClass = () => {
    if (type === 'drawer') return 'fixed inset-y-0 right-0 w-full max-w-sm';
    if (type === 'relative') return 'absolute inset-0 z-[50]';
    return 'fixed inset-0';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white w-full max-w-[280px] p-8 rounded-[24px] shadow-2xl space-y-6 text-center"
          >
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D5A27]">Confirmation</h3>
              <p className="text-[11px] text-[#344E41]/60 font-medium leading-relaxed">{message}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#2D5A27]/40 hover:text-[#2D5A27] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-3 bg-[#2D5A27] text-[#FEFAE0] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#2D5A27]/20 transition-all active:scale-95"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
