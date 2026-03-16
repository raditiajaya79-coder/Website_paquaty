import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/products';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Custom funnel icon — 3 horizontal lines of decreasing width
const FunnelIcon = () => (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const Products = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [activeTag, setActiveTag] = useState('All');
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const { data: products = [], isLoading: loading } = useSWR(
        'https://api-pakuaty.kediritechnopark.com/api/products',
        fetcher,
        { refreshInterval: 60000, revalidateOnFocus: true }
    );

    const productTypes = useMemo(() => {
        const types = products.map((p) =>
            p.grade?.toLowerCase().includes('mushroom') || p.grade?.toLowerCase().includes('jamur') || p.grade_en?.toLowerCase().includes('mushroom')
                ? t('products.type_mushroom') : t('products.type_tempe')
        );
        return ['All', ...new Set(types)];
    }, [products, t]);

    const productTags = useMemo(() => {
        const tags = products.map((p) => p.tag).filter(Boolean);
        return ['All', ...new Set(tags)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.grade?.toLowerCase().includes(q) || p.tag?.toLowerCase().includes(q);
            const isJamur = p.grade?.toLowerCase().includes('mushroom') || p.grade?.toLowerCase().includes('jamur') || p.grade_en?.toLowerCase().includes('mushroom');
            const matchType = activeType === 'All' || (isJamur ? t('products.type_mushroom') : t('products.type_tempe')) === activeType;
            const matchTag = activeTag === 'All' || p.tag === activeTag;
            return matchSearch && matchType && matchTag;
        });
    }, [products, searchQuery, activeType, activeTag]);

    const hasActiveFilters = activeType !== 'All' || activeTag !== 'All' || searchQuery;
    const hasFilterSelected = activeType !== 'All' || activeTag !== 'All';
    const clearAll = () => { setSearchQuery(''); setActiveType('All'); setActiveTag('All'); };
    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.products_title'))}</title>
                <meta name="description" content={t('seo.home_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-12 md:mb-16">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-4 block">
                            {t('products.header_label')}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-6 leading-tight">
                            {t('products.header_title')}<span className="text-brand-blue italic">{t('products.header_title_accent')}</span>
                        </h1>
                        <p className="text-lg text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            {t('products.header_desc')}
                        </p>
                    </motion.div>

                    {/* Search Bar with Filter Button */}
                    <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="max-w-2xl mx-auto mb-12 md:mb-16">
                        <div className="relative" ref={filterRef}>
                            {/* Main bar */}
                            <div className="flex items-center bg-white border-2 border-stone-border/50 rounded-2xl shadow-sm focus-within:border-brand-blue focus-within:shadow-md transition-all duration-300">
                                {/* Search */}
                                <div className="flex items-center flex-1 min-w-0 px-5 py-3.5">
                                    <Search className="w-5 h-5 text-stone-dark/30 shrink-0 mr-3" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('products.search_placeholder')}
                                        className="flex-1 min-w-0 bg-transparent text-stone-dark placeholder:text-stone-dark/30 text-sm font-medium focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="ml-2 text-stone-dark/30 hover:text-stone-dark transition-colors shrink-0">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="w-px h-7 bg-stone-border/60 shrink-0" />

                                {/* Filter toggle button */}
                                <button
                                    onClick={() => setFilterOpen((v) => !v)}
                                    className={`relative flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors duration-200 shrink-0 ${filterOpen || hasFilterSelected ? 'text-brand-blue' : 'text-stone-dark/50 hover:text-brand-blue'}`}
                                >
                                    <FunnelIcon />
                                    <span className="hidden sm:inline">{t('products.filter')}</span>
                                    {/* Blue dot indicator */}
                                    {hasFilterSelected && (
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-blue" />
                                    )}
                                </button>
                            </div>

                            {/* Dropdown panel */}
                            <AnimatePresence>
                                {filterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-border/60 rounded-2xl shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="p-5 grid sm:grid-cols-2 gap-6">
                                            {/* Type */}
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-dark/30 mb-3">{t('products.filter_type')}</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {productTypes.map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => { setActiveType(type); }}
                                                            className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeType === type ? 'bg-brand-blue text-white' : 'text-stone-dark/60 hover:bg-stone-50 hover:text-stone-dark'}`}
                                                        >
                                                            {type === 'All' ? t('products.all_types') : type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Flavor / Tag */}
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-dark/30 mb-3">{t('products.filter_flavor')}</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {productTags.map((tag) => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => { setActiveTag(tag); }}
                                                            className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTag === tag ? 'bg-brand-blue text-white' : 'text-stone-dark/60 hover:bg-stone-50 hover:text-stone-dark'}`}
                                                        >
                                                            {tag === 'All' ? t('products.all_flavors') : tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {hasFilterSelected && (
                                            <div className="border-t border-stone-border/40 px-5 py-3 flex justify-end">
                                                <button onClick={() => { setActiveType('All'); setActiveTag('All'); }} className="text-[10px] font-bold text-brand-blue/70 hover:text-brand-blue uppercase tracking-widest flex items-center gap-1">
                                                    <X className="w-3 h-3" /> {t('products.clear_filters')}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Result count */}
                        {!loading && (
                            <div className="flex items-center justify-between mt-3 px-1">
                                <p className="text-xs text-stone-dark/40 font-medium tracking-wide">
                                    {filteredProducts.length} {filteredProducts.length !== 1 ? t('products.results_found_plural') : t('products.results_found')}
                                </p>
                                {hasActiveFilters && (
                                    <button onClick={clearAll} className="flex items-center gap-1 text-[10px] font-bold text-brand-blue/70 hover:text-brand-blue transition-colors uppercase tracking-widest">
                                        <X className="w-3 h-3" /> {t('products.clear_all')}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24"
                        >
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-stone-dark font-semibold text-lg mb-2">{t('products.no_products')}</p>
                            <p className="text-[#78716C] text-sm">{t('products.no_products_desc')}</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                                    >
                                        <Link to={`/products/${product.id}`} className="block group h-full">
                                            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-stone-border/50 hover:border-brand-gold/40 transition-all duration-700 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transform-gpu h-full flex flex-col">

                                                {/* Image Area */}
                                                <div className="relative overflow-hidden bg-gradient-to-br from-stone-50 to-neutral-100 aspect-square flex items-center justify-center p-4 sm:p-8">
                                                    {/* Subtle radial glow behind product */}
                                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.04)_0%,_transparent_70%)]" />
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="relative z-10 max-w-full max-h-full object-contain transition-all duration-1000 group-hover:scale-110 drop-shadow-2xl"
                                                    />
                                                    {/* Tag Badge */}
                                                    {product.tag && (
                                                        <span className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-gold text-stone-dark shadow-md">
                                                            {product.tag}
                                                        </span>
                                                    )}
                                                    {/* Arrow hover indicator */}
                                                    <div className="absolute bottom-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                        <ArrowRight className="w-4 h-4 text-stone-dark -rotate-45" />
                                                    </div>
                                                </div>

                                                <div className="p-4 md:p-6 flex-1 flex flex-col gap-3 md:gap-4">
                                                    <div>
                                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-stone-dark tracking-tight leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-0">
                                                            {(isEn && product.name_en) ? product.name_en : product.name}
                                                        </h3>
                                                        <p className="text-brand-gold-dark text-[10px] sm:text-xs md:text-sm font-medium mt-1 uppercase tracking-wider">
                                                            {(isEn && product.grade_en) ? product.grade_en : product.grade}
                                                        </p>
                                                    </div>

                                                    {product.price && (
                                                        <div className="flex flex-wrap items-baseline gap-1 md:gap-2">
                                                            <span className="text-lg sm:text-xl md:text-2xl font-black text-stone-dark">
                                                                Rp {formatPrice(product.price)}
                                                            </span>
                                                            {product.original_price && product.original_price > product.price && (
                                                                <span className="text-[10px] md:text-xs text-[#A8A29E] line-through font-medium">
                                                                    Rp {formatPrice(product.original_price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-auto flex items-center justify-between pt-3 md:pt-4 border-t border-stone-border/60">
                                                        <div>
                                                            <p className="text-[8px] md:text-[10px] text-[#78716C] uppercase tracking-widest mb-0.5 opacity-60">{t('products.origin_label')}</p>
                                                            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-stone-dark tracking-tight">
                                                                {(isEn && product.origin_en) ? product.origin_en : product.origin}
                                                            </p>
                                                        </div>
                                                        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-blue opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                                            {t('products.view_details')} <ArrowRight className="w-3.5 h-3.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;


