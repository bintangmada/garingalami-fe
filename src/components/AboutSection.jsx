import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Heart } from 'lucide-react';

const AboutSection = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2D5A27] stroke-[1.5px]" />,
      title: "Original Vibration",
      desc: "100% natural. No added sugars, preservatives, or artificial enhancers. We honor the fruit's true soul."
    },
    {
      icon: <Zap className="w-5 h-5 text-[#2D5A27] stroke-[1.5px]" />,
      title: "The Vacuum Art",
      desc: "Low-temperature vacuum technology preserves the vibrant colors, nutrients, and authentic crunch."
    },
    {
      icon: <Heart className="w-5 h-5 text-[#2D5A27] stroke-[1.5px]" />,
      title: "Local Soul",
      desc: "Sourced directly from Indonesian farmers, hand-selected at the peak of their natural ripeness."
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24 md:py-48 bg-[#fdfdfd] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40 items-center">
          {/* Visual Storytelling */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[1/1.2] rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(45,90,39,0.08)]">
              <img 
                src="assets/brand-story.png" 
                alt="Our Atelier" 
                className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#2D5A27]/5 mix-blend-multiply" />
            </div>
            
            {/* Elegant Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 bg-white/90 backdrop-blur-md p-8 md:p-14 shadow-2xl rounded-2xl hidden md:block border border-[#2D5A27]/5"
            >
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#2D5A27]/30 font-bold">Est. 1998</p>
                <p className="text-[16px] md:text-[20px] font-light text-[#2D5A27] tracking-wider leading-tight">
                  The Art of <br /> <span className="italic serif font-medium">Preservation</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Storytelling */}
          <div className="space-y-16 md:space-y-28">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-[#2D5A27]/10" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.8em] text-[#2D5A27]/30">The Atelier Creed</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-[#2D5A27] leading-[1.05] tracking-tight">
                Translating nature <br className="hidden md:block" /> 
                into a <span className="italic font-light serif">curated</span> <br className="hidden md:block" /> 
                culinary vibration.
              </h2>
              
              <div className="space-y-6 max-w-lg">
                <p className="text-[13px] md:text-[15px] leading-loose text-[#2D5A27]/60 tracking-wide font-medium italic">
                  "We don't just dry fruits; we curate their essence."
                </p>
                <p className="text-[12px] md:text-[14px] leading-loose text-[#2D5A27]/50 tracking-wide font-normal">
                  Our atelier follows a slow, meticulous preservation process. Every slice is a testament to our dedication to honoring the original frequency and soul of the earth's finest gifts.
                </p>
              </div>
            </motion.div>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16 pt-16 border-t border-[#2D5A27]/5">
              {pillars.map((pillar, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 1 }}
                  className="space-y-5"
                >
                  <div className="w-12 h-12 rounded-full bg-[#2D5A27]/5 flex items-center justify-center mb-4 transition-colors hover:bg-[#2D5A27]/10">
                    {pillar.icon}
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2D5A27]">{pillar.title}</h4>
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-[#2D5A27]/40 font-medium tracking-wide">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
