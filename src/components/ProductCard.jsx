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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] overflow-hidden premium-shadow hover-premium group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={imageError ? fallbackImage : product.image} 
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-[#2D5A27] shadow-sm">
            {product.category}
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur p-4 rounded-full text-[#2D5A27] transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Eye className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-black text-[#2D5A27] mb-2">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#344E41]">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="p-4 bg-[#2D5A27] text-white rounded-2xl hover:bg-[#A3B18A] transition-all hover:rotate-3 shadow-lg shadow-[#2D5A27]/20"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>
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
