import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Sprout, Microscope, Package, Store } from 'lucide-react';

const JourneySection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useSpring(
        useTransform(scrollYProgress, [0.1, 0.5], [0, 1]),
        { stiffness: 100, damping: 30, restDelta: 0.001 }
    );

    const steps = [
        {
            id: '01',
            icon: Sprout,
            title: 'Premium Soybeans',
            desc: 'Locally sourced non-GMO soybeans for the freshest quality.'
        },
        {
            id: '02',
            icon: Microscope,
            title: 'Natural Fermentation',
            desc: 'Traditional 48-hour slow fermentation process.'
        },
        {
            id: '03',
            icon: Package,
            title: 'Bold Seasoning',
            desc: 'Hand-seasoned with signature heritage spice blends.'
        },
        {
            id: '04',
            icon: Store,
            title: 'Export Ready',
            desc: 'Vacuum-sealed to ensure international export quality.'
        }
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <section ref={containerRef} className="py-32 bg-[#1A1A1A] text-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div {...fadeIn} className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-[0.2em] uppercase border border-brand-blue/20">
                            OUR HERITAGE PROCESS
                        </span>
                    </motion.div>
                    
                    <motion.h2 
                        {...fadeIn} 
                        transition={{ ...fadeIn.transition, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tighter"
                    >
                        From Soybean to <span className="text-brand-gold italic">Crunch</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Animated Connecting Line (SVG) */}
                    <div className="hidden lg:block absolute top-[44px] left-[15%] right-[15%] h-1 z-0">
                        <svg width="100%" height="4" viewBox="0 0 800 4" fill="none" preserveAspectRatio="none" className="w-full">
                            <line x1="0" y1="2" x2="800" y2="2" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="6 6" />
                            <motion.line 
                                x1="0" y1="2" x2="800" y2="2" 
                                stroke="#D4AF37" 
                                strokeWidth="2" 
                                style={{ pathLength }}
                            />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-2 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.id}
                                {...fadeIn}
                                transition={{ ...fadeIn.transition, delay: 0.2 + (idx * 0.1) }}
                                className="flex flex-col items-center text-center group cursor-default"
                            >
                                {/* Icon Card */}
                                <div className="relative mb-5">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 bg-brand-gold text-stone-dark rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black z-20 border-[2px] border-[#1A1A1A] shadow-lg group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                                        {step.id}
                                    </div>
                                    
                                    {/* Icon Container */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 border border-white/5 bg-white/5 backdrop-blur-sm group-hover:bg-brand-gold/10 group-hover:scale-105 group-hover:border-brand-gold/30 group-hover:shadow-brand-gold/20">
                                        <step.icon className="w-8 h-8 md:w-9 md:h-9 text-brand-gold group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Step Info */}
                                <div className="px-1">
                                    <h3 className="text-base md:text-lg font-black mb-1 tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                                        {step.title}
                                    </h3>

                                    <p className="text-[12px] md:text-[13px] text-zinc-400 leading-relaxed max-w-[170px] font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
