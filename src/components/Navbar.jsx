import React from 'react';
import { ShoppingBag, Leaf, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenCart, searchTerm, onSearch }) => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-5 flex justify-between items-center premium-shadow">
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-10 h-10 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-[#FEFAE0] shadow-lg shadow-[#2D5A27]/20">
          <Leaf className="w-6 h-6" />
        </div>
        <div className="flex flex-col -space-y-1 hidden sm:flex">
          <span className="text-2xl font-black tracking-tight text-[#2D5A27]">Garing<span className="text-[#A3B18A]">Alami</span></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A3B18A] ml-0.5">Premium Natural Snacks</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D5A27]/50" />
          <input 
            type="text" 
            placeholder="Search natural goodness..."
            className="w-full bg-[#E9EDC9]/30 border border-[#2D5A27]/5 p-3 pl-12 rounded-2xl outline-none focus:ring-2 ring-[#2D5A27]/10 transition-all font-medium text-[#2D5A27]"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 shrink-0">
        <button 
          onClick={onOpenCart}
          className="relative p-3 bg-white/50 hover:bg-[#E9EDC9] rounded-2xl transition-all hover:scale-105 active:scale-95 group"
        >
          <ShoppingBag className="w-6 h-6 text-[#2D5A27] transition-transform group-hover:-rotate-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white font-black shadow-lg">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
