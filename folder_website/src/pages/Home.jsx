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
        .filter(p => ["Original", "Balado", "BBQ", "Keju", "Sapi Panggang"].includes(p.name))
        .map(p => p.image);

    return (
        <div className="bg-stone-light text-stone-dark">
            {/* Hero Section — Slanted Reveal */}
            <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-[#1C1917]">
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
                <div className="absolute inset-0 flex w-[130%] h-full z-0 overflow-hidden -left-[10%] pointer-events-none">
                    {heroImages.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ width: "0%" }}
                            animate={{ width: isRevealed ? "28%" : "0%" }}
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
                                    className="w-full h-full object-cover scale-[1.3] object-center"
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
            </section>

            {/* Content Section (Transitioning back to light theme) */}
            <div className="relative z-10 bg-white">
                {/* High-Fidelity Badge Strip */}
                <div className="border-b border-stone-border py-12 relative z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap justify-center md:justify-between items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                            {["WholeFoods", "TESCO", "Carrefour", "Waitrose", "TraderJoe's"].map(brand => (
                                <span key={brand} className="text-xl font-semibold tracking-tight">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <section id="products" className="relative py-32 bg-stone-dark overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-40 pointer-events-none mix-blend-screen bg-brand-blue/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-30 pointer-events-none mix-blend-screen bg-brand-gold/10 blur-2xl rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                                Taste the <span className="text-brand-gold">Tradition</span>
                            </h2>
                            <p className="text-lg text-neutral-400 max-w-md font-light leading-relaxed">
                                Authentic Indonesian tempe chips in bold flavors, crafted from heritage recipes and the finest local ingredients.
                            </p>
                        </div>

                        <Link to="/products" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 backdrop-blur-sm">
                            <span className="text-neutral-200 font-medium group-hover:text-stone-dark">View Full Catalog</span>
                            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-stone-dark transition-colors" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.slice(0, 3).map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="group relative h-[500px] rounded-3xl bg-[#132316] border border-white/5 hover:border-brand-gold/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-gold/20 overflow-hidden block">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a140c] via-[#0a140c]/50 to-transparent opacity-90 z-10"></div>
                                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />

                                <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        {product.tag && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold text-stone-dark shadow-lg backdrop-blur-md border border-white/10">
                                                {product.tag}
                                            </span>
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 ml-auto">
                                            <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                                        </div>
                                    </div>

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-3xl font-semibold text-white tracking-tight mb-2">{product.name}</h3>
                                        <p className="text-brand-gold font-medium text-base mb-6">{product.grade}</p>

                                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Origin</p>
                                                <p className="text-sm font-medium text-neutral-200">{product.origin}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">MOQ</p>
                                                <p className="text-sm font-medium text-neutral-200">{product.moq}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
