import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CTA = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 relative overflow-hidden bg-brand-cream">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-brand-blue rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden">
                    {/* Decorative Gold Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 relative z-10">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto relative z-10 font-light">
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
