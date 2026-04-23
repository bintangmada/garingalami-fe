import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ConfirmDialog from './ConfirmDialog';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, showToast } = useCart();
  const [userInfo, setUserInfo] = useState({ name: '', address: '' });
  const [confirmItem, setConfirmItem] = useState(null);
  const [step, setStep] = useState('cart'); // cart, shipping, payment
  const [paymentMethod, setPaymentMethod] = useState('');

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  const handleRemove = (item) => {
    setConfirmItem(item);
  };

  const executeRemove = () => {
    if (confirmItem) {
      removeFromCart(confirmItem.id);
      showToast(`${confirmItem.name} dihapus`);
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
       if (!userInfo.name || !userInfo.address) {
         showToast("Lengkapi nama & alamat");
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
            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-8 overflow-hidden"
          >
             <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-4">
                 {step !== 'cart' && (
                   <button onClick={handleBack} className="p-2 -ml-2 text-[#2D5A27]/40 hover:text-[#2D5A27] transition-colors">
                     <ArrowLeft size={16} />
                   </button>
                 )}
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2D5A27]">
                   {step === 'cart' ? 'Cart' : step === 'shipping' ? 'Shipping' : 'Payment'}
                 </h2>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-[#FEFAE0] rounded-full transition-colors">
                 <X className="w-4 h-4 text-[#2D5A27]" />
               </button>
             </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
               {cart.length === 0 ? (
                 <div className="text-center py-32 opacity-20">
                   <p className="text-[10px] uppercase font-bold tracking-widest">Your cart is empty</p>
                 </div>
               ) : (
                 <div className="space-y-12">
                   {step === 'cart' && (
                     <div className="space-y-8">
                       {cart.map((item) => (
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
                                 <button onClick={() => updateQuantity(item.id, -1)} className="text-[#2D5A27]/40 hover:text-[#2D5A27] p-1"><Minus className="w-3 h-3" /></button>
                                 <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.id, 1)} className="text-[#2D5A27]/40 hover:text-[#2D5A27] p-1"><Plus className="w-3 h-3" /></button>
                               </div>
                             </div>
                           </div>
                           <button onClick={() => handleRemove(item)} className="text-[#2D5A27]/20 hover:text-red-400 p-2 transition-colors shrink-0">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </motion.div>
                       ))}
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

            <div className="mt-12 pt-8 border-t border-[#2D5A27]/5 space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#344E41]/40">Total</span>
                <span className="text-lg font-black text-[#2D5A27]">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
               <button 
                 disabled={cart.length === 0}
                 onClick={handleCheckout}
                 className="w-full bg-[#2D5A27] disabled:bg-gray-100 disabled:text-gray-300 text-[#FEFAE0] py-5 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-[#344E41]"
               >
                 {step === 'cart' ? 'Proceed to Shipping' : step === 'shipping' ? 'Proceed to Payment' : 'Complete Acquisition'}
               </button>
            </div>
          </motion.div>

          <ConfirmDialog 
            isOpen={!!confirmItem}
            message={`Hapus ${confirmItem?.name} dari keranjang?`}
            onConfirm={executeRemove}
            onCancel={() => setConfirmItem(null)}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
