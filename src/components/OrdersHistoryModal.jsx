import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrdersHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PAID':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'SHIPPED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white border border-[#2D5A27]/5 shadow-2xl flex flex-col h-[85vh] md:h-[75vh] rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-[#2D5A27]/5 flex justify-between items-center bg-[#2D5A27]/[0.01]">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/40">Atelier Archives</span>
                <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-[#2D5A27]">Order History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-[#2D5A27]/20 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar space-y-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-[#2D5A27]" size={28} />
                  <span className="text-[9px] uppercase tracking-[0.5em] text-[#2D5A27]/40 font-bold">Consulting Archives...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-[#2D5A27]/5 rounded-full flex items-center justify-center text-[#2D5A27]/40">
                    <ShoppingBag size={24} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D5A27]/40">No Acquisitions</h4>
                    <h3 className="text-lg font-black uppercase tracking-[0.1em] text-[#2D5A27]">No Orders Yet</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#2D5A27]/60 leading-relaxed max-w-[280px]">
                    You haven't initiated any collections. Start shopping our premium natural snacks.
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-8 py-3 bg-[#2D5A27] text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#1A3A16] transition-all rounded-lg"
                  >
                    Explore Curations
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="border border-[#2D5A27]/5 rounded-xl overflow-hidden hover:border-[#2D5A27]/10 transition-all duration-300"
                    >
                      {/* Order Header Card */}
                      <div className="bg-[#2D5A27]/[0.02] p-5 md:p-6 border-b border-[#2D5A27]/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-[#2D5A27]/40 tracking-widest">ORDER CODE</span>
                          <h4 className="text-[12px] font-black text-[#2D5A27] tracking-wider uppercase">#GA-{String(order.id).padStart(6, '0')}</h4>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10px]">
                          <div className="flex items-center gap-2 text-[#2D5A27]/60 font-medium">
                            <Calendar size={12} className="text-[#2D5A27]/40" />
                            {formatDate(order.createdAt)}
                          </div>
                          <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-wider border rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-5 md:p-6 divide-y divide-[#2D5A27]/5">
                        {order.items?.map((item) => (
                          <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-[#2D5A27]/5">
                              <img 
                                src={item.product?.mainImageUrl || fallbackImage} 
                                alt={item.product?.name} 
                                onError={(e) => { e.target.src = fallbackImage; }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-[#2D5A27] truncate">{item.product?.name || "Product"}</h5>
                              <p className="text-[9px] text-[#2D5A27]/40 font-bold uppercase tracking-widest mt-1">Category: {item.product?.category || "Classic"}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-[#2D5A27]/60 font-medium">
                                  Rp {item.price?.toLocaleString('id-ID')} x {item.quantity}
                                </span>
                                <span className="text-[10px] font-black text-[#2D5A27]">
                                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details Footer */}
                      <div className="bg-gray-50/50 p-5 md:p-6 border-t border-[#2D5A27]/5 flex flex-col md:flex-row justify-between gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[9px] font-black text-[#2D5A27]/40 tracking-wider">
                              <MapPin size={12} />
                              DELIVERY ADDRESS
                            </div>
                            <p className="text-[10px] font-medium text-[#2D5A27]/70 leading-relaxed pr-4 whitespace-pre-wrap">
                              {order.shippingAddress}
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[9px] font-black text-[#2D5A27]/40 tracking-wider">
                              <CreditCard size={12} />
                              PAYMENT METHOD
                            </div>
                            <p className="text-[10px] font-black text-[#2D5A27]">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col justify-end items-end pt-4 md:pt-0 border-t md:border-t-0 border-[#2D5A27]/5">
                          <span className="text-[8px] font-black text-[#2D5A27]/30 tracking-widest">TOTAL ACQUISITION</span>
                          <span className="text-base font-black text-[#2D5A27] mt-1">
                            Rp {order.totalPrice?.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#2D5A27]/5 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-[#2D5A27]/20 bg-[#2D5A27]/[0.01]">
              Garing Alami Atelier Services &copy; 2026
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrdersHistoryModal;
