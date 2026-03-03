import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Icon: ArrowRight (tombol navigasi), Sprout/Microscope/Container/Store (section proses)
import { ArrowRight, Sprout, Microscope, Container, Store } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';

// Data Hero yang stabil (Dipindahkan ke luar agar tidak re-render/re-reference)
// Data stabil — di luar komponen agar tidak trigger re-render
const HERO_FLAVORS = [
    "Original",
    "Balado",
    "BBQ",
    "Keju",
    "Sapi Panggang"
];

const heroItems = PRODUCTS
    .filter(p => HERO_FLAVORS.includes(p.name))
    .map(p => ({
        src: p.image,
        name: p.name
    }));

const Home = () => {
    // Session Management: Only show intro once per session
    const hasPlayedIntro = sessionStorage.getItem('pakuaty_intro_played');
    const [isRevealed, setIsRevealed] = useState(hasPlayedIntro === 'true');
    const [activeIndex, setActiveIndex] = useState(2);

    // Logic: Autoplay interval (Selalu aktif)
    useEffect(() => {
        if (!isRevealed) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % heroItems.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isRevealed]);

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
        <div className="bg-neutral-bone text-stone-dark">
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

                            // Perhitungan posisi & lebar mutlak (Absolute) untuk 5 SLICES
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

                    {/* Stage 2 Content (Overlays) — High-end Amber Studio Lighting (No more washed-out white) */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(212,196,133,0.15)_0%,_rgba(180,160,100,0.05)_100%)] pointer-events-none">

                        <div className="max-w-7xl mx-auto px-6 text-center pointer-events-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 30 }}
                                transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h2 className="text-brand-gold font-black tracking-[0.5em] uppercase text-[9px] md:text-xs mb-4 px-10">Premium Tempe Chips</h2>
                                <div className="relative inline-block transform-gpu">
                                    {/* Ambient Isolation Glow — Migrated from blur to high-performance radial gradient */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_70%)] scale-150 -z-10" />

                                    <h1 className="lg:text-[8.5rem] md:text-7xl text-4xl font-bold text-white tracking-tight leading-[0.82] mb-6 drop-shadow-[0_10px_25px_rgba(27,58,92,0.5)]">
                                        Crunch the <br />
                                        <span className="text-brand-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]">Culture.</span>
                                    </h1>
                                </div>
                                <p className="max-w-xl mx-auto text-white md:text-2xl text-lg mb-8 leading-relaxed font-semibold drop-shadow-[0_2px_10px_rgba(27,58,92,0.3)]">
                                    Premium Indonesian Tempe Chips crafted with heritage, <br className="hidden md:block" />
                                    powered by innovation.
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-white px-6 md:px-0">
                                    <Link to="/products" className="w-full md:w-auto bg-brand-gold text-stone-dark px-8 py-3.5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-extrabold hover:bg-white hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,237,0,0.3)] transition-all duration-700 shadow-2xl flex items-center justify-center gap-2 group pointer-events-auto">
                                        Explore Flavors
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button className="w-full md:w-auto bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all pointer-events-auto shadow-xl">
                                        Watch Story
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Brand Badge Strip — Standalone Divider Section (Neutral Bone Background) */}
            <div className="relative z-10 bg-neutral-bone py-3 md:py-8 border-b border-stone-dark/5">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        {["WholeFoods", "TESCO", "Carrefour", "Waitrose", "TraderJoe's"].map(brand => (
                            <span key={brand} className="text-[10px] md:text-xl font-bold tracking-tight text-stone-dark italic hover:text-brand-gold transition-colors">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid — Premium Balanced Contrast Design */}
            <section id="products" className="relative py-16 md:py-24 bg-neutral-bone overflow-hidden">
                {/* Multi-Color Vibrant Decorative Elements — Migrated from blur to gradients for Ultra-Light performance */}
                <div className="absolute top-0 right-0 w-[850px] h-[850px] opacity-20 bg-[radial-gradient(circle,rgba(38,84,161,0.15)_0%,transparent_70%)] translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse duration-[8000ms]"></div>
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-20 bg-[radial-gradient(circle,rgba(218,165,32,0.15)_0%,transparent_70%)] -translate-x-1/4 translate-y-1/4 pointer-events-none animate-pulse duration-[10000ms]"></div>
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-20 bg-[radial-gradient(circle,rgba(218,165,32,0.15)_0%,transparent_70%)] -translate-x-1/4 translate-y-1/4 pointer-events-none animate-pulse duration-[10000ms]"></div>

                {/* Subtle Radial Mesh Gradient for Color Blending */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(218,165,32,0.05)_0%,_transparent_50%),radial-gradient(circle_at_20%_80%,_rgba(38,84,161,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <motion.h2
                                {...fadeIn}
                                className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-stone-dark mb-6"
                            >
                                Artisan <span className="text-brand-blue">Tempe Chips</span>
                            </motion.h2>
                            <motion.p
                                {...fadeIn}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-stone-dark/60 leading-relaxed"
                            >
                                Premium Indonesian tempe chips crafted with heritage techniques and bold, authentic flavors for the global palate.
                            </motion.p>
                        </div>

                        <motion.div {...fadeIn}>
                            <Link
                                to="/products"
                                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-stone-border hover:bg-brand-blue hover:border-brand-blue transition-all duration-300 shadow-sm"
                            >
                                <span className="text-stone-dark font-medium group-hover:text-white transition-colors">View Full Catalog</span>
                                <ArrowRight className="w-4 h-4 text-stone-dark group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.slice(0, 3).map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <Link
                                    to={`/products/${product.id}`}
                                    className="group relative block aspect-square rounded-[2.5rem] overflow-hidden bg-white border border-stone-border hover:border-brand-gold transition-all duration-500 shadow-xl hover:shadow-2xl"
                                >
                                    {/* Image Container with Breathing Room — Optimized for compact height */}
                                    <div className="absolute inset-x-0 top-0 bottom-24 p-8 flex items-center justify-center bg-stone-50/30">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105 drop-shadow-xl"
                                        />
                                    </div>

                                    {/* Gradient Overlay - Soft Bottom Gradient for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                    {/* Top Badges - using brand colors */}
                                    <div className="absolute top-8 left-8 flex items-center gap-3">
                                        {product.tag && (
                                            <span className="px-4 py-1.5 rounded-full bg-brand-gold text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                {product.tag}
                                            </span>
                                        )}
                                        {idx === 1 && (
                                            <span className="px-4 py-1.5 rounded-full bg-brand-blue text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border border-white/10">
                                                Premium
                                            </span>
                                        )}
                                    </div>

                                    {/* Circle Arrow Icon - updated to brand blue */}
                                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-brand-blue/20 backdrop-blur-md border border-brand-blue/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <ArrowRight className="w-5 h-5 text-brand-gold -rotate-45" />
                                    </div>

                                    {/* Content Overlay — Tightened for compact aspect ratio */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                        <h3 className="text-2xl font-bold text-white mb-0 group-hover:text-brand-gold transition-colors duration-300">
                                            {product.name}
                                        </h3>
                                        <p className="text-brand-gold-light text-[10px] font-medium mb-1 group-hover:mb-4 transition-all duration-500 opacity-90 uppercase tracking-wide">
                                            {product.grade}
                                        </p>

                                        {/* Hidden Details */}
                                        <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-6 pt-3 border-t border-white/20">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-brand-gold/60 mb-1 font-bold">Origin</p>
                                                <p className="text-sm font-semibold text-white/90">{product.origin}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-brand-gold/60 mb-1 font-bold">MOQ</p>
                                                <p className="text-sm font-semibold text-white/90">{product.moq}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Border Glow - updated to brand blue */}
                                    <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/5 transition-all duration-500 pointer-events-none"></div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* How We Craft — Process Journey Section */}
            < section id="process" className="py-16 md:py-24 bg-stone-light relative overflow-hidden bg-mesh-subtle" >
                {/* Vibrant Background Accents (Low Opacity) */}
                < div className="absolute top-0 right-0 md:w-1/2 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(38,84,161,0.05)_0%,_transparent_50%)] pointer-events-none" ></div >
                <div className="absolute bottom-0 left-0 md:w-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(218,165,32,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.span
                            {...fadeIn}
                            className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                        >
                            Our Heritage Process
                        </motion.span>
                        <motion.h2
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="lg:text-6xl md:text-5xl text-4xl font-medium tracking-tight text-stone-dark"
                        >
                            From Soybean to <span className="text-brand-blue italic">Crunch</span>
                        </motion.h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Path Animation */}
                        <div className="hidden md:block absolute top-[64px] left-[12.5%] right-[12.5%] h-[2px] bg-stone-border/30">
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue shadow-[0_0_15px_rgba(218,165,32,0.4)]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 relative">
                            {[
                                { step: "01", title: "Premium Soybeans", desc: "Locally sourced non-GMO soybeans for the freshest quality.", icon: Sprout, color: "bg-green-500/10" },
                                { step: "02", title: "Natural Fermentation", desc: "Traditional 48-hour slow fermentation process.", icon: Microscope, color: "bg-blue-500/10" },
                                { step: "03", title: "Bold Seasoning", desc: "Hand-seasoned with signature heritage spice blends.", icon: Container, color: "bg-orange-500/10" },
                                { step: "04", title: "Export Ready", desc: "Vacuum-sealed to ensure international export quality.", icon: Store, color: "bg-brand-gold/10" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 + (idx * 0.15) }}
                                    className="relative group pt-4"
                                >
                                    {/* Icon Container with Glass Effect */}
                                    <div className="relative z-10 mb-4 md:mb-8 flex justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="w-16 h-16 md:w-24 md:h-24 rounded-[1.2rem] md:rounded-[2rem] bg-white border border-stone-border shadow-soft flex items-center justify-center relative overflow-hidden group-hover:border-brand-gold/50 transition-all duration-500"
                                        >
                                            <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            <item.icon className="w-7 h-7 md:w-10 md:h-10 text-brand-blue relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                        </motion.div>

                                        {/* Step Indicator Badge */}
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-stone-dark text-white text-[8px] md:text-[10px] font-bold flex items-center justify-center border-2 md:border-4 border-stone-light shadow-xl z-20">
                                            {item.step}
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left">
                                        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-4 text-stone-dark group-hover:text-brand-blue transition-colors duration-300 tracking-tight leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs md:text-base text-[#57534E] leading-relaxed font-light px-4 md:px-0">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Subtle Animated Glow on Hover */}
                                    <div className="absolute -inset-4 bg-brand-blue/0 group-hover:bg-brand-blue/[0.02] rounded-[3rem] -z-10 transition-all duration-700 blur-xl"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >


            <CTA />
        </div >
    );
};

export default Home;
