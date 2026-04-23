import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-8 group/img">
          {/* Elegant Bottom Slide-up Add to Cart */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="absolute bottom-0 left-0 right-0 bg-[#2D5A27]/90 backdrop-blur-sm py-5 translate-y-full group-hover/img:translate-y-0 transition-transform duration-500 ease-out z-20 flex items-center justify-center cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#FEFAE0]">
              Add to Collection
            </span>
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
