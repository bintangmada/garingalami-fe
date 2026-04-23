import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';
import ConfirmDialog from './ConfirmDialog';

const ProductCard = ({ product, index }) => {
  const { addToCart, cart, updateQuantity, removeFromCart, showToast } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ 
          duration: 0.8, 
          delay: (index % 3) * 0.1,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-8 group/img">
          {/* Quantity Badge */}
          <AnimatePresence>
            {quantity > 0 && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute top-6 right-6 z-30 px-3 py-1.5 bg-[#2D5A27] text-[#FEFAE0] rounded-full flex items-center gap-2 shadow-2xl border border-[#FEFAE0]/20"
              >
                <span className="text-[10px] font-black">{quantity}</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-80 border-l border-[#FEFAE0]/20 pl-2">In Collection</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant Bottom Slide-up Add to Cart / Selector / Confirm */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (quantity === 0) addToCart(product);
            }}
            className={`absolute bottom-0 left-0 right-0 bg-[#2D5A27]/95 backdrop-blur-sm translate-y-full group-hover/img:translate-y-0 transition-transform duration-500 ease-out z-20 flex items-center justify-center cursor-pointer py-0 ${showConfirm ? 'translate-y-0' : ''}`}
          >
            {showConfirm ? (
              <div className="flex items-stretch w-full h-[48px]" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#FEFAE0]/40 hover:text-[#FEFAE0] hover:bg-white/5 transition-all duration-300"
                >
                  Cancel
                </button>
                <div className="w-[1px] bg-[#FEFAE0]/10 my-4"></div>
                <button 
                  onClick={() => {
                    removeFromCart(product.id);
                    showToast(`${product.name.toUpperCase()} REMOVED`);
                    setShowConfirm(false);
                  }}
                  className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-red-300 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            ) : quantity > 0 ? (
              <div className="flex items-stretch w-full h-[48px]" onClick={(e) => e.stopPropagation()}>
                {/* Direct Remove Button Area */}
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="px-8 text-red-400/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex-1 flex items-stretch justify-end">
                  <button 
                    onClick={() => {
                      if (quantity === 1) setShowConfirm(true);
                      else updateQuantity(product.id, -1);
                    }}
                    className="px-6 text-[#FEFAE0]/40 hover:text-[#FEFAE0] hover:bg-white/5 transition-all duration-300"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex items-center px-4">
                    <span className="text-[12px] font-black text-[#FEFAE0] min-w-[20px] text-center tracking-widest">{quantity}</span>
                  </div>
                  <button 
                    onClick={() => updateQuantity(product.id, 1)}
                    className="px-8 text-[#FEFAE0]/40 hover:text-[#FEFAE0] hover:bg-white/5 transition-all duration-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[48px]">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#FEFAE0]">
                  Add to Collection
                </span>
              </div>
            )}
          </div>
          <img 
            src={imageError ? fallbackImage : product.image} 
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/img:scale-105"
          />
        </div>
        <div className="flex flex-col items-center text-center space-y-3 px-4">
          <span className="text-[9px] font-bold text-[#2D5A27]/30 uppercase tracking-[0.5em]">{product.category}</span>
          <h3 className="text-[12px] font-bold text-[#2D5A27] uppercase tracking-[0.2em]">{product.name}</h3>
          <p className="text-[11px] font-medium text-[#2D5A27]/60 tracking-widest italic">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
      </motion.div>

      <ProductDetailModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
