import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const BossRoom = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'bintangmada') {
      alert('Welcome to the Boss Room!');
      // Future: Navigate to real dashboard
    } else {
      setError('Invalid Access Key');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#2D5A27] selection:text-white">
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
            className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto border border-white/5"
          >
            <Lock className="text-[#2D5A27] w-6 h-6 stroke-[1.5px]" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.4em]">Boss Room</h1>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium">Atelier Internal Access Only</p>
          </div>
        </div>

        {/* Secret Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="ENTER ACCESS KEY"
              className="w-full bg-[#141414] border border-white/5 rounded-2xl px-6 py-5 text-white text-[11px] tracking-[0.4em] placeholder:text-white/10 focus:outline-none focus:border-[#2D5A27]/50 transition-all font-bold"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hover:text-[#2D5A27] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
            type="submit"
            className="w-full bg-[#2D5A27] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#346a2d] transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-[#2D5A27]/20"
          >
            Authenticate
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-12 text-center">
          <button 
            onClick={onClose}
            className="text-white/10 hover:text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold transition-all underline underline-offset-8"
          >
            Return to Public Atelier
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BossRoom;
