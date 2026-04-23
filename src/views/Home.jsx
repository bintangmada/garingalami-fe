import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import InfoModal from '../components/InfoModal';
import products from '../data/products.json';

const Home = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]); // List of categories
  const [searchTerm, setSearchTerm] = useState('');
  const [infoModal, setInfoModal] = useState({ isOpen: false, type: '' });

  const categories = ['Classic', 'Exotic', 'Crunchy', 'Wellness'];

  const toggleCategory = (cat) => {
    if (cat === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(cat) 
          ? prev.filter(c => c !== cat) 
          : [...prev, cat]
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
      console.error("Filter error for product:", p, e);
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
      
      <main className="pt-32 pb-20">
        <section className="px-6 mb-16">
          <div className="flex items-center justify-start md:justify-center gap-8 md:gap-14 text-[12px] uppercase font-bold tracking-[0.3em] text-[#2D5A27]/40 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => toggleCategory('All')}
              className={`transition-colors whitespace-nowrap hover:text-[#2D5A27] ${
                selectedCategories.length === 0 ? 'text-[#2D5A27]' : ''
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`transition-colors whitespace-nowrap hover:text-[#2D5A27] ${
                  selectedCategories.includes(cat) ? 'text-[#2D5A27] border-b border-[#2D5A27]/20 pb-1' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
        
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="py-40 text-center text-[#2D5A27]/20 uppercase text-[10px] tracking-[0.4em]">
              No items discovered
            </div>
          )}
        </section>

        <footer className="mt-60 pb-20 px-6 border-t border-[#2D5A27]/5 pt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 justify-between items-center text-[10px] uppercase font-bold tracking-[0.4em] text-[#2D5A27]/30">
            <div>Garing Alami Atelier &copy; 2026</div>
            <div className="flex gap-12">
              <button onClick={() => setInfoModal({ isOpen: true, type: 'about' })} className="hover:text-[#2D5A27] transition-colors cursor-pointer">Philosophy</button>
              <button onClick={() => setInfoModal({ isOpen: true, type: 'contact' })} className="hover:text-[#2D5A27] transition-colors cursor-pointer">Concierge</button>
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
