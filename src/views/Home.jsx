import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import WhatsAppButton from '../components/WhatsAppButton';
import products from '../data/products.json';

const Home = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FEFAE0]">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
      
      <main>
        <Hero />

        {/* Why Us Section */}
        <section className="py-24 px-6 bg-[#2D5A27] text-[#FEFAE0]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black">Why Garing Alami?</h2>
              <p className="opacity-70 text-lg max-w-2xl mx-auto">We take pride in our process, ensuring that every piece of fruit reaches you with its natural integrity intact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "100% Natural", desc: "No artificial colors, flavors, or sweeteners. Just pure tropical goodness.", icon: "🍃" },
                { title: "Locked Nutrition", desc: "Our low-temperature drying process preserves vitamins and minerals.", icon: "💎" },
                { title: "Eco-Friendly", desc: "Sourced sustainably from local farmers with minimal carbon footprint.", icon: "🌍" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors"
                >
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="opacity-60 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Product Section */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black text-[#2D5A27]">Our Collections</h2>
              <p className="text-[#344E41] mt-2">Natural goodness, perfectly preserved.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Classic', 'Exotic', 'Crunchy', 'Wellness'].map((cat) => (
                <span 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                    category === cat ? 'bg-[#2D5A27] text-white shadow-lg translate-y-[-2px]' : 'bg-[#E9EDC9] text-[#2D5A27] hover:bg-[#A3B18A] hover:text-white'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-24 h-24 bg-[#E9EDC9] rounded-full flex items-center justify-center text-[#2D5A27] mb-6">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#2D5A27]">No products found</h3>
                  <p className="text-[#344E41]/60 mt-2">Try adjusting your search or filters.</p>
                  <button 
                    onClick={() => { setCategory('All'); setSearchTerm(''); }}
                    className="mt-8 px-8 py-3 bg-[#2D5A27] text-white rounded-2xl font-bold hover:scale-105 transition-transform"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2D5A27] text-[#FEFAE0] py-20 px-6 mt-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="text-3xl font-black">GaringAlami</div>
              <p className="opacity-70">Providing the best quality dried fruit snacks from selected Indonesian farms.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Quick Links</h4>
              <ul className="space-y-2 opacity-70">
                <li><a href="#" className="hover:underline">Shop</a></li>
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Our Location</h4>
              <p className="opacity-70">Jakarta, Indonesia</p>
              <p className="opacity-70">contact@garingalami.shop</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto pt-10 mt-10 border-t border-white/10 text-center opacity-50 text-sm">
            &copy; 2026 Garing Alami. All rights reserved.
          </div>
        </footer>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
