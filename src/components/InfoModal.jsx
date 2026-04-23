import React from 'react';
import { motion } from 'framer-motion';
import { X, Leaf, Camera, Mail, Phone } from 'lucide-react';

const InfoModal = ({ type, onClose }) => {
  const content = {
    about: {
      title: 'Our Philosophy',
      subtitle: 'The Art of Preservation',
      description: 'Garing Alami is a curated atelier of premium dried fruits, where tradition meets modern luxury. Born from the rich volcanic soil of Indonesia, each fruit is hand-selected at its peak ripeness and slowly preserved using time-honored techniques to capture its truest essence. We do not just dry fruit; we concentrate nature\'s vibration into a timeless culinary experience.',
      icon: <Leaf className="w-8 h-8 text-[#2D5A27] stroke-[1px] opacity-30" />
    },
    contact: {
      title: 'Get In Touch',
      subtitle: 'Atelier Inquiries',
      description: 'Whether you are inquiring about a custom collection, wholesale opportunities, or simply wish to share your experience, our concierge is here to assist you.',
      details: [
        { icon: <Mail size={14} />, label: 'Email', value: 'atelier@garingalami.com' },
        { icon: <Camera size={14} />, label: 'Instagram', value: '@garingalami.official' },
        { icon: <Phone size={14} />, label: 'WhatsApp', value: '+62 812 3456 7890' }
      ]
    }
  };

  const data = content[type] || content.about;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-2xl bg-white p-12 md:p-24 text-center space-y-12 shadow-sm"
      >
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 p-2 text-[#2D5A27]/20 hover:text-[#2D5A27] transition-colors"
        >
          <X size={24} strokeWidth={1} />
        </button>

        <header className="space-y-6">
          <div className="flex justify-center mb-8">
            {data.icon || <Leaf className="w-8 h-8 text-[#2D5A27] stroke-[1px] opacity-30" />}
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.5em] text-[#2D5A27]/40">{data.subtitle}</h4>
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#2D5A27]">{data.title}</h2>
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <p className="text-sm leading-relaxed tracking-wide text-[#2D5A27]/60 font-medium">
            {data.description}
          </p>
        </div>

        {type === 'contact' && (
          <div className="grid gap-6 pt-8">
            {data.details.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[#2D5A27]/30">{item.label}</span>
                <span className="text-xs font-bold text-[#2D5A27] tracking-wider">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <footer className="pt-12">
          <button 
            onClick={onClose}
            className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#2D5A27] border-b border-[#2D5A27]/10 pb-2 hover:border-[#2D5A27] transition-all"
          >
            Back to Collection
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default InfoModal;
