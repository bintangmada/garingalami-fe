import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import InfoModal from '../components/InfoModal';
import products from '../data/products.json';

const Home = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [infoModal, setInfoModal] = useState({ isOpen: false, type: '' });

  const categories = ['Classic', 'Exotic', 'Crunchy', 'Wellness'];

  const toggleCategory = (cat) => {
    if (cat === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
    }
  };

  const filteredProducts = (products || []).filter(p => {
    try {
      const name = p.name ? p.name.toLowerCase() : '';
      const cat = p.category || '';
      const search = (searchTerm || '').toLowerCase();
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(cat);
      const matchesSearch = name.includes(search);
      return matchesCategory && matchesSearch;
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
      
      <main className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto overflow-x-hidden">
        {/* Modern Category Selector */}
        <section className="px-6 mb-16">
          <div className="flex items-center justify-start md:justify-center gap-8 md:gap-14 text-[11px] uppercase font-bold tracking-[0.3em] text-[#2D5A27]/40 overflow-x-auto no-scrollbar py-4 border-b border-[#2D5A27]/5">
            <button 
              onClick={() => toggleCategory('All')}
              className={`flex items-center gap-2 transition-all hover:text-[#2D5A27] shrink-0 outline-none ${selectedCategories.length === 0 ? 'text-[#2D5A27] font-black' : ''}`}
            >
              <AnimatePresence>
                {selectedCategories.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <Check size={10} strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
              All Collection
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 transition-all hover:text-[#2D5A27] shrink-0 outline-none ${selectedCategories.includes(cat) ? 'text-[#2D5A27] font-black' : ''}`}
              >
                <AnimatePresence>
                  {selectedCategories.includes(cat) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Check size={10} strokeWidth={4} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {cat}
              </button>
            ))}
          </div>
        </section>
        
        {/* Luxury Product Grid */}
        <section className="px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 items-start">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-40 text-center opacity-20">
              <p className="text-[10px] uppercase font-bold tracking-[0.5em]">No pieces found</p>
            </div>
          )}
        </section>

        {/* Minimalist Footer */}
        <footer className="mt-60 pb-20 px-6 border-t border-[#2D5A27]/5 pt-20">
          <div className="flex flex-col md:flex-row gap-12 justify-between items-center text-[9px] uppercase font-bold tracking-[0.4em] text-[#2D5A27]/30">
            <div className="font-medium italic">Garing Alami &copy; 2026</div>
            <div className="flex gap-12">
              <button onClick={() => setInfoModal({ isOpen: true, type: 'about' })} className="hover:text-[#2D5A27] transition-all">Philosophy</button>
              <button onClick={() => setInfoModal({ isOpen: true, type: 'contact' })} className="hover:text-[#2D5A27] transition-all">Concierge</button>
            </div>
          </div>
        </footer>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <AnimatePresence>
        {infoModal.isOpen && (
          <InfoModal 
            type={infoModal.type} 
            onClose={() => setInfoModal({ ...infoModal, isOpen: false })} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
