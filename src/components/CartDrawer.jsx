import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [userInfo, setUserInfo] = useState({ name: '', address: '' });

  const handleWhatsAppCheckout = () => {
    if (!userInfo.name || !userInfo.address) {
      alert("Silakan isi nama dan alamat pengiriman Anda.");
      return;
    }

    const phoneNumber = "6281234567890"; // Ganti dengan nomor asli
    let message = `*Nama:* ${userInfo.name}%0A*Alamat:* ${userInfo.address}%0A%0A*Halo Garing Alami! Saya ingin memesan:*%0A%0A`;
    
    cart.forEach(item => {
      message += `- ${item.name} (${item.quantity}x) @ Rp ${item.price.toLocaleString('id-ID')}%0A`;
    });
    
    message += `%0A*Total: Rp ${totalPrice.toLocaleString('id-ID')}*%0A%0AMohon info cara pembayarannya ya.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#FEFAE0] h-full shadow-2xl flex flex-col p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#2D5A27]" />
                <h2 className="text-2xl font-black text-[#2D5A27]">Your Basket</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[#E9EDC9] rounded-full transition-colors">
                <X className="w-6 h-6 text-[#2D5A27]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-24 opacity-30">
                  <ShoppingBag className="w-20 h-20 mx-auto mb-6 opacity-20" />
                  <p className="text-xl font-bold">Your basket is empty</p>
                  <p className="text-sm mt-2">Add some tropical goodness!</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={item.id} 
                      className="flex gap-4 items-center bg-white p-4 rounded-[1.5rem] shadow-sm border border-[#2D5A27]/5"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[#2D5A27]">{item.name}</h4>
                        <p className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center bg-[#FEFAE0] rounded-xl p-1 border border-[#2D5A27]/10">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}

                  {/* Checkout Form */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#2D5A27]/5 space-y-6 mt-10">
                    <h3 className="text-xl font-black text-[#2D5A27]">Delivery Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          className="w-full p-4 bg-[#FEFAE0] rounded-2xl outline-none focus:ring-2 ring-[#2D5A27]/20 border border-transparent focus:border-[#2D5A27]/10 transition-all"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                        <textarea 
                          placeholder="Your full address here..." 
                          className="w-full p-4 bg-[#FEFAE0] rounded-2xl outline-none focus:ring-2 ring-[#2D5A27]/20 border border-transparent focus:border-[#2D5A27]/10 h-32 resize-none transition-all"
                          value={userInfo.address}
                          onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-[#2D5A27]/10 space-y-6">
              <div className="flex justify-between items-center text-2xl font-black">
                <span className="text-[#344E41]">Total</span>
                <span className="text-[#2D5A27]">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#2D5A27] disabled:bg-gray-200 disabled:text-gray-400 text-white py-6 rounded-[2rem] font-bold text-lg hover-premium flex items-center justify-center gap-3 shadow-xl shadow-[#2D5A27]/10"
              >
                <Send className="w-5 h-5" />
                Checkout via WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
