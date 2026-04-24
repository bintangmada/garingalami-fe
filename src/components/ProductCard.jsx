import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';
import ConfirmDialog from './ConfirmDialog';

const ProductCard = ({ product, index }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [localToast, setLocalToast] = useState(null);

  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const triggerLocalToast = (msg) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 2000);
  };

  const handleAdd = () => {
    addToCart(product);
    triggerLocalToast('Added to Collection');
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    triggerLocalToast('Removed');
    setShowConfirm(false);
  };

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
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-8 group/img rounded-2xl">
          {/* Local Toast Overlay */}
          <AnimatePresence>
            {localToast && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-40 flex items-center justify-center bg-[#2D5A27]/90 backdrop-blur-sm"
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 border-2 border-[#FEFAE0]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FEFAE0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FEFAE0]">{localToast}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inline Confirmation */}
          <ConfirmDialog 
            isOpen={showConfirm}
            type="card"
            message={`Remove from collection?`}
            onConfirm={handleRemove}
            onCancel={() => setShowConfirm(false)}
          />

          {/* Quantity Badge */}
          <AnimatePresence>
            {quantity > 0 && !localToast && !showConfirm && (
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

          {/* Elegant Bottom Slide-up Add to Cart / Selector */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (quantity === 0) handleAdd();
            }}
            className={`absolute bottom-0 left-0 right-0 bg-[#2D5A27]/95 backdrop-blur-sm transition-all duration-500 ease-out z-20 flex items-center justify-center cursor-pointer py-0
              ${quantity > 0 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0 lg:group-hover/img:translate-y-0 lg:group-hover/img:opacity-100'
              }
              max-lg:translate-y-0 max-lg:opacity-100`}
          >
            {quantity > 0 ? (
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
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={imageError ? fallbackImage : product.image} 
            alt={product.name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
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
