import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Sprout, Microscope, Package, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const JourneySection = () => {
    const { t } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useSpring(
        useTransform(scrollYProgress, [0.05, 0.45], [0, 1]),
        { stiffness: 100, damping: 30, restDelta: 0.001 }
    );

    const steps = [
        {
            id: '01',
            icon: Sprout,
            title: t('journey.step1_title'),
            desc: t('journey.step1_desc')
        },
        {
            id: '02',
            icon: Microscope,
            title: t('journey.step2_title'),
            desc: t('journey.step2_desc')
        },
        {
            id: '03',
            icon: Package,
            title: t('journey.step3_title'),
            desc: t('journey.step3_desc')
        },
        {
            id: '04',
            icon: Store,
            title: t('journey.step4_title'),
            desc: t('journey.step4_desc')
        }
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-[#1A1A1A] text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div {...fadeIn} className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-[0.2em] uppercase border border-brand-blue/20">
                            {t('journey.badge')}
                        </span>
                    </motion.div>
                    
                    <motion.h2 
                        {...fadeIn} 
                        transition={{ ...fadeIn.transition, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tighter"
                    >
                        {t('journey.title_part1')} <span className="text-brand-gold italic">{t('journey.title_part2')}</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Main Scrollable Container for Mobile / Grid for Desktop */}
                    <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory relative pt-6 pb-8 md:pb-0">
                        {/* The Inner Wrapper that contains the line and the steps */}
                        {/* We use a min-width on mobile to ensure the SVG line spans all items correctly */}
                        <div className="relative min-w-[1040px] md:min-w-0 md:grid md:grid-cols-4 md:gap-4 lg:gap-2">
                            
                            {/* Animated Connecting Line (Always visible now, moving with items) */}
                            <div className="absolute top-[48px] left-[12.5%] right-[12.5%] h-px z-0 pointer-events-none">
                                <svg width="100%" height="2" viewBox="0 0 800 2" fill="none" preserveAspectRatio="none" className="w-full">
                                    <line x1="0" y1="1" x2="800" y2="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="8 8" />
                                    <motion.line 
                                        x1="0" y1="1" x2="800" y2="1" 
                                        stroke="#E5B326" 
                                        strokeWidth="2" 
                                        style={{ pathLength }}
                                    />
                                </svg>
                            </div>

                            <div className="flex md:contents">
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={step.id}
                                        {...fadeIn}
                                        transition={{ ...fadeIn.transition, delay: 0.2 + (idx * 0.1) }}
                                        className="flex flex-col items-center text-center group cursor-default w-[260px] md:w-auto snap-center"
                                    >
                                        {/* Icon Card */}
                                        <div className="relative mb-5 px-4">
                                            {/* Step Number Badge */}
                                            <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 bg-brand-gold text-stone-dark rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black z-20 border-[2px] border-[#1A1A1A] shadow-lg group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                                                {step.id}
                                            </div>
                                            
                                            {/* Icon Container (Consistently sized like desktop) */}
                                            <div className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 border border-white/5 bg-white/5 backdrop-blur-sm group-hover:bg-brand-gold/10 group-hover:scale-105 group-hover:border-brand-gold/30 group-hover:shadow-brand-gold/20 relative z-10">
                                                <step.icon className="w-9 h-9 text-brand-gold group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        {/* Step Info */}
                                        <div className="px-6 flex flex-col items-center flex-1">
                                            <h3 className="text-base md:text-lg font-black mb-1.5 tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                                                {step.title}
                                            </h3>

                                            <p className="text-[12px] md:text-[13px] text-zinc-400 leading-relaxed max-w-[190px] font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
