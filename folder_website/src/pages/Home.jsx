import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';
import JourneySection from '../components/JourneySection';
import { useLanguage } from '../context/LanguageContext';

// ─── FLAVOR CONFIGURATION (Vibrant palette from previous versions) ──────────
const HERO_FLAVORS = [
    {
        id: 1,
        name: "Original",
        tagline: "PURE TRADITION",
        watermark: "ORIGINAL",
        bgColor: "#0147AD",
        textColor: "#FFFFFF",
        tilt: -8,
        ornaments: ["/images/ornaments/tempe.png", "/images/ornaments/tempe.png", "/images/ornaments/tempe.png"]
    },
    {
        id: 2,
        name: "Balado",
        tagline: "SPICY KICK",
        watermark: "BALADO",
        bgColor: "#C0392B",
        textColor: "#FFFFFF",
        tilt: 6,
        ornaments: ["/images/ornaments/chili.png", "/images/ornaments/onion.png", "/images/ornaments/chili.png"]
    },
    {
        id: 3,
        name: "BBQ",
        tagline: "SMOKY BOLD",
        watermark: "BARBEQUE",
        bgColor: "#E86A33",
        textColor: "#FFFFFF",
        tilt: -10,
        ornamentScale: 1.3,
        ornaments: ["/images/ornaments/bbq.png", "/images/ornaments/bbq.png", "/images/ornaments/bbq.png"]
    },
    {
        id: 4,
        name: "Keju",
        tagline: "CHEESY DELIGHT",
        watermark: "CHEESE",
        bgColor: "#E5B326",
        textColor: "#1A1206",
        tilt: 7,
        ornaments: ["/images/ornaments/cheese.png", "/images/ornaments/cheese.png", "/images/ornaments/cheese.png"]
    },
    {
        id: 5,
        name: "Sapi Panggang",
        tagline: "SAVORY ROAST",
        watermark: "GRILLED",
        bgColor: "#1A1206",
        textColor: "#FFFFFF",
        tilt: -6,
        ornaments: ["/images/ornaments/meat.png", "/images/ornaments/meat.png", "/images/ornaments/meat.png"]
    }
];

const ORNAMENT_POSITIONS = [
    { top: "5%", left: "15%", delay: 0 },
    { top: "12%", right: "12%", delay: 0.2 },
    { bottom: "10%", right: "20%", delay: 0.4 }
];

const Home = () => {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const hasPlayedIntro = sessionStorage.getItem('pakuaty_intro_played');
    const [isRevealed, setIsRevealed] = useState(hasPlayedIntro === 'true');

    // Auto-cycle hero items
    useEffect(() => {
        if (!isRevealed) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % HERO_FLAVORS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isRevealed]);

    // Handle initial reveal
    useEffect(() => {
        if (hasPlayedIntro) return;
        const timer = setTimeout(() => {
            setIsRevealed(true);
            sessionStorage.setItem('pakuaty_intro_played', 'true');
        }, 800);
        return () => clearTimeout(timer);
    }, [hasPlayedIntro]);

    const activeFlavor = HERO_FLAVORS[activeIndex];
    const activeProduct = PRODUCTS.find(p => p.id === activeFlavor.id);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="bg-brand-cream text-stone-dark overflow-x-hidden">
            {/* ══════════════════════════════════════
                HERO — Idle Auto-Cycle Stage
            ════════════════════════════════════════ */}
            <section className="relative h-[95vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Dynamic Background Color Layer */}
                <motion.div
                    className="absolute inset-0 z-0"
                    animate={{ backgroundColor: activeFlavor.bgColor }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Vignette overlay */}
                <div className="absolute inset-0 pointer-events-none z-[1]"
                    style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)" }} />

                {/* ── Background Massive Text (Watermark) ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-[2]">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={`watermark-${activeIndex}`}
                            initial={{ opacity: 0, y: -150 }}
                            animate={{ opacity: activeFlavor.name === "Sapi Panggang" ? 0.25 : 0.12, y: 0 }}
                            exit={{ opacity: 0, y: 150 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[12vw] font-black opacity-30 -mb-12" style={{ color: activeFlavor.textColor }}>{activeIndex < 9 ? `0${activeIndex + 1}` : activeIndex + 1}</span>
                            <h1
                                style={{ color: activeFlavor.textColor }}
                                className="text-[25vw] font-black tracking-tighter uppercase leading-none select-none whitespace-nowrap opacity-25"
                            >
                                {activeFlavor.watermark}
                            </h1>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Flavor Ornaments (Dropped from above) ── */}
                <div className="absolute inset-0 z-[3] pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {activeFlavor.ornaments.map((imgPath, idx) => (
                            <motion.div
                                key={`${activeIndex}-ornament-${idx}`}
                                initial={{ opacity: 0, y: -400, rotate: 0 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    rotate: idx % 2 === 0 ? 15 : -15,
                                }}
                                exit={{ opacity: 0, y: 400 }}
                                transition={{
                                    y: { duration: 1, delay: idx * 0.1, ease: [0.175, 0.885, 0.32, 1.15] },
                                    opacity: { duration: 0.5, delay: idx * 0.1 },
                                }}
                                className="absolute w-32 h-32 md:w-60 md:h-60 select-none"
                                style={{
                                    ...ORNAMENT_POSITIONS[idx],
                                    scale: activeFlavor.ornamentScale || 1
                                }}
                            >
                                <motion.img
                                    src={imgPath}
                                    alt="ornament"
                                    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                                    transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        if (e.target.src !== '/images/pure logo pakuaty.png') {
                                            e.target.src = '/images/pure logo pakuaty.png';
                                            e.target.className += ' opacity-10 grayscale scale-50';
                                        }
                                    }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ── Central Product Stage ── */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={`product-${activeIndex}`}
                            initial={{ opacity: 0, y: -700, scale: 0.6 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                rotate: activeFlavor.tilt,
                            }}
                            exit={{ opacity: 0, y: 700, scale: 0.6 }}
                            transition={{
                                duration: 1.1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="relative w-80 h-80 md:w-[820px] md:h-[820px] flex items-center justify-center"
                        >
                            <motion.img
                                src={activeProduct?.image}
                                alt={activeProduct?.name}
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [activeFlavor.tilt, activeFlavor.tilt + 1.5, activeFlavor.tilt],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full object-contain filter drop-shadow-[0_80px_120px_rgba(0,0,0,0.45)] transition-transform duration-700"
                                onError={(e) => {
                                    if (e.target.src !== '/images/pure logo pakuaty.png') {
                                        e.target.src = '/images/pure logo pakuaty.png';
                                        e.target.className += ' opacity-20 grayscale';
                                    }
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* ── Product Info Panel (Left Aligned) ── */}
                    <div className="absolute bottom-12 md:bottom-24 left-6 md:left-24 max-w-lg pointer-events-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`info-${activeIndex}`}
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ color: activeFlavor.textColor }}
                                className="flex flex-col gap-4 pointer-events-auto"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] md:text-sm font-black tracking-[0.5em] uppercase opacity-70">{t('hero.global_artisan')}</span>
                                    <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
                                        {(t(`flavor.${activeFlavor.id}.tagline`)).split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </h1>
                                </div>

                                <p className="text-sm md:text-base font-medium opacity-90 max-w-xs leading-relaxed">
                                    {t('hero.desc_text')}
                                </p>

                                <div className="flex items-center gap-4 mt-4">
                                    <Link
                                        to={`/products/${activeFlavor.id}`}
                                        className="group inline-flex items-center gap-4 bg-white text-stone-dark px-10 py-5 rounded-full shadow-2xl hover:bg-brand-cyan hover:text-white transition-all duration-300 active:scale-95"
                                    >
                                        <span className="text-xs font-black uppercase tracking-widest">{t('hero.order_now')}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Desktop Index Sidebar ── */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-12 hidden lg:flex flex-col gap-10 z-20">
                        {HERO_FLAVORS.map((flavor, idx) => (
                            <button
                                key={flavor.id}
                                onClick={() => setActiveIndex(idx)}
                                className="group relative flex items-center justify-end h-8"
                            >
                                <motion.span
                                    className={`text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${activeIndex === idx ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                                    style={{ color: activeFlavor.textColor }}
                                >
                                    {t(`product.${flavor.id}.name`)}
                                </motion.span>
                                {activeIndex === idx && (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="absolute -right-4 w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: activeFlavor.textColor }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Mobile Page Indicator ── */}
                    <div className="absolute bottom-8 right-6 flex items-center gap-2 hidden sm:flex md:hidden">
                        {HERO_FLAVORS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                                style={{ backgroundColor: activeIndex === idx ? activeFlavor.textColor : undefined }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Shutter Intro Animation ── */}
                {!hasPlayedIntro && (
                    <div className="absolute inset-0 z-[100] pointer-events-none flex flex-col">
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: isRevealed ? "-100%" : 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            className="flex-1 bg-brand-cream flex items-end justify-center pb-8 border-b border-brand-gold/10"
                        >
                            <motion.div className="flex gap-4 overflow-hidden py-4 px-10">
                                {"PAKUATY".split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ y: 200, opacity: 0, rotate: 10 }}
                                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: [0.34, 1.56, 0.64, 1] }}
                                        className="text-stone-dark text-7xl md:text-[12rem] font-black tracking-tighter italic leading-none"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: isRevealed ? "100%" : 0 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            className="flex-1 bg-brand-cream"
                        />
                    </div>
                )}
            </section>

            {/* ══════════════════════════════════════
                BRAND MARQUEE 
            ════════════════════════════════════════ */}
            <div className="relative z-10 bg-white py-6 md:py-8 border-y border-stone-border/10">
                <div className="max-w-[100vw] overflow-hidden flex">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex whitespace-nowrap gap-16 items-center px-6"
                    >
                        {[...Array(8)].map((_, i) => (
                            <span key={i} className="text-lg md:text-2xl font-black tracking-[0.25em] text-stone-dark/10 uppercase italic">
                                {t('home.marquee')}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                ARTISAN HERITAGE SECTION (DIRTY SODA STYLE - REFINED)
            ════════════════════════════════════════ */}
            <section id="products" className="py-20 bg-white relative overflow-hidden border-y border-stone-100">
                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Background Text Overlay - More subtle and proportional */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 0.2, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="text-[18vw] font-black text-brand-gold leading-none select-none tracking-tighter uppercase italic"
                        >
                            PAKUATY
                        </motion.h2>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
                        {/* Left Side: Inset Visual - Clean Crop */}
                        <div className="lg:col-span-4 flex justify-center lg:justify-start">
                            <motion.div
                                initial={{ x: -60, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="hidden sm:block w-full max-w-[340px] aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl relative group"
                            >
                                <img
                                    src="/images/artisan_inset.png"
                                    alt="Artisan Process"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        if (e.target.src !== '/images/pure logo pakuaty.png') {
                                            e.target.src = '/images/pure logo pakuaty.png';
                                            e.target.className += ' opacity-20 grayscale';
                                        }
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Center: Product - Large & Balanced */}
                        <div className="lg:col-span-4 flex justify-center">
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative w-full max-w-[280px] lg:max-w-[340px]"
                            >
                                <img
                                    src={PRODUCTS[0].image}
                                    alt="Pakuaty Original"
                                    className="w-full h-auto drop-shadow-[0_45px_70px_rgba(0,0,0,0.25)] rotate-[-4deg]"
                                    onError={(e) => {
                                        if (e.target.src !== '/images/pure logo pakuaty.png') {
                                            e.target.src = '/images/pure logo pakuaty.png';
                                            e.target.className += ' opacity-20 grayscale';
                                        }
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Right Side: Text Description - Balanced Spacing */}
                        <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-10 text-center lg:text-left items-center lg:items-start">
                            <motion.div
                                initial={{ x: 60, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="max-w-sm"
                            >
                                <h3 className="text-3xl md:text-4xl font-black text-stone-dark leading-[1.1] mb-2 tracking-tighter">
                                    {t('home.artisan.title')}<br />
                                    {t('home.artisan.subtitle')}
                                </h3>
                                <p className="text-stone-dark/70 text-sm md:text-base leading-relaxed font-semibold">
                                    {t('home.artisan.desc')}
                                </p>
                                <Link
                                    to="/products"
                                    className="mt-6 inline-flex items-center gap-3 bg-stone-dark text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-brand-blue transition-all duration-300 shadow-lg"
                                >
                                    {t('home.artisan.cta')}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <JourneySection />
            <CTA />
        </div>
    );
};

export default Home;
