// Events.jsx — Halaman artikel & berita
// Data diambil dari backend API /api/articles
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { api } from '../utils/api'; // Utilitas API backend

/**
 * Events — Halaman daftar artikel/berita
 * Data diambil dari database via API /api/articles
 */
const Events = () => {
    const [articles, setArticles] = useState([]); // State daftar artikel dari API
    const [loading, setLoading] = useState(true); // State loading

    // Ambil semua artikel dari backend
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await api.get('/articles'); // GET /api/articles
                setArticles(data); // Simpan ke state
            } catch (error) {
                console.error('Gagal memuat artikel:', error.message);
            } finally {
                setLoading(false); // Matikan loading
            }
        };
        fetchArticles();
    }, []);

    // Konfigurasi animasi
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Stories & Insights')}</title>
                <meta name="description" content="Discover the stories behind Pakuaty's artisan tempe chips. From heritage fermentation processes to global export journeys." />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Stories</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            Stories & <span className="text-brand-blue">Insights</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            From our fermentation heritage to the global stage — discover the world of artisan tempe craftsmanship.
                        </p>
                    </motion.div>

                    {/* Loading state */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] overflow-hidden animate-pulse">
                                    <div className="aspect-[3/2] bg-stone-100"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-3 bg-stone-100 rounded w-1/3"></div>
                                        <div className="h-5 bg-stone-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-stone-100 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Grid artikel */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <Link to={`/events/${article.id}`} key={article.id} className="block group">
                                    <motion.div
                                        {...fadeIn}
                                        className="bg-white rounded-[2rem] border border-stone-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700"
                                    >
                                        {/* Gambar artikel */}
                                        <div className="aspect-[3/2] overflow-hidden relative">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            {/* Badge kategori */}
                                            {article.category && (
                                                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-brand-gold text-stone-dark shadow-md uppercase tracking-wider">
                                                    {article.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Konten card */}
                                        <div className="p-6">
                                            {/* Meta: tanggal + author */}
                                            <div className="flex items-center gap-3 text-xs text-[#78716C] mb-3">
                                                <span>{article.date}</span>
                                                <span className="w-1 h-1 bg-[#D6D3D1] rounded-full"></span>
                                                <span>{article.author}</span>
                                            </div>

                                            {/* Judul */}
                                            <h3 className="text-lg font-semibold text-stone-dark mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-[#57534E] line-clamp-3 mb-4 leading-relaxed">
                                                {article.excerpt}
                                            </p>

                                            {/* Read more */}
                                            <div className="flex items-center gap-2 text-brand-blue text-sm font-semibold group-hover:gap-3 transition-all">
                                                Read More
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && articles.length === 0 && (
                        <div className="text-center py-20 text-[#78716C]">
                            <p className="text-xl">Belum ada artikel yang diterbitkan.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Events;
