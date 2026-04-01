import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const CTA = () => {
    const { t } = useLanguage();

    return (
        <section className="py-12 md:py-16 relative overflow-hidden bg-brand-cream">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-brand-blue rounded-[2.25rem] p-6 md:p-[clamp(2.5rem,6vw,4.5rem)] text-center relative shadow-2xl relative">
                    {/* Decorative Gold Glow - Clipped internally */}
                    <div className="absolute inset-0 overflow-hidden rounded-[2.25rem] pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Sustainability Report Round Stamp Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 5, rotate: -45 }}
                        whileInView={{ opacity: [0, 1, 1], scale: [5, 0.85, 1], rotate: [-45, 12, 15] }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", times: [0, 0.7, 1] }}
                        className="absolute top-8 -right-3 sm:top-4 sm:-right-4 md:top-4 md:-right-6 lg:-right-10 xl:-right-14 z-20 pointer-events-none transform origin-center"
                    >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[clamp(150px,15vw,200px)] md:h-[clamp(150px,15vw,200px)] rounded-full border-[3px] sm:border-[4px] md:border-[6px] border-red-600/95 flex items-center justify-center p-1 shadow-2xl bg-[#FFFDF8]">
                            <div className="w-full h-full rounded-full border-[1px] md:border-[2.5px] border-red-600/90 flex flex-col items-center justify-center text-center p-1 bg-transparent">
                                <span className="text-red-500 font-black text-[5.5px] sm:text-[7px] md:text-[clamp(10px,1vw,14px)] tracking-[0.15em] uppercase leading-tight px-1 w-full">
                                    Sustainability
                                </span>
                                <div className="w-[80%] h-px bg-red-500/60 my-[1px] sm:my-0.5 md:my-1.5"></div>
                                <span className="text-red-500 font-black text-[9px] sm:text-[11px] md:text-[clamp(16px,2vw,22px)] tracking-[0.2em] font-serif uppercase leading-none opacity-95">
                                    Report
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-medium tracking-tight text-white mb-6 relative z-10 leading-[1.1]">
                        {t('cta.title')}
                    </h2>
                    <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-neutral-400 mb-10 max-w-2xl mx-auto relative z-10 font-light leading-relaxed">
                        {t('cta.desc')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <input
                            type="email"
                            placeholder={t('cta.input_placeholder')}
                            className="w-full sm:w-96 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                        />
                        <Link
                            to="/contact"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-gold text-brand-blue font-semibold hover:bg-brand-cyan hover:text-white transition-all whitespace-nowrap shadow-lg shadow-brand-gold/20 flex items-center justify-center"
                        >
                            {t('cta.button')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
