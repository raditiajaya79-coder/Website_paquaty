import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Instagram, Search, X, ChevronDown } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';

// Custom funnel icon — 3 horizontal lines of decreasing width
const FunnelIcon = () => (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

/**
 * Gallery — Halaman Galeri Foto
 * Menampilkan koleksi foto dalam grid yang dinamis.
 * Kini dilengkapi dengan fitur pencarian dan filter kategori ala produk.
 */
const Gallery = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const categories = ['All', ...new Set((Array.isArray(images) ? images : []).map(img => img.category))];

    const filteredImages = (Array.isArray(images) ? images : []).filter(img => {
        const title = (isEn && img.title_en) ? img.title_en : (img.title || '');
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

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
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-12 md:mb-16">
                        <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">
                            {t('gallery.header_label')}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-stone-dark mb-6 leading-tight">
                            {t('gallery.header_title')}<span className="text-brand-blue italic">{t('gallery.header_title_accent')}</span>
                        </h1>
                        <p className="text-lg text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            {t('gallery.header_desc')}
                        </p>
                    </motion.div>

                    {/* Search Bar with Filter Button (Product style) */}
                    <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="max-w-2xl mx-auto mb-12 md:mb-16">
                        <div className="relative" ref={filterRef}>
                            <div className="flex items-center bg-white border-2 border-stone-border/50 rounded-2xl shadow-sm focus-within:border-brand-blue focus-within:shadow-md transition-all duration-300">
                                {/* Search Input */}
                                <div className="flex items-center flex-1 min-w-0 px-5 py-3.5">
                                    <Search className="w-5 h-5 text-stone-dark/30 shrink-0 mr-3" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('gallery.search_placeholder')}
                                        className="flex-1 min-w-0 bg-transparent text-stone-dark placeholder:text-stone-dark/30 text-sm font-medium focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="ml-2 text-stone-dark/30 hover:text-stone-dark transition-colors shrink-0">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="w-px h-7 bg-stone-border/60 shrink-0" />

                                {/* Filter Toggle */}
                                <button
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className={`relative flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors duration-200 shrink-0 ${filterOpen || activeCategory !== 'All' ? 'text-brand-blue' : 'text-stone-dark/50 hover:text-brand-blue'}`}
                                >
                                    <FunnelIcon />
                                    <span className="hidden sm:inline">{t('gallery.filter')}</span>
                                    {activeCategory !== 'All' && (
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-blue" />
                                    )}
                                </button>
                            </div>

                            {/* Dropdown Panel */}
                            <AnimatePresence>
                                {filterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-border/60 rounded-2xl shadow-xl overflow-hidden z-50 p-6"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                                {t('gallery.all_categories')}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setActiveCategory(cat);
                                                            setFilterOpen(false);
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                                                            activeCategory === cat
                                                            ? 'bg-brand-blue text-white border-brand-blue'
                                                            : 'bg-stone-50 text-stone-dark/60 border-transparent hover:border-brand-blue/30'
                                                        }`}
                                                    >
                                                        {cat === 'All' ? t('gallery.all_categories') : cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 px-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">
                            <span>
                                {filteredImages.length} {filteredImages.length === 1 ? t('gallery.results_found') : t('gallery.results_found_plural')}
                            </span>
                            {(searchQuery || activeCategory !== 'All') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('All');
                                    }}
                                    className="text-brand-blue hover:underline underline-offset-4 decoration-brand-blue/30"
                                >
                                    {t('products.clear_all')}
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Grid Galeri */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-stone-border/40 max-w-2xl mx-auto">
                            <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-stone-dark/20" />
                            </div>
                            <h3 className="text-xl font-medium text-stone-dark mb-2">{t('gallery.no_images')}</h3>
                            <p className="text-stone-dark/50 font-light">{t('gallery.no_images_desc')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredImages.map((img, idx) => (
                                    <motion.div
                                        layout
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                                        className={`relative group overflow-hidden rounded-2xl md:rounded-[2rem] shadow-lg bg-neutral-100 transform-gpu ${
                                            idx === 0 ? 'col-span-2 lg:col-span-2 aspect-[2/1]' 
                                            : idx === 1 ? 'aspect-square' 
                                            : 'aspect-[4/3]'
                                        }`}
                                    >
                                        <div className="absolute inset-0 overflow-hidden">
                                            <img
                                                src={img.image}
                                                alt={img.title}
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                                            <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-brand-blue shadow-lg border border-white/20">
                                                {img.category}
                                            </span>
                                        </div>

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/80 via-stone-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                                            <h3 className="text-white text-sm md:text-xl font-semibold tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                                                {(isEn && img.title_en) ? img.title_en : img.title}
                                            </h3>
                                            <div className="w-8 md:w-10 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100 origin-left mt-1 md:mt-2"></div>
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
