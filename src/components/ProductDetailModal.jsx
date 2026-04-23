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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-[#FEFAE0] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
            >
              <X className="w-6 h-6 text-[#2D5A27]" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 h-[300px] md:h-auto relative">
              <img 
                src={imageError ? fallbackImage : product.image} 
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="px-3 py-1 bg-[#E9EDC9] text-[#2D5A27] rounded-full text-xs font-bold tracking-wider uppercase">
                  {product.category}
                </span>
              </div>
              <h2 className="text-4xl font-black text-[#2D5A27] mb-4">{product.name}</h2>
              <p className="text-[#344E41] text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A3B18A]/20 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-[#2D5A27]" />
                  </div>
                  <span className="text-sm font-medium text-[#2D5A27]">100% Organic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A3B18A]/20 rounded-xl">
                    <Leaf className="w-5 h-5 text-[#2D5A27]" />
                  </div>
                  <span className="text-sm font-medium text-[#2D5A27]">Preservative Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A3B18A]/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-[#2D5A27]" />
                  </div>
                  <span className="text-sm font-medium text-[#2D5A27]">{product.nutrition}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Price</p>
                  <span className="text-3xl font-black text-[#2D5A27]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="flex-1 bg-[#2D5A27] text-white py-5 rounded-2xl font-bold text-lg hover-premium flex items-center justify-center gap-3 shadow-lg shadow-[#2D5A27]/20"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
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
