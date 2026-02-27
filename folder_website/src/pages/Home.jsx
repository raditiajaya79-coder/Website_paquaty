import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Sprout, Microscope, Container, Store, Award, ShieldCheck, Check, FileBadge, Leaf, Scale } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';

const Home = () => {
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const heroImages = PRODUCTS
        .filter(p => ["Original", "Balado", "BBQ", "Keju", "Sapi Panggang", "Jamur Crispy"].includes(p.name))
        .map(p => p.image);

    return (
        <div className="bg-stone-light text-stone-dark">
            {/* Hero Section — Slanted Reveal */}
            <section className="relative min-h-screen overflow-hidden bg-[#1C1917]">
                {/* Stage 1: Brand Intro (Lines & Text) */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isRevealed ? 0 : 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="text-center"
                    >
                        <motion.h1
                            initial={{ letterSpacing: "0.2em", opacity: 0 }}
                            animate={{ letterSpacing: "0.5em", opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-white text-2xl md:text-4xl font-light tracking-[0.5em] uppercase"
                        >
                            PAKUATY
                        </motion.h1>
                        <div className="mt-4 w-32 h-[1px] bg-brand-gold mx-auto overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-full h-full bg-white"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Diagonal Lines Overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: "-100%", y: "100%" }}
                            animate={{ x: "100%", y: "-100%" }}
                            transition={{ repeat: Infinity, duration: 3 + i, ease: "linear" }}
                            className="absolute h-[300%] w-[1px] bg-white/5"
                            style={{
                                left: `${i * 15}%`,
                                transform: "rotate(35deg)",
                                transformOrigin: "top left"
                            }}
                        />
                    ))}
                </div>

                {/* Slices Container */}
                <div className="absolute inset-0 flex w-[140%] h-full z-0 overflow-hidden -left-[10%] pointer-events-none">
                    {heroImages.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ width: "0%" }}
                            animate={{ width: isRevealed ? "23%" : "0%" }}
                            transition={{ duration: 1.2, delay: 0.8 + (idx * 0.1), ease: [0.22, 1, 0.36, 1] }}
                            className="relative h-full overflow-hidden group pointer-events-auto"
                            style={{
                                clipPath: "polygon(35% 0, 100% 0, 65% 100%, 0% 100%)",
                                marginLeft: idx === 0 ? "0" : "-10%"
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, filter: "brightness(1.15)" }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img
                                    src={src}
                                    alt="Product"
                                    className="w-full h-full object-cover scale-[1.7] object-bottom md:object-center"
                                />
                                <div className="absolute inset-0 bg-stone-dark/40 group-hover:bg-transparent transition-colors duration-700"></div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Stage 2 Content (Overlays) */}
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-stone-dark/40 pointer-events-none">
                    <div className="max-w-7xl mx-auto px-6 text-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 30 }}
                            transition={{ duration: 1, delay: 1.5 }}
                        >
                            <h2 className="text-brand-gold font-medium tracking-[0.4em] uppercase text-xs mb-6">Premium Tempe Chips</h2>
                            <h1 className="md:text-8xl text-5xl font-medium text-white tracking-tighter leading-[0.9] mb-8 uppercase">
                                Crunch the <br />
                                <span className="text-brand-gold">Culture.</span>
                            </h1>
                            <p className="text-lg md:text-2xl text-stone-200 max-w-2xl mx-auto leading-relaxed font-light mb-10">
                                Premium Indonesian Tempe Chips crafted with heritage, powered by innovation.
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white">
                                <Link to="/products" className="w-full md:w-auto bg-brand-gold text-stone-dark px-10 py-5 rounded-full text-lg font-bold hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-2 group pointer-events-auto">
                                    Explore Flavors
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-white/20 transition-all pointer-events-auto">
                                    Watch Story
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Seamless Badge Strip Overlay */}
                <div className="absolute bottom-0 left-0 w-full z-40 bg-gradient-to-t from-stone-dark/90 to-transparent pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap justify-center md:justify-between items-center gap-10 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                            {["WholeFoods", "TESCO", "Carrefour", "Waitrose", "TraderJoe's"].map(brand => (
                                <span key={brand} className="text-xl font-semibold tracking-tight text-white/70 italic hover:text-brand-gold transition-colors">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid — Premium Vibrant Light Design */}
            <section id="products" className="relative py-24 bg-stone-light overflow-hidden">
                {/* Multi-Color Vibrant Decorative Elements (Blue & Gold) */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 bg-brand-gold blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse duration-[8000ms]"></div>
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-15 bg-brand-blue blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none animate-pulse duration-[10000ms]"></div>

                {/* Subtle Radial Mesh Gradient for Color Blending */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(218,165,32,0.05)_0%,_transparent_50%),radial-gradient(circle_at_20%_80%,_rgba(38,84,161,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <motion.h2
                                {...fadeIn}
                                className="text-5xl md:text-7xl font-medium tracking-tight text-stone-dark mb-6"
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
                                    className="group relative block aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white border border-stone-border hover:border-brand-gold transition-all duration-500 shadow-xl hover:shadow-2xl"
                                >
                                    {/* Image */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

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

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                                        <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-brand-gold transition-colors duration-300">
                                            {product.name}
                                        </h3>
                                        <p className="text-brand-gold-light text-sm font-medium mb-2 group-hover:mb-6 transition-all duration-500 opacity-90 uppercase tracking-wide">
                                            {product.grade}
                                        </p>

                                        {/* Hidden Details - Visible only on hover, using brand-gold accent */}
                                        <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-10 pt-4 border-t border-white/20">
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
            </section>

            {/* How We Craft — Process Section */}
            <section id="process" className="py-24 bg-stone-mid relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-blue opacity-5 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-brand-blue font-medium tracking-wide uppercase text-sm">Our Process</span>
                        <h2 className="md:text-5xl text-3xl font-medium tracking-tight mt-4 text-stone-dark">From Soybean to Crunch</h2>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-stone-border via-brand-gold to-stone-border"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {[
                                { step: "01", title: "Premium Soybeans", desc: "Locally sourced non-GMO soybeans for the freshest quality.", icon: Sprout },
                                { step: "02", title: "Natural Fermentation", desc: "Traditional 48-hour slow fermentation process.", icon: Microscope },
                                { step: "03", title: "Bold Seasoning", desc: "Hand-seasoned with signature heritage spice blends.", icon: Container },
                                { step: "04", title: "Export Ready", desc: "Vacuum-sealed to ensure international export quality.", icon: Store },
                            ].map((item, idx) => (
                                <div key={idx} className="relative group text-center md:text-left">
                                    <div className="w-24 h-24 rounded-full bg-white border border-stone-border flex items-center justify-center mb-6 relative z-10 group-hover:border-brand-gold transition-colors duration-300 mx-auto md:mx-0 shadow-sm">
                                        <item.icon className="w-10 h-10 text-brand-gold" />
                                    </div>
                                    <span className="block text-xs font-medium text-[#78716C] mb-2 uppercase tracking-widest">Step {item.step}</span>
                                    <h3 className="text-2xl font-medium mb-3 text-stone-dark">{item.title}</h3>
                                    <p className="text-lg text-[#57534E] leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Section */}
            <section id="compliance" className="py-32 bg-stone-mid">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            {/* Certificate Stack Visual */}
                            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 transform transition-all duration-700 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-neutral-200 -rotate-2 scale-95 opacity-60 transition-transform group-hover:-rotate-6"></div>
                                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-brand-gold text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-gold/30">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-semibold text-stone-dark mb-2 tracking-tight">Certificate of Quality</h3>
                                    <p className="text-sm italic text-[#78716C] mb-8">Food Safety & Authenticity Verified</p>
                                    <div className="w-full space-y-3 opacity-20 mb-8 px-8">
                                        <div className="h-1.5 bg-black rounded w-full"></div>
                                        <div className="h-1.5 bg-black rounded w-5/6 mx-auto"></div>
                                        <div className="h-1.5 bg-black rounded w-4/5 mx-auto"></div>
                                    </div>
                                </div>
                                <div className="absolute -right-4 top-12 bg-white px-4 py-3 rounded-xl shadow-xl border border-stone-border flex items-center gap-3">
                                    <div className="bg-brand-blue/5 text-brand-blue p-1 rounded-full"><Check className="w-4 h-4" /></div>
                                    <div className="text-left"><p className="text-xs font-semibold text-stone-dark tracking-wide uppercase">Standards Verified</p></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-xs font-medium mb-6">
                                    <ShieldCheck className="w-4 h-4" />
                                    Export Accreditation
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-stone-dark mb-6">Global Standard <br /><span className="text-brand-gold">Excellence</span></h2>
                                <p className="text-lg text-[#57534E] leading-relaxed font-light">We maintain rigorous international food safety protocols to bring Indonesian technology to world-class standards.</p>
                            </div>

                            <div className="space-y-4">
                                {[{ title: "HACCP Certified", sub: "Food Safety Management", icon: ShieldCheck },
                                { title: "Halal Indonesia", sub: "Approved by BPJPH", icon: Check },
                                { title: "SNI Standard", sub: "Indonesian National Standard", icon: FileBadge }
                                ].map((cert, idx) => (
                                    <div key={idx} className="group bg-white p-4 pr-6 rounded-xl border border-stone-border hover:border-brand-gold transition-all flex items-center gap-5 cursor-pointer">
                                        <div className="w-14 h-16 bg-neutral-50 rounded border border-neutral-200 flex items-center justify-center shrink-0">
                                            <cert.icon className="w-6 h-6 text-brand-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-stone-dark group-hover:text-brand-blue transition-colors">{cert.title}</h3>
                                            <p className="text-sm text-[#78716C]">{cert.sub}</p>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-white transition-all transform group-hover:scale-105">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <CTA />
        </div>
    );
};

export default Home;
