import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Play, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';
import JourneySection from '../components/JourneySection';
import { useLanguage } from '../context/LanguageContext';
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';

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
        watermark_en: "ORIGINAL",
        watermark_id: "ORIGINAL",
        bgColor: "#041e44ff",
        textColor: "#ffffffff",
        tilt: -8,
        ornaments: ["/images/ornaments/tempe.png", "/images/ornaments/tempe.png", "/images/ornaments/tempe.png"]
    },
    {
        id: 2,
        name: "Balado",
        tagline: "SPICY KICK",
        watermark_en: "BALADO",
        watermark_id: "BALADO",
        bgColor: "#570e06ff",
        textColor: "#FFFFFF",
        tilt: 6,
        mixBlend: true, // Gunakan trik CSS Multiply untuk transparansi otomatis dari BG putih murni
        ornaments: ["/images/ornaments/balado_mix.png", "/images/ornaments/balado_mix.png", "/images/ornaments/balado_mix.png"]
    },
    {
        id: 3,
        name: "BBQ",
        tagline: "SMOKY BOLD",
        watermark_en: "BARBEQUE",
        watermark_id: "BARBEQUE",
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
        watermark_en: "CHEESE",
        watermark_id: "KEJU",
        bgColor: "#6d5207ff",
        textColor: "#ffffffff",
        tilt: 7,
        ornaments: ["/images/ornaments/cheese.png", "/images/ornaments/cheese.png", "/images/ornaments/cheese.png"]
    },
    {
        id: 5,
        name: "Sapi Panggang",
        tagline: "SAVORY ROAST",
        watermark_en: "ROASTED",
        watermark_id: "PANGGANG",
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
    const { t, lang } = useLanguage();
    // Ambil settings dari data yang sudah di-preload (tidak perlu fetch lagi)
    const { settings } = useGlobalData();
    const [activeIndex, setActiveIndex] = useState(0);
    const hasPlayedIntro = sessionStorage.getItem('pakuaty_intro_played');
    const [isRevealed, setIsRevealed] = useState(hasPlayedIntro === 'true');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    
    // Deteksi Mobile Viewport untuk Optimasi Performa (Mematikan animasi berat & iframe background di HP)
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        animate: { opacity: 1, y: 0 },
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
                                style={{ color: activeFlavor.textColor, fontSize: 'clamp(70px, 18vw, 280px)' }}
                                className="font-black tracking-[-0.05em] uppercase leading-none select-none whitespace-nowrap opacity-75 px-4"
                            >
                                {lang === 'en' ? activeFlavor.watermark_en : activeFlavor.watermark_id}
                            </h1>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Flavor Ornaments (Dihilangkan di mobile agar ringan) ── */}
                <div className="absolute inset-0 z-[3] pointer-events-none hidden md:block">
                    <AnimatePresence mode="popLayout">
                        {!isMobile && activeFlavor.ornaments.map((imgPath, idx) => (
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
                                    className={`w-full h-full object-contain ${activeFlavor.mixBlend ? 'mix-blend-multiply' : 'drop-shadow-2xl'}`}
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
                    <AnimatePresence>
                        <motion.div
                            key={`product-${activeIndex}`}
                            initial={{ opacity: 0, y: isMobile ? -100 : -700, scale: isMobile ? 0.8 : 0.6 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                rotate: activeFlavor.tilt,
                            }}
                            exit={{ opacity: 0, y: isMobile ? 100 : 700, scale: isMobile ? 0.8 : 0.6 }}
                            transition={{
                                duration: isMobile ? 0.7 : 1.1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute hero-product-img w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] -translate-y-[8vh] sm:translate-y-0 sm:w-[22rem] sm:h-[22rem] md:w-[35vw] md:h-[35vw] lg:w-[30vw] lg:max-w-[400px] xl:max-w-[460px] md:max-w-[70vh] md:max-h-[70vh] flex items-center justify-center lg:translate-y-5 z-10"
                        >
                            <motion.img
                                src={activeProduct?.image}
                                alt={activeProduct?.name}
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [activeFlavor.tilt, activeFlavor.tilt + 1.5, activeFlavor.tilt],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}

                                // --- PERFORMA OPTIMASI: Shadow putih bersinar (heavy GPU) hanya aktif di Desktop (md:)
                                // Di mobile, kita gunakan shadow biasa agar tidak lag.
                                className="w-full h-full object-contain filter drop-shadow-xl md:drop-shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-transform duration-700"

                                // Opsi 2: TANPA Bayangan Sama Sekali (Polos)
                                // className="w-full h-full object-contain transition-transform duration-700"
                                // ----------------------------------------------------------------------

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
                    {/* Menggunakan max-width yang sedikit lebih lebar untuk keseimbangan teks baru */}
                    <div className="absolute bottom-12 md:bottom-24 left-4 sm:left-6 md:left-6 lg:left-8 xl:left-10 max-w-[280px] sm:max-w-md md:max-w-lg pointer-events-none z-30">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`info-${activeIndex}`} // Key unik agar animasi terulang per flavor
                                initial={{ opacity: 0, x: -60 }} // Animasi masuk: transparan + geser kiri
                                animate={{ opacity: 1, x: 0 }} // Animasi aktif: muncul + posisi asli
                                exit={{ opacity: 0, x: 30 }} // Animasi keluar: transparan + geser kanan
                                transition={{ duration: 0.8, ease: "easeOut" }} // Kurva transisi eksponensial halus
                                style={{ color: activeFlavor.textColor }} // Pewarnaan dinamis berbasis data flavor
                                className="flex flex-col gap-4 md:gap-5 pointer-events-auto"
                            >
                                <div className="flex flex-col gap-2 md:gap-2.5">
                                    {/* Label atas ditingkatkan sedikit ke md:text-[13px] agar lebih jelas */}
                                    <span className="text-[10px] md:text-[13px] font-black tracking-[0.5em] uppercase opacity-70 drop-shadow-sm">
                                        {t('hero.global_artisan')}
                                    </span>
                                    {/* Judul utama dinaikkan parameternya sedikit (3.75 -> 4.15) untuk dampak visual lebih kuat */}
                                    <h1 className="text-[clamp(1.6rem,4.5vw,2.25rem)] md:text-[clamp(2.15rem,5vw,3.25rem)] lg:text-[clamp(2.55rem,5.5vw,4.15rem)] font-black leading-[0.92] tracking-tighter uppercase italic drop-shadow-md">
                                        {(t(`flavor.${activeFlavor.id}.tagline`)).split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span> // Rendering baris per kata
                                        ))}
                                    </h1>
                                </div>

                                {/* Deskripsi dinaikkan sedikit ke 17px pada desktop untuk keterbacaan optimal */}
                                <p className="text-sm md:text-base lg:text-[17px] font-medium opacity-90 max-w-[300px] md:max-w-sm lg:max-w-md leading-relaxed">
                                    {t('hero.desc_text')}
                                </p>

                                <div className="flex items-center gap-4 mt-2 md:mt-4">
                                    {/* Tombol Order — Ukuran teks disesuaikan ke md:text-[13px] agar seimbang dengan title */}
                                    <Link
                                        to={`/products/${activeFlavor.id}`}
                                        className="group inline-flex items-center gap-3 bg-white text-stone-dark px-7 py-3 md:px-8 md:py-4 rounded-full shadow-2xl hover:bg-brand-cyan hover:text-white transition-all duration-300 active:scale-95"
                                    >
                                        <span className="text-[11px] md:text-[13px] font-black uppercase tracking-widest">
                                            {t('hero.order_now')}
                                        </span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                            animate={{ opacity: 0.15, scale: 1 }}
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
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                onClick={() => settings.hero_video_url && setIsVideoModalOpen(true)}
                                className={`hidden sm:block w-full max-w-[240px] lg:max-w-[280px] aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl relative group bg-stone-100 ${settings.hero_video_url ? 'cursor-pointer' : ''}`}
                            >
                                {/* Optimasi Performa: Video Iframe dimatikan sepenuhnya jika dibuka via HP */}
                                {!isMobile && settings.hero_video_url && getYouTubeID(settings.hero_video_url) ? (
                                    <>
                                        <div className="w-full h-full relative pointer-events-none transition-transform duration-700 group-hover:scale-105">
                                            {/* CSS Trick untuk Cover full Iframe tanpa blackbars di container 4:3 */}
                                            <iframe
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] pointer-events-none"
                                                src={`https://www.youtube.com/embed/${getYouTubeID(settings.hero_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeID(settings.hero_video_url)}&controls=0&showinfo=0&rel=0`}
                                                title="YouTube Profil Video"
                                                frameBorder="0"
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        {/* Play Icon Overlay */}
                                        <div className="absolute inset-0 bg-stone-dark/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                            <div className="w-16 h-16 bg-[#DAA520] rounded-full flex items-center justify-center pl-1 shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 cursor-pointer">
                                                <Play className="w-8 h-8 text-white fill-white" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src="/images/artisan_inset.png"
                                        alt="Artisan Process"
                                        loading="lazy"
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
                                animate={{ y: 0, opacity: 1, scale: 1 }}
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
                                animate={{ x: 0, opacity: 1 }}
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

            {/* ══════════════════════════════════════
                VIDEO MODAL POPUP
            ════════════════════════════════════════ */}
            <AnimatePresence>
                {isVideoModalOpen && settings.hero_video_url && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-dark/95 backdrop-blur-md px-4 sm:px-8 py-8"
                        onClick={() => setIsVideoModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                            className="bg-black w-full max-w-5xl aspect-video rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl border border-white/5"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside video
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 bg-black/40 hover:bg-[#DAA520] text-white p-2.5 rounded-full transition-all duration-300 backdrop-blur-md group shadow-lg border border-white/10"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {/* YouTube Iframe with Controls and Autoplay */}
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${getYouTubeID(settings.hero_video_url)}?autoplay=1&controls=1&rel=0&modestbranding=1&showinfo=0`}
                                title="YouTube Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Home;
