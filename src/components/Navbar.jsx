import React from 'react';
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

        <div className="flex items-center gap-6 md:gap-12">
          {/* Responsive Search */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-[#2D5A27]/40 hover:text-[#2D5A27] transition-colors md:hidden"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            
            <div className={`${isSearchOpen ? 'w-40 opacity-100' : 'w-0 md:w-40 opacity-0 md:opacity-100'} overflow-hidden transition-all duration-700 ease-in-out`}>
              <input 
                type="text" 
                placeholder="SEARCH"
                className="w-full bg-transparent py-1 text-[11px] uppercase font-bold tracking-[0.3em] outline-none border-b border-[#2D5A27]/10 focus:border-[#2D5A27]/30 transition-all text-[#2D5A27] placeholder:text-[#2D5A27]/30"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="shrink-0">
            <button 
              onClick={onOpenCart}
              className="relative text-[#2D5A27]/60 hover:text-[#2D5A27] transition-all"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Cart {totalItems > 0 && `(${totalItems})`}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
