import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Leaf, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenCart, searchTerm, onSearch }) => {
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
        <div className="flex items-center gap-4 group relative cursor-help">
          {/* Elegant Artistic Leaf Logo */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-700 group-hover:rotate-[360deg] flex items-center justify-center">
              <Leaf className="w-full h-full text-[#2D5A27] stroke-[1px] opacity-80" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.4em] text-[#2D5A27] leading-none">Garing Alami</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/40">Atelier</span>
            </div>
          </div>

          {/* Elegant About Tooltip */}
          <div className="absolute top-full left-0 mt-4 w-80 bg-white/95 backdrop-blur-sm p-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-1000 ease-out transform -translate-y-2 group-hover:translate-y-0 z-[60] border border-[#2D5A27]/5">
            <Leaf className="w-6 h-6 text-[#2D5A27] stroke-[1px] mb-8 opacity-30" />
            <p className="text-[11px] leading-loose tracking-wide text-[#2D5A27]/60 italic font-medium">
              "At Garing Alami, we translate nature's finest gifts into a curated culinary experience. Each fruit is hand-selected and slowly preserved to honor its original vibration and essence."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-12">
          {/* Responsive Search */}
          <div className="relative flex items-center">
            <motion.div 
              initial={false}
              animate={{ width: isSearchOpen ? (window.innerWidth > 768 ? 240 : 160) : 0 }}
              className="overflow-hidden"
            >
              <input 
                type="text" 
                placeholder="SEARCH COLLECTION..."
                className="w-full bg-transparent py-1 text-[10px] uppercase font-bold tracking-[0.3em] outline-none border-b border-[#2D5A27]/20 focus:border-[#2D5A27] transition-all text-[#2D5A27] placeholder:text-[#2D5A27]/20"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                autoFocus={isSearchOpen}
              />
            </motion.div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 transition-all duration-500 ${isSearchOpen ? 'text-[#2D5A27]' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
            >
              <Search size={16} strokeWidth={isSearchOpen ? 3 : 1.5} />
            </button>
          </div>
          
          <div className="shrink-0">
            <button 
              onClick={onOpenCart}
              className="group relative flex items-center gap-2 md:gap-3 text-[#2D5A27]/60 hover:text-[#2D5A27] transition-all whitespace-nowrap"
            >
              <div className="w-px h-4 bg-[#2D5A27]/10" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                Collection {totalItems > 0 && <span className="ml-1 text-[#2D5A27]/30 group-hover:text-[#2D5A27]">[{totalItems}]</span>}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
