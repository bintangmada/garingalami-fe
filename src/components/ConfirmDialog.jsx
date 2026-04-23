import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white p-8 rounded-xl shadow-2xl max-w-xs w-full text-center space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2D5A27]">Confirmation</h3>
              <p className="text-xs text-[#344E41]/60 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 text-[9px] font-bold uppercase tracking-widest text-[#2D5A27]/40 hover:text-[#2D5A27] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-3 bg-[#2D5A27] text-[#FEFAE0] rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#344E41] transition-all"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
