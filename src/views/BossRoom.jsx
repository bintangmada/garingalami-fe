import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import CommandCenter from '../components/CommandCenter';

console.log("%c 🚀 BOSS ROOM v4.0 TITANIUM READY ", "background: #1A1A1A; color: #10b981; font-weight: bold; padding: 10px;");

const BossRoom = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session and Add ESC key listener
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'active') {
      setIsAuthenticated(true);
    }

    const handleEsc = (e) => {
      // Only allow ESC to close if we are still on the login screen
      if (e.key === 'Escape' && !isAuthenticated) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('admin_session', 'active');
        localStorage.setItem('admin_user', username);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err.response?.data || 'Connection failed to the Atelier server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    onClose();
  };

  if (isAuthenticated) {
    return <CommandCenter onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 selection:bg-[#2D5A27] selection:text-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-[400px] space-y-12"
      >
        {/* Mysterious Branding */}
        <div className="space-y-4 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto border border-[#F0F0F0] shadow-sm"
          >
            <Lock className="text-[#2D5A27] w-6 h-6 stroke-[1.5px]" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-[#1A1A1A] text-xl font-black uppercase tracking-[0.4em]">Boss Room</h1>
            <p className="text-[#A0A0A0] text-[10px] uppercase tracking-[0.3em] font-medium">Atelier Internal Access Only</p>
          </div>
        </div>

        {/* Secret Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div className="relative">
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              required
              className="w-full bg-[#F8F9FA] border border-[#EEEEEE] rounded-2xl px-6 py-5 text-[#1A1A1A] text-[11px] tracking-[0.4em] placeholder:text-[#CCCCCC] focus:outline-none focus:border-[#2D5A27]/30 transition-all font-bold"
            />
            <User size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D0D0D0]" />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="ACCESS KEY"
              required
              className="w-full bg-[#F8F9FA] border border-[#EEEEEE] rounded-2xl px-6 py-5 text-[#1A1A1A] text-[11px] tracking-[0.4em] placeholder:text-[#CCCCCC] focus:outline-none focus:border-[#2D5A27]/30 transition-all font-bold"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D0D0D0] hover:text-[#2D5A27] transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500/60 text-[9px] uppercase tracking-widest text-center font-bold"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#2D5A27] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-black/5 hover:shadow-[#2D5A27]/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
            {isLoading ? "Validating..." : "Enter Workspace"}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-12 text-center">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#1A1A1A] transition-all mx-auto"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Return to Public Atelier</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BossRoom;
