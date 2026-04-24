import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, type = 'fixed' }) => {
  const isCard = type === 'card';
  const isDrawer = type === 'drawer';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`${(isCard || isDrawer) ? 'absolute inset-0 z-[100]' : 'fixed inset-0 z-[300] flex items-center justify-center p-6'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className={`absolute inset-0 bg-black/40 ${(isCard || isDrawer) ? 'backdrop-blur-[2px]' : 'backdrop-blur-[4px]'}`}
          />
          <motion.div
            initial={(isCard || isDrawer) ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={(isCard || isDrawer) ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`relative bg-white flex flex-col items-center justify-center text-center shadow-2xl ${
              (isCard || isDrawer) 
                ? 'w-full h-full p-8 bg-white/95' 
                : 'w-full max-w-[280px] p-8 rounded-[24px] shadow-2xl space-y-6'
            }`}
          >
            <div className={`${(isCard || isDrawer) ? 'space-y-4 mb-8' : 'space-y-2'}`}>
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D5A27]">Confirmation</h3>
              <p className={`${(isCard || isDrawer) ? 'text-[12px]' : 'text-[11px]'} text-[#344E41]/60 font-medium leading-relaxed max-w-[200px]`}>{message}</p>
            </div>
            
            <div className={`flex ${(isCard || isDrawer) ? 'flex-col w-full gap-3 max-w-[200px]' : 'gap-2'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className={`${(isCard || isDrawer) ? 'w-full py-2 order-2' : 'flex-1 py-3'} text-[9px] font-black uppercase tracking-[0.2em] text-[#2D5A27]/40 hover:text-[#2D5A27] transition-all`}
              >
                Cancel
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onConfirm(); }}
                className={`${(isCard || isDrawer) ? 'w-full py-4 order-1' : 'flex-1 py-3'} bg-[#2D5A27] text-[#FEFAE0] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#2D5A27]/20 transition-all active:scale-95`}
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
