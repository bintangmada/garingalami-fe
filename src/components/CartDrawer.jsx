import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowLeft, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ConfirmDialog from './ConfirmDialog';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, showToast } = useCart();
  const [userInfo, setUserInfo] = useState({ name: '', address: '' });
  const [confirmItem, setConfirmItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [step, setStep] = useState('cart'); // cart, shipping, payment
  const [paymentMethod, setPaymentMethod] = useState('');
  const [localToast, setLocalToast] = useState(null);

  const triggerLocalToast = (msg) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 2000);
  };

  const [cartSearch, setCartSearch] = useState('');

  const filteredCart = cart.filter(item => 
    item.name.toLowerCase().includes(cartSearch.toLowerCase())
  );

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  const handleRemove = (item) => {
    setConfirmItem(item);
  };

  const executeRemove = () => {
    if (confirmItem) {
      removeFromCart(confirmItem.id);
      triggerLocalToast(`${confirmItem.name.toUpperCase()} REMOVED`);
      setConfirmItem(null);
    }
  };

   const handleBack = () => {
     if (step === 'payment') setStep('shipping');
     else if (step === 'shipping') setStep('cart');
   };
 
   const handleCheckout = () => {
     if (step === 'cart') {
       if (cart.length === 0) return;
       setStep('shipping');
     } else if (step === 'shipping') {
       if (!userInfo.name && !userInfo.address) {
         showToast("Lengkapi nama & alamat");
         return;
       }
       if (!userInfo.name) {
         showToast("Lengkapi nama");
         return;
       }
       if (!userInfo.address) {
         showToast("Lengkapi alamat");
         return;
       }
       setStep('payment');
     } else if (step === 'payment') {
       if (!paymentMethod) {
         showToast("Pilih metode pembayaran");
         return;
       }
 
       const phoneNumber = "6281234567890";
       let message = `*Nama:* ${userInfo.name}%0A*Alamat:* ${userInfo.address}%0A*Metode Pembayaran:* ${paymentMethod}%0A%0A*Halo Garing Alami! Saya ingin memesan:*%0A%0A`;
       
       cart.forEach(item => {
         message += `- ${item.name} (${item.quantity}x) @ Rp ${item.price.toLocaleString('id-ID')}%0A`;
       });
       
       message += `%0A*Total: Rp ${totalPrice.toLocaleString('id-ID')}*%0A%0AMohon info selanjutnya ya.`;
       
       window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
     }
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
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col p-8 overflow-hidden"
          >
              <div className="relative w-full flex items-center justify-center mb-8 mt-2">
                {/* Compact Navigation Control */}
                <div className="flex items-center justify-center gap-6 py-2 px-8 bg-[#2D5A27]/[0.02] rounded-full border border-[#2D5A27]/5">
                  <button 
                    onClick={handleBack} 
                    disabled={step === 'cart'}
                    className={`transition-all ${step === 'cart' ? 'opacity-0 pointer-events-none' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
                  >
                    <ArrowLeft size={14} strokeWidth={3} />
                  </button>

                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2D5A27] min-w-[80px] text-center">
                    {step === 'cart' ? 'Cart' : step === 'shipping' ? 'Shipping' : 'Payment'}
                  </h2>

                  <button 
                    onClick={handleCheckout}
                    disabled={step === 'payment' || cart.length === 0}
                    className={`transition-all ${(step === 'payment' || cart.length === 0) ? 'opacity-0 pointer-events-none' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
                  >
                    <motion.div animate={{ x: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </motion.div>
                  </button>
                </div>

                {/* Global Close - Perfectly Aligned */}
                <button 
                  onClick={onClose} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#2D5A27]/30 hover:text-red-500 transition-all duration-300"
                >
                  <X size={22} strokeWidth={1} />
                </button>
              </div>

            {step === 'cart' && cart.length > 0 && (
              <div className="space-y-6 mb-8">
                <div className="relative group">
                  <input 
                    type="text"
                    placeholder="Search in your collection..."
                    value={cartSearch}
                    onChange={(e) => setCartSearch(e.target.value)}
                    className="w-full bg-[#2D5A27]/[0.03] border-b border-[#2D5A27]/10 py-3 pl-2 pr-10 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-[#2D5A27] focus:bg-[#2D5A27]/[0.05] transition-all text-[#2D5A27] placeholder:text-[#2D5A27]/20"
                  />
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D5A27]/20 group-focus-within:text-[#2D5A27] transition-colors" />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-red-400/40 hover:text-red-400 transition-all group"
                  >
                    <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Clear Collection
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
               {cart.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-12">
                   <div className="space-y-6">
                     <div className="flex justify-center opacity-20">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 2L4.5 20.29C4.12 21.21 4.96 22 5.88 22H18.12C19.04 22 19.88 21.21 19.5 20.29L12 2Z" stroke="#2D5A27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M12 10V18" stroke="#2D5A27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                     <div className="space-y-2">
                       <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#2D5A27]/40">Atelier Inquiries</h4>
                       <h3 className="text-xl font-black uppercase tracking-[0.2em] text-[#2D5A27]">Get In Touch</h3>
                     </div>
                   </div>

                   <p className="text-[11px] font-medium text-[#2D5A27]/60 leading-relaxed max-w-[280px]">
                     Whether you are inquiring about a custom collection, wholesale opportunities, or simply wish to share your experience, our concierge is here to assist you.
                   </p>

                   <div className="space-y-8 pt-4">
                     <div className="space-y-1">
                       <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/30">Email</p>
                       <p className="text-[10px] font-bold text-[#2D5A27]">atelier@garingalami.com</p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/30">Instagram</p>
                       <p className="text-[10px] font-bold text-[#2D5A27]">@garingalami.official</p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/30">WhatsApp</p>
                       <p className="text-[10px] font-bold text-[#2D5A27]">+62 812 3456 7890</p>
                     </div>
                   </div>

                   <button 
                    onClick={onClose}
                    className="text-[9px] font-black uppercase tracking-[0.5em] text-[#2D5A27]/40 hover:text-[#2D5A27] pt-12 transition-all border-t border-[#2D5A27]/5 w-full hover:tracking-[0.6em]"
                   >
                     Back to Collection
                   </button>
                 </div>
               ) : (
                 <div className="space-y-12">
                   {step === 'cart' && (
                      <div className="space-y-8">
                        {filteredCart.length === 0 ? (
                          <div className="py-20 text-center opacity-20">
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em]">No matches found</p>
                          </div>
                        ) : (
                          filteredCart.map((item) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={item.id} 
                              className="flex gap-4 items-start"
                            >
                              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  onError={(e) => { e.target.src = fallbackImage; }}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A27] truncate mb-1">{item.name}</h4>
                                <p className="text-[10px] font-medium text-[#2D5A27]/60 mb-3">Rp {item.price.toLocaleString('id-ID')}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => {
                                        if (item.quantity === 1) handleRemove(item);
                                        else updateQuantity(item.id, -1);
                                      }} 
                                      className={`p-1 transition-all ${item.quantity === 1 ? 'text-red-400/60 hover:text-red-400' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
                                    >
                                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3 h-3" />}
                                    </button>
                                    <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-[#2D5A27]/40 hover:text-[#2D5A27] p-1"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => handleRemove(item)} className="text-[#2D5A27]/20 hover:text-red-400 p-2 transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    )}
 
                   {step === 'shipping' && (
                     <div className="pt-4 pb-8 space-y-12 animate-fade-in">
                       <div className="space-y-2">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/60">Shipping Detail</h3>
                          <div className="w-8 h-[1px] bg-[#2D5A27]/20"></div>
                       </div>
                       
                       <div className="space-y-10">
                         <div className="group space-y-3">
                           <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/30 transition-colors group-focus-within:text-[#2D5A27]/60">Full Name</label>
                           <input 
                             type="text" 
                             placeholder="Identify your name" 
                             className="w-full pb-3 bg-transparent border-b border-[#2D5A27]/10 outline-none focus:border-[#2D5A27]/40 transition-all text-xs font-medium placeholder:text-[#2D5A27]/20 placeholder:italic"
                             value={userInfo.name}
                             onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                           />
                         </div>
                         <div className="group space-y-3">
                           <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#2D5A27]/30 transition-colors group-focus-within:text-[#2D5A27]/60">Delivery Address</label>
                           <textarea 
                             placeholder="Where should we send the collection?" 
                             className="w-full pb-3 bg-transparent border-b border-[#2D5A27]/10 outline-none focus:border-[#2D5A27]/40 transition-all text-xs font-medium h-24 resize-none placeholder:text-[#2D5A27]/20 placeholder:italic"
                             value={userInfo.address}
                             onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                           ></textarea>
                         </div>
                       </div>
                     </div>
                   )}
 
                   {step === 'payment' && (
                     <div className="pt-4 pb-8 space-y-12 animate-fade-in">
                       <div className="space-y-2">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/60">Payment Method</h3>
                          <div className="w-8 h-[1px] bg-[#2D5A27]/20"></div>
                       </div>
 
                       <div className="space-y-4">
                         {[
                           { id: 'bank', name: 'Direct Bank Transfer', desc: 'Secure bank-to-bank transaction' },
                           { id: 'wallet', name: 'Digital Wallet', desc: 'OVO, GoPay, or ShopeePay' },
                           { id: 'atelier', name: 'Atelier Premium Credit', desc: 'Membership exclusive service' }
                         ].map((method) => (
                           <button
                             key={method.id}
                             onClick={() => setPaymentMethod(method.name)}
                             className={`w-full text-left p-6 border transition-all duration-500 ${
                               paymentMethod === method.name 
                                 ? 'border-[#2D5A27] bg-[#2D5A27]/5' 
                                 : 'border-[#2D5A27]/5 hover:border-[#2D5A27]/20'
                             }`}
                           >
                             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D5A27] mb-1">{method.name}</div>
                             <div className="text-[9px] text-[#2D5A27]/40 tracking-wider font-medium">{method.desc}</div>
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>

             {cart.length > 0 && (
               <div className="mt-auto pt-8 border-t border-[#2D5A27]/5 space-y-8 bg-white/80 backdrop-blur-sm">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-[#344E41]/40">Total</span>
                   <span className="text-lg font-black text-[#2D5A27]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                 </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#2D5A27] text-[#FEFAE0] py-5 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-[#344E41] shadow-lg shadow-[#2D5A27]/10"
                  >
                    {step === 'cart' ? 'Proceed to Shipping' : step === 'shipping' ? 'Proceed to Payment' : 'Complete Acquisition'}
                  </button>
                </div>
             )}

             <AnimatePresence>
                {localToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-28 left-8 right-8 z-[150] bg-[#2D5A27] text-[#FEFAE0] py-4 px-6 rounded-xl shadow-2xl flex items-center gap-4 border border-[#FEFAE0]/10"
                  >
                    <div className="w-1 h-1 bg-[#FEFAE0] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none">{localToast}</span>
                  </motion.div>
                )}
             </AnimatePresence>

             <ConfirmDialog 
               isOpen={!!confirmItem}
               type="drawer"
               message={`Hapus ${confirmItem?.name} dari keranjang?`}
               onConfirm={executeRemove}
               onCancel={() => setConfirmItem(null)}
             />

             <ConfirmDialog 
               isOpen={showClearConfirm}
               type="drawer"
               message="Hapus semua barang dari koleksi?"
               onConfirm={() => {
                 clearCart();
                 triggerLocalToast("COLLECTION CLEARED");
                 setShowClearConfirm(false);
               }}
               onCancel={() => setShowClearConfirm(false)}
             />
           </motion.div>
         </div>
       )}
    </AnimatePresence>
  );
};

export default CartDrawer;
