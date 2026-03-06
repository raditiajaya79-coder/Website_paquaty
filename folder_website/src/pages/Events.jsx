import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { generatePageTitle } from '../utils/seo';

import { useLanguage } from '../context/LanguageContext';

const Events = () => {
    const { t } = useLanguage();
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const articles = [
        { id: 1, image: "/images/keripik tempe original pakuaty.jpg" },
        { id: 2, image: "/images/keirpik tempe balado pakuaty.jpg" },
        { id: 3, image: "/images/logo pakuaty tagline.png" },
        { id: 4, image: "/images/keripik tempe sapi pakuaty.jpg" },
        { id: 5, image: "/images/keripik jamur pakuaty.jpg" },
        { id: 6, image: "/images/FOTO ALL KERIPIK TEMPE.jpg" }
    ];

    return (
        <div className="bg-brand-cream min-h-screen pt-32 pb-24 relative overflow-hidden">
            <Helmet>
                <title>{generatePageTitle(t('seo.events_title'))}</title>
                <meta name="description" content={t('seo.events_desc')} />
            </Helmet>

            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-20 text-center">
                    <motion.span
                        {...fadeIn}
                        className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                    >
                        {t('events.header_label')}
                    </motion.span>
                    <motion.h1
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-medium tracking-tight text-stone-dark mb-6"
                    >
                        {t('events.header_title')}<span className="text-brand-blue italic">{t('events.header_title_accent')}</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-dark/60 max-w-2xl mx-auto"
                    >
                        {t('events.header_desc')}
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {articles.map((article, idx) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-xl bg-white group">
                                <img
                                    src={article.image}
                                    alt={t(`article.${article.id}.title`)}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-blue shadow-lg">
                                        {t(`article.${article.id}.cat`)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                        {t(`article.${article.id}.date`) || "2026"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-brand-gold-dark" />
                                        {t(`article.${article.id}.author`)}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-stone-dark group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                    {t(`article.${article.id}.title`)}
                                </h2>

                                <p className="text-[#57534E] leading-relaxed line-clamp-3 font-light">
                                    {t(`article.${article.id}.excerpt`)}
                                </p>

                                <Link
                                    to={`/events/${article.id}`}
                                    className="pt-4 flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300"
                                >
                                    {t('events.read_more')}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
