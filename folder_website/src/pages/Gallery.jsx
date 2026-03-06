// Gallery.jsx — Halaman Galeri Foto
// Data diambil dari backend API /api/galleries
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Instagram } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { api } from '../utils/api'; // Utilitas API

/**
 * Gallery — Menampilkan koleksi foto dalam grid Masonry-style
 * Data diambil dari database via API /api/galleries
 */
const Gallery = () => {
    const [images, setImages] = useState([]); // State daftar gambar
    const [loading, setLoading] = useState(true); // State loading

    // Fetch data galeri dari backend
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await api.get('/galleries'); // GET /api/galleries
                setImages(data);
            } catch (error) {
                console.error('Gagal memuat galeri:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    // Pengaturan animasi
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Gallery')}</title>
                <meta name="description" content="A visual journey through Pakuaty's heritage, craftsmanship, and export-quality tempe chips." />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Spirit</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            Visual <span className="text-brand-blue">Journal</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            A glimpse into our heritage, the precision of our process, and the passion that defines Pakuaty.
                        </p>
                    </motion.div>

                    {/* Loading state */}
                    {loading ? (
                        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="md:col-span-4 aspect-square bg-stone-100 rounded-[1.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        /* Grid Galeri Masonry-style */
                        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
                            {images.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    {...fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${item.span || 'md:col-span-4'} col-span-4 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-border bg-white`}
                                >
                                    {/* Link Pembungkus atau Gambar */}
                                    <div className={`relative ${item.aspect || 'aspect-square'} overflow-hidden`}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        {/* Overlay Info on Hover */}
                                        <div className="absolute inset-0 bg-stone-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                                            <span className="text-brand-gold font-bold text-[10px] uppercase tracking-widest mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {item.category}
                                            </span>
                                            <h3 className="text-white text-lg md:text-2xl font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Instagram CTA Section */}
                    <motion.div {...fadeIn} className="mt-24 md:mt-40 text-center">
                        <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-10 md:p-20 border border-stone-border shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <Instagram className="w-12 h-12 text-brand-blue mx-auto mb-8" />
                                <h2 className="text-3xl md:text-5xl font-serif text-stone-dark mb-6">Stay Connected</h2>
                                <p className="text-[#57534E] mb-10 max-w-lg mx-auto leading-relaxed">
                                    Join our community on Instagram for behind-the-scenes stories, latest innovations, and heritage updates.
                                </p>
                                <a
                                    href="https://instagram.com/pakuaty.artisan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-stone-dark transition-all shadow-xl hover:shadow-brand-blue/20"
                                >
                                    Follow @pakuaty.artisan
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Gallery;
