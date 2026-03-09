import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Icon: ArrowRight (tombol navigasi), Sprout/Microscope/Container/Store (section proses)
import { ArrowRight, Sprout, Microscope, Container, Store } from 'lucide-react';
import { api } from '../utils/api'; // Utilitas API backend
import CTA from '../components/CTA';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t } = useLanguage();
    // Session Management: Only show intro once per session
    const hasPlayedIntro = sessionStorage.getItem('pakuaty_intro_played');
    const [isRevealed, setIsRevealed] = useState(hasPlayedIntro === 'true');
    const [activeIndex, setActiveIndex] = useState(2);

    // State untuk data dari API
    const [heroItems, setHeroItems] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data dari API
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const products = await api.get('/products');

                // Filter untuk Hero (yang punya isHero true atau flavor tertentu)
                const heroFlavors = ["Original", "Balado", "BBQ", "Keju", "Sapi Panggang"];
                const filteredHero = products
                    .filter(p => p.isHero || heroFlavors.includes(p.name))
                    .map(p => ({
                        id: p.id,
                        src: p.image,
                        name: p.name
                    }));

                setHeroItems(filteredHero.length > 0 ? filteredHero : products.slice(0, 5).map(p => ({ id: p.id, src: p.image, name: p.name })));

                // Produk unggulan (terlaris atau 3 pertama)
                const featured = products.filter(p => p.isBestseller).slice(0, 3);
                setFeaturedProducts(featured.length > 0 ? featured : products.slice(0, 3));

            } catch (error) {
                console.error('Gagal memuat data home:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    // Logic: Autoplay interval (Selalu aktif jika data ada)
    useEffect(() => {
        if (!isRevealed || heroItems.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % heroItems.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isRevealed, heroItems.length]);

    useEffect(() => {
        if (hasPlayedIntro) return; // Skip if already played

        // Triggering reveal slightly earlier (800ms) to overlap with shutter motion for smoothness
        const timer = setTimeout(() => {
            setIsRevealed(true);
            sessionStorage.setItem('pakuaty_intro_played', 'true');
        }, 800);
        return () => clearTimeout(timer);
    }, [hasPlayedIntro]);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="bg-brand-cream text-stone-dark">
            {/* Hero Section — Balanced Premium "Muted Gold" Theme */}
            <section
                className="relative min-h-screen overflow-hidden bg-[#EAD890]"
            >
                {/* Luminous Warm Gradient Overlay — Adds depth/vignette */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2)_0%,_rgba(0,0,0,0.1)_100%)] pointer-events-none" />


                {/* Stage 1: Brand Intro (Stable Shutter & Unified Reveal) */}
                <div className="absolute inset-0 z-50 pointer-events-none flex flex-col overflow-hidden">
                    {/* Top Shutter */}
                    <motion.div
                        initial={{ y: hasPlayedIntro ? "-100%" : 0 }}
                        animate={{ y: isRevealed ? "-100%" : 0 }}
                        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: hasPlayedIntro ? 0 : 0.8 }}
                        className="flex-1 bg-neutral-bone border-b border-brand-gold/10"
                    />
                    {/* Bottom Shutter */}
                    <motion.div
                        initial={{ y: hasPlayedIntro ? "100%" : 0 }}
                        animate={{ y: isRevealed ? "100%" : 0 }}
                        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: hasPlayedIntro ? 0 : 0.8 }}
                        className="flex-1 bg-neutral-bone border-t border-brand-gold/10"
                    />

                    {/* Unified Intro Logo — Safe, Stable, and Prestigious (Only if not played) */}
                    {!hasPlayedIntro && (
                        <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
                            <motion.div
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{
                                    opacity: isRevealed ? 0 : 1,
                                    scale: isRevealed ? 1.2 : 1,
                                    filter: isRevealed ? "blur(10px)" : "blur(0px)"
                                }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                                className="text-center"
                            >
                                <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
                                    {"PAKUATY".split("").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1,
                                                ease: [0.215, 0.61, 0.355, 1]
                                            }}
                                            className="text-stone-dark text-4xl md:text-7xl font-serif tracking-widest block"
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                                    className="w-48 md:w-96 h-[1.5px] bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto"
                                />
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Main Hero Content Container — Adds Parallax Scale for World-Class smoothness */}
                <motion.div
                    initial={{ scale: hasPlayedIntro ? 1 : 1.05, opacity: hasPlayedIntro ? 1 : 0 }}
                    animate={{ scale: isRevealed ? 1 : 1.05, opacity: isRevealed ? 1 : 0 }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: hasPlayedIntro ? 0 : 0.5 }}
                    className="absolute inset-0 z-10"
                >
                    {/* Desktop Visual — Slices (Hidden on Mobile) */}
                    <div className="absolute inset-0 hidden md:block overflow-hidden">
                        {heroItems.map((item, idx) => {
                            const isActive = activeIndex === idx;

                            // Perhitungan posisi & lebar mutlak (Absolute) untuk SLICES
                            const widthPercent = isActive ? 44 : 14;

                            let leftPercent = 0;
                            for (let i = 0; i < idx; i++) {
                                const otherIsActive = activeIndex === i;
                                leftPercent += otherIsActive ? 44 : 14;
                            }

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 1.1, x: 100 }}
                                    animate={{
                                        opacity: isRevealed ? 1 : 0,
                                        scale: isRevealed ? 1 : 1.1,
                                        x: isRevealed ? 0 : 100,
                                        width: `${widthPercent + 4}%`,
                                        left: `${leftPercent - 2}%`
                                    }}
                                    transition={{
                                        width: { type: "spring", stiffness: 70, damping: 30, mass: 1 },
                                        left: { type: "spring", stiffness: 70, damping: 30, mass: 1 },
                                        opacity: { duration: 0.8, delay: 0.5 + (idx * 0.1) },
                                        x: { duration: 0.8, delay: 0.5 + (idx * 0.1) },
                                        scale: { duration: 0.8, delay: 0.5 + (idx * 0.1) }
                                    }}
                                    className="absolute top-0 h-full overflow-hidden transform-gpu"
                                    style={{
                                        zIndex: isActive ? 10 : idx,
                                        willChange: "width, left"
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            y: isActive ? [0, -3, 0] : 0,
                                            scale: isActive ? [1.1, 1.12, 1.1] : 1.1,
                                            filter: isActive ? "brightness(1) contrast(1)" : "brightness(0.7) contrast(0.85)"
                                        }}
                                        transition={{
                                            y: { duration: 8, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                                            scale: {
                                                duration: isActive ? 10 : 0.8,
                                                repeat: isActive ? Infinity : 0,
                                                ease: "easeInOut"
                                            },
                                            filter: { duration: 0.8 }
                                        }}
                                        className="absolute inset-0 w-full h-full flex items-center justify-center p-14"
                                    >
                                        <img
                                            src={item.src}
                                            alt={item.name}
                                            className="w-full h-full object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.12)] transform-gpu"
                                        />

                                        {/* Flavor Label — Floating at the bottom */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: isRevealed ? 1 : 0,
                                                y: isActive ? -40 : 20
                                            }}
                                            className="absolute bottom-10 left-0 right-0 text-center z-10"
                                        >
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-500 ${isActive ? 'bg-brand-gold text-stone-dark scale-110 shadow-xl' : 'bg-white/10 text-white backdrop-blur-md opacity-0'
                                                }`}>
                                                {item.name}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Mobile Visual — Centered & High-Impact (Hidden on Desktop) */}
                    <div className="absolute inset-0 md:hidden flex items-center justify-center pointer-events-none">
                        {heroItems.map((item, idx) => (
                            idx === activeIndex && (
                                <motion.div
                                    key={`mobile-${item.id}`}
                                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                                    animate={{
                                        opacity: 1,
                                        scale: [1, 1.6, 1], // Massive High-Impact Pulsing
                                        y: 0
                                    }}
                                    exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.4 } }}
                                    transition={{
                                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                        opacity: { duration: 0.7 },
                                        y: { duration: 0.7 }
                                    }}
                                    className="w-full flex flex-col items-center justify-center p-10"
                                >
                                    {/* Large Centered Hero Image for Mobile */}
                                    <div className="relative group/mobile">
                                        <div className="absolute inset-0 bg-brand-gold/10 blur-[60px] rounded-full scale-150 -z-10" />
                                        <motion.img
                                            src={item.src}
                                            alt={item.name}
                                            className="w-[92vw] h-auto max-h-[45vh] object-contain drop-shadow-[0_45px_90px_rgba(0,0,0,0.65)] transform-gpu"
                                        />
                                    </div>

                                    {/* Brand Micro-Label for Mobile Heritage */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-6 bg-brand-gold text-stone-dark px-6 py-1.5 rounded-full shadow-[0_15px_30px_rgba(218,165,32,0.3)] border border-white/20"
                                    >
                                        <span className="text-[11px] font-black tracking-[0.4em] uppercase">
                                            {item.name}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            )
                        ))}
                    </div>

                    {/* Floating Progress Bar for UX Feedback */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isRevealed ? 1 : 0 }}
                        className="absolute bottom-32 left-0 right-0 text-center z-40 pointer-events-none hidden md:block"
                    >
                        {/* Autoplay Progress Dots — Luminous & High-end */}
                        <div className="flex items-center justify-center gap-3 mt-4">
                            {heroItems.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-700 ${activeIndex === i
                                        ? 'w-10 bg-brand-gold'
                                        : 'w-2 bg-stone-dark/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Stage 2 Content (Overlays) */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(212,196,133,0.15)_0%,_rgba(180,160,100,0.05)_100%)] pointer-events-none">

                        <div className="max-w-7xl mx-auto px-6 text-center pointer-events-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 30 }}
                                transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h2 className="text-brand-gold font-black tracking-[0.5em] uppercase text-[9px] md:text-xs mb-4 px-10">{t('hero.subtitle_part1')}</h2>
                                <div className="relative inline-block transform-gpu">
                                    {/* Ambient Isolation Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_70%)] scale-150 -z-10" />

                                    <h1 className="lg:text-7xl md:text-6xl text-3xl font-bold tracking-tight leading-tight mb-6 drop-shadow-[0_10px_25px_rgba(27,58,92,0.5)]">
                                        <span className="text-white">{t('hero.tagline')}</span><br />
                                        <span className="text-brand-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">{t('hero.tagline2')}</span>
                                    </h1>
                                </div>
                                <p className="max-w-lg mx-auto text-white/80 text-sm md:text-base mb-2 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(27,58,92,0.3)]">
                                    {t('hero.subtitle_part2')}
                                </p>
                                <p className="max-w-lg mx-auto text-white/50 text-xs md:text-sm mb-8 tracking-widest uppercase font-semibold">
                                    {t('hero.microtag')}
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-white px-6 md:px-0">
                                    <Link to="/products" className="w-full md:w-auto bg-brand-gold text-stone-dark px-8 py-3.5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-extrabold hover:bg-white hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,237,0,0.3)] transition-all duration-700 shadow-2xl flex items-center justify-center gap-2 group pointer-events-auto">
                                        {t('hero.explore')}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/about" className="w-full md:w-auto bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all pointer-events-auto shadow-xl text-center">
                                        {t('hero.story')}
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Brand Badge Strip */}
            <div className="relative z-10 bg-brand-cream py-3 md:py-8 border-b border-brand-gold/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        {["WholeFoods", "TESCO", "Carrefour", "Waitrose", "TraderJoe's"].map(brand => (
                            <span key={brand} className="text-[10px] md:text-xl font-bold tracking-tight text-stone-dark italic hover:text-brand-gold transition-colors">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Artisan Tempe Chips section */}
            <section id="products" className="relative py-16 md:py-24 bg-white overflow-hidden">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03] overflow-hidden">
                    <span className="text-[25vw] font-black tracking-tighter text-stone-dark leading-none -rotate-12 translate-y-20">ARTISAN</span>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <motion.h2
                                {...fadeIn}
                                className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-stone-dark mb-4"
                            >
                                {t('products.tagline')} <span className="text-brand-blue">{t('products.tagline2')}</span>
                            </motion.h2>
                            <motion.p
                                {...fadeIn}
                                transition={{ delay: 0.2 }}
                                className="text-base text-stone-dark/60 leading-relaxed max-w-lg"
                            >
                                {t('products.desc')}
                            </motion.p>
                        </div>

                        <motion.div {...fadeIn}>
                            <Link
                                to="/products"
                                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-stone-border hover:bg-brand-blue hover:border-brand-blue transition-all duration-300 shadow-sm"
                            >
                                <span className="text-stone-dark font-medium group-hover:text-white transition-colors">{t('products.catalog')}</span>
                                <ArrowRight className="w-4 h-4 text-stone-dark group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:grid md:grid-cols-3 gap-10 pb-12 md:pb-0">
                        {featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="min-w-[280px] snap-center md:min-w-0"
                            >
                                <Link
                                    to={`/products/${product.id}`}
                                    className="group relative block aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white border border-stone-border hover:border-brand-gold transition-all duration-500 shadow-xl hover:shadow-2xl h-full"
                                >
                                    {/* Image Container */}
                                    <div className="absolute inset-x-0 top-0 bottom-20 p-8 flex items-center justify-center bg-stone-50/20">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl"
                                        />
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/90 via-stone-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 flex items-center gap-2">
                                        {product.tag && (
                                            <span className="px-3 py-1 rounded-full bg-brand-gold text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                {product.tag}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-0 group-hover:text-brand-gold transition-colors duration-300 leading-tight">
                                            {t(`product.${product.id}.name`)}
                                        </h3>
                                        <p className="text-brand-gold-light text-[9px] font-bold mb-1 opacity-90 uppercase tracking-widest">
                                            {t(`product.${product.id}.grade`)}
                                        </p>

                                        {/* Simplified Details */}
                                        <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pt-3 border-t border-white/10 flex justify-between">
                                            <div>
                                                <span className="text-[10px] font-semibold text-white/50 block">Origin</span>
                                                <span className="text-xs font-bold text-white/90">{product.origin}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-semibold text-white/50 block">MOQ</span>
                                                <span className="text-xs font-bold text-white/90">{product.moq}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Craft process section */}
            <section id="process" className="py-16 md:py-24 bg-brand-cream relative overflow-hidden bg-mesh-subtle">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.span
                            {...fadeIn}
                            className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                        >
                            {t('process.badge')}
                        </motion.span>
                        <motion.h2
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="lg:text-6xl md:text-5xl text-4xl font-medium tracking-tight text-stone-dark"
                        >
                            {t('process.title_part1')}<br />
                            <span className="text-brand-blue italic">{t('process.title_part2')}</span>
                        </motion.h2>
                    </div>

                    <div className="relative">
                        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 gap-12 relative items-start overflow-y-hidden">
                            {/* Connecting Path Animation */}
                            <div className="absolute top-[56px] left-[140px] w-[calc((280px+3rem)*3)] md:left-[12.5%] md:right-[12.5%] md:w-auto h-[4px] bg-stone-border/40 z-0">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "100%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue shadow-[0_0_20px_rgba(255,237,0,0.6)]"
                                />
                            </div>

                            {[
                                { step: "01", title: t('process.step1_title'), desc: t('process.step1_desc'), icon: Sprout, color: "bg-green-500/10" },
                                { step: "02", title: t('process.step2_title'), desc: t('process.step2_desc'), icon: Microscope, color: "bg-blue-500/10" },
                                { step: "03", title: t('process.step3_title'), desc: t('process.step3_desc'), icon: Container, color: "bg-orange-500/10" },
                                { step: "04", title: t('process.step4_title'), desc: t('process.step4_desc'), icon: Store, color: "bg-brand-gold/10" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 + (idx * 0.15) }}
                                    className="relative group pt-4 min-w-[280px] snap-center md:min-w-0"
                                >
                                    <div className="relative z-10 mb-4 md:mb-8 flex justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="w-24 h-24 rounded-[2rem] bg-white border border-stone-border shadow-soft flex items-center justify-center relative overflow-hidden group-hover:border-brand-gold/50 transition-all duration-500"
                                        >
                                            <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            <item.icon className="w-10 h-10 text-brand-blue relative z-10 group-hover:text-brand-cyan group-hover:scale-110 transition-all duration-500" />
                                        </motion.div>
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-stone-dark text-white text-[10px] font-bold flex items-center justify-center border-4 border-stone-light shadow-xl z-20">
                                            {item.step}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-4 text-stone-dark group-hover:text-brand-blue transition-colors duration-300 tracking-tight leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs md:text-base text-[#57534E] leading-relaxed font-light">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
};

export default Home;
