import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowLeft, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import GoogleLoginButton from './GoogleLoginButton';

const CartDrawer = ({ isOpen, onClose, onOpenOrders }) => {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, showToast } = useCart();
  const { user, loginAsDevGuest, logout } = useAuth();
  const [userInfo, setUserInfo] = useState({ name: '', address: '' });
  const [confirmItem, setConfirmItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [step, setStep] = useState('cart'); // cart, auth, shipping, payment, success
  const [paymentMethod, setPaymentMethod] = useState('');
  const [localToast, setLocalToast] = useState(null);
  const [showPaymentSimConfirm, setShowPaymentSimConfirm] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [cartSearch, setCartSearch] = useState('');

  // Sync user info and advance step when logged in
  useEffect(() => {
    if (user) {
      if (step === 'auth') {
        setStep('shipping');
      }
      if (!userInfo.name) {
        setUserInfo(prev => ({ ...prev, name: user.name || user.username }));
      }
    }
  }, [user, step, userInfo.name]);

  const triggerLocalToast = (msg) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 2000);
  };

  const filteredCart = cart.filter(item => 
    item.name.toLowerCase().includes(cartSearch.toLowerCase())
  );

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  const handleDevLogin = async () => {
    try {
      await loginAsDevGuest();
      setStep('shipping');
      triggerLocalToast("SIMULASI LOGIN BERHASIL");
    } catch (err) {
      triggerLocalToast("SIMULASI LOGIN GAGAL");
    }
  };

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
    if (step === 'success') {
      setStep('cart');
    } else if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('cart');
    } else if (step === 'auth') {
      setStep('cart');
    } else if (step === 'cart') {
      setStep('cart');
    }
  };

  const handleCheckout = () => {
    if (step === 'cart') {
      if (cart.length === 0) return;
      if (!user) {
        setStep('auth');
      } else {
        setStep('shipping');
      }
    } else if (step === 'auth') {
      if (user) setStep('shipping');
    } else if (step === 'shipping') {
      if (!userInfo.name && !userInfo.address) {
        triggerLocalToast("LENGKAPI NAMA & ALAMAT");
        return;
      }
      if (!userInfo.name) {
        triggerLocalToast("LENGKAPI NAMA");
        return;
      }
      if (!userInfo.address) {
        triggerLocalToast("LENGKAPI ALAMAT");
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      if (!paymentMethod) {
        triggerLocalToast("PILIH METODE PEMBAYARAN");
        return;
      }
      setShowPaymentSimConfirm(true);
    }
  };

  const handleExecuteCheckout = async (targetStatus) => {
    setShowPaymentSimConfirm(false);
    try {
      const orderPayload = {
        shippingAddress: userInfo.address,
        paymentMethod: paymentMethod,
        status: targetStatus,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          setStep('auth');
          triggerLocalToast("SESI HABIS. SILAKAN LOGIN KEMBALI");
          return;
        }
        const errorMsg = await response.text();
        triggerLocalToast(errorMsg || "GAGAL MEMPROSES PESANAN");
        return;
      }

      const orderData = await response.json();

      if (targetStatus === 'PAID') {
        setCreatedOrder(orderData);
        clearCart();
        setStep('success');
      } else {
        const phoneNumber = "6281234567890";
        let message = `*Nama:* ${userInfo.name}%0A*Alamat:* ${userInfo.address}%0A*Metode Pembayaran:* ${paymentMethod}%0A%0A*Halo Garing Alami! Saya ingin memesan:*%0A%0A`;
        
        cart.forEach(item => {
          message += `- ${item.name} (${item.quantity}x) @ Rp ${item.price.toLocaleString('id-ID')}%0A`;
        });
        
        message += `%0A*Total: Rp ${totalPrice.toLocaleString('id-ID')}*%0A%0AMohon info selanjutnya ya.`;
        
        clearCart();
        onClose();
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      }
    } catch (error) {
      console.error("Order error:", error);
      triggerLocalToast("KONEKSI KE SERVER GAGAL");
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
                  disabled={step === 'cart' || step === 'success'}
                  className={`transition-all ${(step === 'cart' || step === 'success') ? 'opacity-0 pointer-events-none' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
                >
                  <ArrowLeft size={14} strokeWidth={3} />
                </button>

                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2D5A27] min-w-[80px] text-center">
                  {step === 'cart' ? 'Cart' : step === 'auth' ? 'Identity' : step === 'shipping' ? 'Shipping' : step === 'payment' ? 'Payment' : 'Success'}
                </h2>

                <button 
                  onClick={handleCheckout}
                  disabled={step === 'payment' || step === 'success' || cart.length === 0}
                  className={`transition-all ${(step === 'payment' || step === 'success' || cart.length === 0) ? 'opacity-0 pointer-events-none' : 'text-[#2D5A27]/40 hover:text-[#2D5A27]'}`}
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
                <div className="relative group mb-2">
                  <input 
                    type="text"
                    placeholder="Search in your collection..."
                    value={cartSearch}
                    onChange={(e) => setCartSearch(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2D5A27]/5 py-4 pl-0 pr-10 text-[9px] font-black uppercase tracking-[0.4em] outline-none focus:border-[#2D5A27]/20 transition-all text-[#2D5A27] placeholder:text-[#2D5A27]/10"
                  />
                  <Search size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#2D5A27]/10 group-focus-within:text-[#2D5A27]/30 transition-colors" />
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

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2 flex flex-col">
              {step === 'success' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-8 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-[#2D5A27] border border-emerald-100 shadow-sm">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/80">Acquisition Completed</span>
                    <h3 className="text-xl font-black uppercase tracking-[0.1em] text-[#2D5A27]">Order Successful!</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#2D5A27]/60 leading-relaxed max-w-[280px]">
                    Thank you for choosing Garing Alami. Your payment has been successfully simulated and verified.
                  </p>
                  
                  <div className="w-full bg-[#2D5A27]/[0.02] border border-[#2D5A27]/5 rounded-xl p-6 space-y-3 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#2D5A27]/40">
                      <span>Order Code</span>
                      <span className="text-[#2D5A27] font-black">#GA-{String(createdOrder?.id).padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#2D5A27]/40">
                      <span>Amount Simulated</span>
                      <span className="text-[#2D5A27] font-black">Rp {createdOrder?.totalPrice?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#2D5A27]/40">
                      <span>Status</span>
                      <span className="text-emerald-700 font-black">PAID</span>
                    </div>
                  </div>

                  <div className="w-full space-y-4 pt-6">
                    <button 
                      onClick={() => {
                        onClose();
                        if (onOpenOrders) onOpenOrders();
                      }}
                      className="w-full bg-[#2D5A27] text-white py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#1A3A16] transition-all"
                    >
                      View Order History
                    </button>
                    <button 
                      onClick={() => {
                        onClose();
                        setStep('cart');
                      }}
                      className="w-full bg-[#2D5A27]/5 text-[#2D5A27]/60 py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#2D5A27]/10 transition-all"
                    >
                      Back to Gallery
                    </button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
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

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#2D5A27]/5 w-full text-left">
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
                                src={item.mainImageUrl || item.image} 
                                alt={item.name} 
                                onError={(e) => { e.target.src = fallbackImage; }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A27] truncate mb-1">{item.name}</h4>
                              <div className="flex items-center gap-2 mb-4">
                                <p className="text-[9px] font-medium text-[#2D5A27]/40 italic">
                                  Rp {item.price.toLocaleString('id-ID')}
                                  {item.quantity > 1 && <span className="ml-1 tracking-widest">× {item.quantity}</span>}
                                </p>
                                <div className="w-1 h-1 bg-[#2D5A27]/10 rounded-full" />
                                <p className="text-[10px] font-black text-[#2D5A27] tracking-tight">
                                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </p>
                              </div>
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

                  {step === 'auth' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-12 animate-fade-in">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#2D5A27]/40">Securing Acquisition</h4>
                          <h3 className="text-xl font-black uppercase tracking-[0.2em] text-[#2D5A27]">Sync Your Identity</h3>
                        </div>
                      </div>

                      <p className="text-[11px] font-medium text-[#2D5A27]/60 leading-relaxed max-w-[280px]">
                        To provide a seamless experience and secure your collection, please continue with your Google account.
                      </p>

                      <div className="w-full pt-4 flex flex-col items-center gap-4">
                        <GoogleLoginButton onSuccess={() => setStep('shipping')} />
                        
                        <div className="flex items-center gap-2 w-full max-w-[200px] my-2">
                          <div className="h-[1px] bg-[#2D5A27]/10 flex-1"></div>
                          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#2D5A27]/20">OR</span>
                          <div className="h-[1px] bg-[#2D5A27]/10 flex-1"></div>
                        </div>

                        <button 
                          onClick={handleDevLogin}
                          className="w-full py-4 bg-[#2D5A27]/5 border border-[#2D5A27]/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#2D5A27] transition-all hover:bg-[#2D5A27]/10 active:scale-95 font-bold"
                        >
                          Simulasi Login (Guest)
                        </button>
                      </div>

                      <div className="pt-12 border-t border-[#2D5A27]/5 w-full">
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#2D5A27]/20 italic">
                          Automated registration will be performed for new curators.
                        </p>
                      </div>
                    </div>
                  )}

                  {(step === 'shipping' || step === 'payment') && (
                    <div className="mb-8 p-4 bg-[#2D5A27]/[0.02] border border-[#2D5A27]/5 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D5A27]">Order Summary</span>
                        <span className="text-[9px] font-bold text-[#2D5A27]/40">{cart.length} Items</span>
                      </div>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.1em]">
                            <span className="text-[#2D5A27]/60 truncate mr-4">{item.name} x{item.quantity}</span>
                            <span className="text-[#2D5A27]">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
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

            {cart.length > 0 && step !== 'success' && (
              <div className="mt-auto pt-8 border-t border-[#2D5A27]/5 space-y-8 bg-white/80 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#344E41]/40">Total</span>
                  <span className="text-lg font-black text-[#2D5A27]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#2D5A27] text-[#FEFAE0] py-5 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-[#344E41] shadow-lg shadow-[#2D5A27]/10"
                >
                  {step === 'cart' ? 'Proceed to Shipping' : step === 'auth' ? 'Waiting for Identity...' : step === 'shipping' ? 'Proceed to Payment' : 'Complete Acquisition'}
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

            {/* Custom Payment Simulation Confirmation Dialog */}
            <AnimatePresence>
              {showPaymentSimConfirm && (
                <div className="absolute inset-0 z-[150] flex items-center justify-center p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowPaymentSimConfirm(false)}
                    className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl space-y-6 text-center"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/40">Payment Gateway Simulation</span>
                      <h3 className="text-sm font-black uppercase tracking-[0.1em] text-[#2D5A27]">PILIH SIMULASI TRANSAKSI</h3>
                      <p className="text-[10px] text-[#2D5A27]/60 font-medium leading-relaxed">
                        Bagaimana Anda ingin memproses pesanan ini untuk pengujian?
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleExecuteCheckout('PAID')}
                        className="w-full py-4 bg-[#2D5A27] text-[#FEFAE0] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#2D5A27]/10 transition-all hover:bg-[#1A3A16] active:scale-95 animate-pulse"
                      >
                        Simulasi Bayar Sukses
                      </button>
                      <button
                        onClick={() => handleExecuteCheckout('PENDING')}
                        className="w-full py-4 bg-[#2D5A27]/5 text-[#2D5A27] border border-[#2D5A27]/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#2D5A27]/10 active:scale-95"
                      >
                        Bayar via WhatsApp (Manual)
                      </button>
                      <button
                        onClick={() => setShowPaymentSimConfirm(false)}
                        className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
