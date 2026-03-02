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
        { id: 1, src: "/images/keripik tempe original pakuaty.jpg", size: "col-span-1 row-span-1", title: "Original Heritage" },
        { id: 2, src: "/images/keirpik tempe balado pakuaty.jpg", size: "md:col-span-2 md:row-span-1", title: "Spicy Balado Selection" },
        { id: 3, src: "/images/keripik tempe bbq pakuaty.jpg", size: "col-span-1 row-span-2", title: "Smoky BBQ Series" },
        { id: 4, src: "/images/keripik tempe keju pakuaty.jpg", size: "col-span-1 row-span-1", title: "Premium Cheese" },
        { id: 5, src: "/images/keripik tempe sapi pakuaty.jpg", size: "col-span-1 row-span-1", title: "Roasted Beef Special" },
        { id: 6, src: "/images/keripik jamur pakuaty.jpg", size: "md:col-span-2 md:row-span-1", title: "Crispy Mushroom Edition" },
    ];

    return (
        <div className="bg-stone-light min-h-screen pt-32 pb-24">
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
                        Our <span className="text-brand-gold italic">Gallery</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-dark/60 max-w-2xl mx-auto"
                    >
                        A curated collection of our finest products and the heritage behind every crunch.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 relative">
                    {images.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`relative group overflow-hidden rounded-[2.5rem] shadow-lg bg-stone-200 flex items-center justify-center ${img.size}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-200 opacity-50 transition-transform duration-1000 group-hover:scale-110"></div>
                            <div className="relative z-10 text-stone-400 font-bold tracking-tighter text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 select-none">
                                GALLERY
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-stone-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-center p-6 backdrop-blur-[2px]">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileHover={{ y: 0, opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">{img.title}</h3>
                                        <p className="text-brand-gold-light text-xs font-medium uppercase tracking-widest font-sans">Premium Selection</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-12 bg-white rounded-[3.5rem] border border-stone-border shadow-soft flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="max-w-md text-center md:text-left">
                        <h3 className="text-3xl font-serif font-medium text-stone-dark mb-4">Follow Our Journey</h3>
                        <p className="text-[#78716C]">Stay connected for daily updates, behind-the-scenes content, and new product launches on our social channels.</p>
                    </div>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-10 py-5 bg-stone-dark text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-brand-blue transition-all shadow-xl active:scale-95"
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
