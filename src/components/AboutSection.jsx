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
    <section className="px-6 md:px-12 py-20 md:py-40 bg-[#fdfdfd]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* Visual Storytelling */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/5] md:aspect-[1/1.2] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#2D5A27]/5">
              <img 
                src="assets/brand-story.png" 
                alt="Our Atelier" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Elegant Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -bottom-8 -right-8 bg-white p-8 md:p-12 shadow-xl rounded-2xl hidden md:block border border-[#2D5A27]/5"
            >
              <p className="text-[14px] md:text-[16px] font-black text-[#2D5A27] tracking-widest uppercase leading-tight italic">
                The Art of <br /> Preservation
              </p>
            </motion.div>
          </motion.div>

          {/* Text Storytelling */}
          <div className="space-y-12 md:space-y-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#2D5A27]/20" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] text-[#2D5A27]/40">Our Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#2D5A27] leading-[1.1] tracking-tight">
                Translating nature <br className="hidden md:block" /> 
                into a <span className="italic font-medium">curated</span> <br className="hidden md:block" /> 
                culinary experience.
              </h2>
              <p className="text-[12px] md:text-[14px] leading-loose text-[#2D5A27]/60 tracking-wide font-medium max-w-lg">
                At Garing Alami, we don't just dry fruits; we curate their essence. Our atelier follows a slow, meticulous process to ensure every bite resonates with the original vibration of the earth.
              </p>
            </motion.div>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 pt-12 border-t border-[#2D5A27]/10">
              {pillars.map((pillar, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                  className="space-y-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2D5A27]/5 flex items-center justify-center mb-6">
                    {pillar.icon}
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2D5A27]">{pillar.title}</h4>
                  <p className="text-[10px] leading-relaxed text-[#2D5A27]/50 font-medium tracking-wide">
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
