import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';
import JourneySection from '../components/JourneySection';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';

// ─── UTILS ──────────
const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// ─── FLAVOR CONFIGURATION (Vibrant palette from previous versions) ──────────
const HERO_FLAVORS = [
    {
        id: 1,
        name: "Original",
        tagline: "PURE TRADITION",
        watermark: "ORIGINAL",
        bgColor: "#041e44ff",
        textColor: "#ffffffff",
        tilt: -8,
        ornaments: ["/images/ornaments/tempe.png", "/images/ornaments/tempe.png", "/images/ornaments/tempe.png"]
    },
    {
        id: 2,
        name: "Balado",
        tagline: "SPICY KICK",
        watermark: "BALADO",
        bgColor: "#570e06ff",
        textColor: "#FFFFFF",
        tilt: 6,
        ornaments: ["/images/ornaments/chili.png", "/images/ornaments/onion.png", "/images/ornaments/chili.png"]
    },
    {
        id: 3,
        name: "BBQ",
        tagline: "SMOKY BOLD",
        watermark: "BARBEQUE",
        bgColor: "#501c06ff",
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
        bgColor: "#6d5207ff",
        textColor: "#ffffffff",
        tilt: 7,
        ornaments: ["/images/ornaments/cheese.png", "/images/ornaments/cheese.png", "/images/ornaments/cheese.png"]
    },
    {
        id: 5,
        name: "Sapi Panggang",
        tagline: "SAVORY ROAST",
        watermark: "GRILLED",
        bgColor: "#4d3006ff",
        textColor: "#FFFFFF",
        tilt: -6,
        ornaments: ["/images/ornaments/meat.png", "/images/ornaments/meat.png", "/images/ornaments/meat.png"]
    }
];

const ORNAMENT_POSITIONS = [
    { top: "5%", left: "4%", delay: 0 },       // Lebih ke pinggir kiri
    { top: "8%", right: "4%", delay: 0.2 },     // Lebih ke pinggir kanan
    { bottom: "8%", right: "6%", delay: 0.4 }   // Lebih ke pinggir kanan bawah
];

const Home = () => {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const hasPlayedIntro = sessionStorage.getItem('pakuaty_intro_played');
    const [isRevealed, setIsRevealed] = useState(hasPlayedIntro === 'true');
    const [settings, setSettings] = useState({});

    // Fetch Settings untuk mengambil URL video dsb
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Gagal memuat pengaturan:", err);
            }
        };
        fetchSettings();
    }, []);

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
            <section 
                className="relative w-full flex items-center justify-center overflow-hidden"
                style={{ height: 'calc(100vh / var(--desktop-zoom, 1))', minHeight: '95vh' }}
            >
                {/* Dynamic Background Color Layer */}
                <motion.div
                    className="absolute inset-0 z-0"
                    animate={{ backgroundColor: activeFlavor.bgColor }}
                    transition={{ duration: 0 }}
                />

                {/* Vignette overlay */}
                <div className="absolute inset-0 pointer-events-none z-[1]"
                    style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)" }} />

                {/* ── Background Massive Text (Watermark) ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-[2]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`watermark-${activeIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: activeFlavor.name === "Sapi Panggang" ? 0.25 : 0.12, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute flex flex-col items-center justify-center"
                        >

                            <h1
                                style={{ color: activeFlavor.textColor, fontSize: 'clamp(100px, 16vw, 280px)' }}
                                className="font-black tracking-tighter uppercase leading-none select-none whitespace-nowrap opacity-75"
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
                                className="absolute w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 select-none"
                                style={{
                                    ...ORNAMENT_POSITIONS[idx],
                                    scale: activeFlavor.ornamentScale || 1
                                }}
                            >
                                <motion.img
                                    src={imgPath}
                                    alt="ornament"
                                    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                                    transition={{ duration: 8 + idx, repeat: Infinity, ease: "easeIn" }}
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
                            className="hero-product-img relative w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] -translate-y-[8vh] sm:translate-y-0 sm:w-[22rem] sm:h-[22rem] md:w-[35vw] md:h-[35vw] lg:w-[30vw] lg:max-w-[400px] xl:max-w-[460px] md:max-w-[70vh] md:max-h-[70vh] flex items-center justify-center lg:translate-y-5 z-10"
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

                    {/* ── Product Info Panel (Left Aligned, Shifted Left) ── */}
                    <div className="absolute bottom-12 md:bottom-24 left-4 sm:left-6 md:left-6 lg:left-8 xl:left-10 max-w-xs sm:max-w-sm md:max-w-md pointer-events-none z-30">
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
                                <div className="flex flex-col gap-1 md:gap-2">
                                    <span className="text-[9px] md:text-xs font-black tracking-[0.5em] uppercase opacity-70 drop-shadow-sm">{t('hero.global_artisan')}</span>
                                    <h1 className="text-[clamp(1.5rem,3.5vw,2rem)] md:text-[clamp(1.75rem,4vw,2.75rem)] lg:text-[clamp(2.25rem,4.5vw,3.25rem)] font-black leading-[0.95] tracking-tighter uppercase italic drop-shadow-md">
                                        {(t(`flavor.${activeFlavor.id}.tagline`)).split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </h1>
                                </div>

                                <p className="text-xs md:text-sm font-medium opacity-90 max-w-[260px] md:max-w-xs leading-relaxed">
                                    {t('hero.desc_text')}
                                </p>

                                <div className="flex items-center gap-4 mt-2 md:mt-4">
                                    <Link
                                        to={`/products/${activeFlavor.id}`}
                                        className="group inline-flex items-center gap-3 bg-white text-stone-dark px-6 py-3 md:px-7 md:py-3.5 rounded-full shadow-2xl hover:bg-brand-cyan hover:text-white transition-all duration-300 active:scale-95"
                                    >
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{t('hero.order_now')}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Desktop Index Sidebar ── */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-6 xl:right-12 hidden lg:flex flex-col gap-6 xl:gap-8 z-20">
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
                                        className="text-stone-dark text-5xl sm:text-7xl md:text-[clamp(4rem,12vw,12rem)] font-black tracking-tighter italic leading-none"
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
            <div className="relative z-10 bg-white py-3 md:py-4 border-y border-stone-border/10">
                <div className="max-w-[100vw] overflow-hidden flex">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex whitespace-nowrap gap-16 items-center px-6"
                    >
                        {[...Array(8)].map((_, i) => (
                            <span key={i} className="text-[clamp(0.75rem,1.5vw,1rem)] font-black tracking-[0.2em] text-stone-dark/40 uppercase italic">
                                {t('home.marquee')}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                ARTISAN HERITAGE SECTION (DIRTY SODA STYLE - REFINED)
            ════════════════════════════════════════ */}
            <section id="products" className="py-10 md:py-16 bg-brand-cream relative overflow-hidden border-y border-stone-border/20">
                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Background Text Overlay - More subtle and proportional */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 0.15, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="text-[clamp(80px,12vw,220px)] font-black text-stone-dark/60 leading-none select-none tracking-tighter uppercase italic drop-shadow-sm"
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
                                className="hidden sm:block w-full max-w-[240px] lg:max-w-[280px] aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl relative group bg-stone-100"
                            >
                                {settings.hero_video_url && getYouTubeID(settings.hero_video_url) ? (
                                    <div className="w-full h-full relative pointer-events-none">
                                        {/* CSS Trick untuk Cover full Iframe tanpa blackbars di container 4:3 */}
                                        <iframe
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%]"
                                            src={`https://www.youtube.com/embed/${getYouTubeID(settings.hero_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeID(settings.hero_video_url)}&controls=0&showinfo=0&rel=0`}
                                            title="YouTube Profil Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
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
                                )}
                            </motion.div>
                        </div>

                        {/* Center: Product - Large & Balanced */}
                        <div className="lg:col-span-4 flex justify-center lg:translate-x-8">
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative w-full max-w-[240px] lg:max-w-[300px]"
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
