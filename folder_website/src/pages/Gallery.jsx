import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Instagram } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';

/**
 * Gallery — Halaman Galeri Foto
 * Menampilkan koleksi foto dalam grid Masonry-style yang dinamis.
 * Menggunakan data statis dan dukungan multi-bahasa.
 */
const Gallery = () => {
    const { t } = useLanguage();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/gallery`);
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = activeCategory === 'All'
        ? images
        : images.filter(img => img.category === activeCategory);

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.gallery_title'))}</title>
                <meta name="description" content={t('seo.gallery_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <header className="mb-20 text-center">
                        <motion.span
                            {...fadeIn}
                            className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                        >
                            {t('gallery.header_label')}
                        </motion.span>
                        <motion.h1
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-medium tracking-tight text-stone-dark mb-6"
                        >
                            {t('gallery.header_title')}<span className="text-brand-blue italic">{t('gallery.header_title_accent')}</span>
                        </motion.h1>
                        <motion.p
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-stone-dark/60 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            {t('gallery.header_desc')}
                        </motion.p>
                    </header>

                    {/* Category Filter */}
                    <motion.div 
                        {...fadeIn}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16"
                    >
                        {['All', ...new Set(images.map(img => img.category))].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
                                    activeCategory === cat 
                                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 scale-105' 
                                    : 'bg-white text-stone-dark/50 border-stone-border/50 hover:border-brand-blue hover:text-brand-blue'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* Grid Galeri */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (images.length === 0 || filteredImages.length === 0) ? (
                        <div className="text-center py-20">
                            <p className="text-[#78716C] font-medium tracking-widest uppercase text-xs">Belum ada foto di kategori ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredImages.map((img, idx) => (
                                    <motion.div
                                        layout
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                                        className={`relative group overflow-hidden rounded-[2rem] shadow-lg bg-neutral-100 transform-gpu ${
                                            idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[2/1]' 
                                            : idx === 1 ? 'aspect-square' 
                                            : 'aspect-[4/3]'
                                        }`}
                                    >
                                        {/* Image — fills card edge to edge */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <img
                                                src={img.image}
                                                alt={img.title}
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-brand-blue shadow-lg border border-white/20">
                                                {img.category}
                                            </span>
                                        </div>

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/80 via-stone-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-6 pointer-events-none">
                                            <h3 className="text-white text-lg md:text-xl font-semibold tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                                                {img.title}
                                            </h3>
                                            <div className="w-10 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100 origin-left mt-2"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}


                    {/* Instagram CTA */}
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.6 }}
                        className="mt-24 p-12 bg-white rounded-[3.5rem] border border-brand-gold/20 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8"
                    >
                        <div className="max-w-md text-center md:text-left">
                            <h3 className="text-3xl font-serif font-medium text-stone-dark mb-4">{t('gallery.follow_title')}</h3>
                            <p className="text-[#78716C] font-light">{t('gallery.follow_desc')}</p>
                        </div>
                        <a
                            href="https://instagram.com/pakuaty.artisan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-stone-dark transition-all shadow-xl active:scale-95"
                        >
                            <Instagram className="w-5 h-5" />
                            {t('gallery.follow_cta')}
                        </a>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Gallery;
