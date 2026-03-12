import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Instagram } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';

/**
 * Gallery — Halaman Galeri Foto
 * Menampilkan koleksi foto dalam grid Masonry-style yang dinamis.
 * Menggunakan data statis dan dukungan multi-bahasa.
 */
const Gallery = () => {
    const { t } = useLanguage();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/gallery');
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

                    {/* Grid Galeri */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#78716C] font-medium tracking-widest uppercase text-xs">Belum ada foto di galeri.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-8">
                            {images.map((img, idx) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                    className={`relative group overflow-hidden rounded-[1.5rem] md:rounded-[3rem] shadow-md md:shadow-xl bg-white border border-stone-border/30 transform-gpu ${img.span || 'col-span-1 md:col-span-4'} ${img.aspect || 'aspect-square'}`}
                                >
                                    {/* Image Container */}
                                    <div className="absolute inset-0 p-2 md:p-4 transition-all duration-700 group-hover:p-0">
                                        <img
                                            src={img.image}
                                            alt={img.title}
                                            className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[2.2rem] transition-all duration-1000 group-hover:rounded-none group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                                        <span className="px-2.5 py-1 md:px-4 md:py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue shadow-xl border border-white/20">
                                            {img.category}
                                        </span>
                                    </div>

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/90 via-stone-dark/20 to-transparent xl:opacity-0 xl:group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-4 md:p-10 pointer-events-none opacity-100 sm:opacity-0 group-hover:opacity-100">
                                        <h3 className="text-white text-base md:text-3xl font-medium tracking-tight translate-y-0 xl:translate-y-4 xl:group-hover:translate-y-0 transition-transform duration-700 delay-100 line-clamp-2 md:line-clamp-none">
                                            {img.title}
                                        </h3>
                                        <div className="w-8 md:w-12 h-0.5 bg-brand-gold scale-x-100 xl:scale-x-0 xl:group-hover:scale-x-100 transition-transform duration-700 delay-200 origin-left mt-2"></div>
                                    </div>
                                </motion.div>
                            ))}
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
