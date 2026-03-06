// EventDetail.jsx — Halaman detail artikel individual
// Data diambil dari backend API /api/articles/:id
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { api } from '../utils/api'; // Utilitas API backend

/**
 * EventDetail — Halaman detail artikel
 * Mengambil data artikel dari API berdasarkan ID di URL
 */
const EventDetail = () => {
    const { id } = useParams(); // Ambil ID dari URL

    const [article, setArticle] = useState(null); // State data artikel
    const [loading, setLoading] = useState(true); // State loading

    // Ambil detail artikel dari backend
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await api.get(`/articles/${id}`); // GET /api/articles/:id
                setArticle(data); // Simpan ke state
            } catch (error) {
                console.error('Gagal memuat artikel:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    // Konfigurasi animasi
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="bg-neutral-bone min-h-screen pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="h-4 bg-stone-200 rounded w-40 mb-8 animate-pulse"></div>
                    <div className="h-10 bg-stone-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="aspect-[2/1] bg-stone-200 rounded-[2rem] mb-8 animate-pulse"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-stone-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-stone-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-stone-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Jika artikel tidak ditemukan
    if (!article) {
        return (
            <div className="pt-40 pb-20 text-center">
                <h2 className="text-2xl font-serif text-stone-dark mb-4">Article Not Found</h2>
                <Link to="/events" className="text-brand-gold-dark font-medium hover:underline">Return to Stories</Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(article.title)}</title>
                <meta name="description" content={article.excerpt || article.title} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Tombol kembali */}
                    <motion.div {...fadeIn} className="mb-8">
                        <Link to="/events" className="inline-flex items-center gap-2 text-[#78716C] hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Stories
                        </Link>
                    </motion.div>

                    {/* Artikel */}
                    <motion.article {...fadeIn}>
                        {/* Judul */}
                        <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-dark tracking-tight mb-6 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#78716C] mb-8">
                            {article.date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-brand-blue" />
                                    {article.date}
                                </span>
                            )}
                            {article.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-brand-blue" />
                                    {article.author}
                                </span>
                            )}
                            {article.category && (
                                <span className="flex items-center gap-1.5">
                                    <Tag className="w-4 h-4 text-brand-gold" />
                                    {article.category}
                                </span>
                            )}
                        </div>

                        {/* Gambar sampul */}
                        {article.image && (
                            <div className="rounded-[2rem] overflow-hidden mb-10 shadow-xl">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-auto object-cover aspect-[2/1]"
                                />
                            </div>
                        )}

                        {/* Konten artikel — whitespace-pre-line untuk menjaga line break */}
                        <div className="prose prose-lg max-w-none">
                            <p className="text-[#57534E] leading-[1.9] whitespace-pre-line text-base md:text-lg">
                                {article.content}
                            </p>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-stone-border mt-12 pt-8">
                            <Link to="/events" className="text-brand-blue font-semibold hover:underline text-sm">
                                ← Kembali ke Semua Artikel
                            </Link>
                        </div>
                    </motion.article>
                </div>
            </div>
        </>
    );
};

export default EventDetail;
