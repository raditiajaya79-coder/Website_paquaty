import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { generatePageTitle } from '../utils/seo';
import { Maximize2, Instagram } from 'lucide-react';

const Gallery = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const images = [
        { id: 1, src: "/images/keripik tempe original pakuaty.jpg", span: "md:col-span-8", aspect: "aspect-[1.5/1] md:aspect-[2/1]", title: "Heritage Fermentation", category: "Process" },
        { id: 2, src: "/images/keirpik tempe balado pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", title: "Spicy Infusion", category: "Flavor" },
        { id: 3, src: "/images/keripik tempe bbq pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", title: "Smoky Perfection", category: "Quality" },
        { id: 4, src: "/images/keripik tempe keju pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", title: "Golden Grating", category: "Detail" },
        { id: 5, src: "/images/keripik tempe sapi pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", title: "Roasted Excellence", category: "Export" },
        { id: 6, src: "/images/keripik jamur pakuaty.jpg", span: "md:col-span-6", aspect: "aspect-video", title: "Crunch Anatomy", category: "Detail" },
        { id: 7, src: "/images/FOTO ALL KERIPIK TEMPE.jpg", span: "md:col-span-6", aspect: "aspect-video", title: "The Collection", category: "Brand" },
    ];

    return (
        <div className="bg-brand-cream min-h-screen pt-32 pb-24 relative overflow-hidden">
            <Helmet>
                <title>{generatePageTitle('Visual Gallery')}</title>
                <meta name="description" content="Explore the visual journey of Pakuaty's premium tempe chips." />
            </Helmet>

            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-20 text-center">
                    <motion.span
                        {...fadeIn}
                        className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                    >
                        Visual Narrative
                    </motion.span>
                    <motion.h1
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-medium tracking-tight text-stone-dark mb-6"
                    >
                        Our <span className="text-brand-blue italic">Gallery</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-dark/60 max-w-2xl mx-auto"
                    >
                        A curated collection of our finest products and the heritage behind every crunch.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {images.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                            className={`relative group overflow-hidden rounded-[3rem] shadow-xl bg-white border border-stone-border/30 transform-gpu ${img.span} ${img.aspect}`}
                        >
                            {/* Image Container with Inner Padding for "Gallery Frame" effect */}
                            <div className="absolute inset-0 p-4 transition-all duration-700 group-hover:p-0">
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="w-full h-full object-cover rounded-[2.2rem] transition-all duration-1000 group-hover:rounded-none group-hover:scale-105"
                                />
                            </div>

                            {/* Glassmorphism Category Badge */}
                            <div className="absolute top-8 left-8 z-20">
                                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue shadow-xl border border-white/20">
                                    {img.category}
                                </span>
                            </div>

                            {/* Luxury Dark Overlay with Title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/90 via-stone-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 pointer-events-none">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileHover={{ y: 0, opacity: 1 }}
                                    className="space-y-2"
                                >
                                    <h3 className="text-white text-3xl font-medium tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">{img.title}</h3>
                                    <div className="w-12 h-0.5 bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200 origin-left"></div>
                                </motion.div>
                            </div>

                            {/* Click Indicator */}
                            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                                <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-12 bg-white rounded-[3.5rem] border border-brand-gold/20 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="max-w-md text-center md:text-left">
                        <h3 className="text-3xl font-serif font-medium text-stone-dark mb-4">Follow Our Journey</h3>
                        <p className="text-[#78716C]">Stay connected for daily updates, behind-the-scenes content, and new product launches on our social channels.</p>
                    </div>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-brand-cyan transition-all shadow-xl active:scale-95"
                    >
                        <Instagram className="w-5 h-5" />
                        Explore on Instagram
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Gallery;
