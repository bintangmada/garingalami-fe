import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-10 p-2 text-[#2D5A27]/20 hover:text-[#2D5A27] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 aspect-square">
              <img 
                src={imageError ? fallbackImage : product.image} 
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-16 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-bold text-[#2D5A27]/30 uppercase tracking-[0.6em] mb-4">
                {product.category}
              </span>
              <h2 className="text-3xl font-black text-[#2D5A27] mb-8 uppercase tracking-[0.2em]">{product.name}</h2>
              <p className="text-[#344E41]/60 text-[13px] mb-12 leading-loose max-w-sm font-medium tracking-wide">
                {product.description}
              </p>

              <div className="mt-auto space-y-10 w-full flex flex-col items-center">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#2D5A27]/30 font-bold uppercase tracking-[0.4em] leading-none">Investment</p>
                  <p className="text-2xl font-black text-[#2D5A27] tracking-tighter">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full max-w-[240px] bg-[#2D5A27] text-[#FEFAE0] py-5 rounded-none text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-[#344E41] transition-all"
                >
                  Acquire
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
