import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ComingSoonModal from './ComingSoonModal';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowConfirmLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Kembalikan null HANYA setelah semua Hook (useState/useEffect) dipanggil
  if (!user) return null;

  const userInitial = (user.name || user.username || 'U').charAt(0).toUpperCase();
  const profileImg = user.picture || user.profilePicture;

  const menuItems = [
    { 
      icon: <Package size={14} />, 
      label: 'My Orders', 
      onClick: () => {
        setModalTitle('My Orders');
        setModalOpen(true);
      }
    },
    { 
      icon: <Settings size={14} />, 
      label: 'Settings', 
      onClick: () => {
        setModalTitle('Settings');
        setModalOpen(true);
      }
    },
    { icon: <LogOut size={14} />, label: 'Logout', onClick: logout, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="w-px h-4 bg-[#2D5A27]/10" />
        <div className="relative">
          {!imgError && profileImg ? (
            <img 
              src={profileImg} 
              alt={user.name || user.username}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#2D5A27]/10 group-hover:border-[#2D5A27]/30 transition-all object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#2D5A27] flex items-center justify-center text-white text-[10px] font-black border border-white shadow-sm">
              {userInitial}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#2D5A27] rounded-full border-2 border-white flex items-center justify-center">
            <ChevronDown size={8} className="text-white" />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D5A27]">
            {user.name || user.username}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#2D5A27]/40">
            Collector
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-48 bg-white/95 backdrop-blur-md border border-[#2D5A27]/5 shadow-2xl shadow-[#2D5A27]/5 py-2 z-[100]"
          >
            <div className="px-4 py-3 border-b border-[#2D5A27]/5 mb-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D5A27] truncate">
                {user.email}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#2D5A27]/30">
                Verified Account
              </p>
              
              {/* Premium Collector Progress */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#2D5A27]/60">Collection Level</span>
                  <span className="text-[7px] font-black text-[#2D5A27]">65%</span>
                </div>
                <div className="h-[2px] w-full bg-[#2D5A27]/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#2D5A27]"
                  />
                </div>
                <p className="text-[6px] font-bold uppercase tracking-[0.1em] text-[#2D5A27]/30 pt-0.5">
                  12 more items to <span className="text-[#2D5A27]/50">Grand Curator</span>
                </p>
              </div>
            </div>

            {menuItems.map((item, index) => {
              if (item.danger && showConfirmLogout) {
                return (
                  <div key="confirm" className="px-4 py-2 bg-red-50/50 flex flex-col gap-2 animate-fade-in">
                    <p className="text-[8px] font-black uppercase tracking-[0.1em] text-red-600/60">Are you sure?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={logout}
                        className="flex-1 py-1 text-[9px] font-black bg-red-600 text-white uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-colors"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setShowConfirmLogout(false)}
                        className="flex-1 py-1 text-[9px] font-black bg-[#2D5A27]/10 text-[#2D5A27] uppercase tracking-[0.2em] rounded-sm hover:bg-[#2D5A27]/20 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.danger) {
                      setShowConfirmLogout(true);
                    } else {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all
                    ${item.danger 
                      ? 'text-red-600/60 hover:text-red-600 hover:bg-red-50/50' 
                      : 'text-[#2D5A27]/60 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <ComingSoonModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle}
      />
    </div>
  );
};

export default UserMenu;
