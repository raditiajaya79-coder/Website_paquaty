import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, MapPin, Clock } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';

/**
 * EventDetail — Halaman detail dinamis untuk Artikel & Event
 * Mendeteksi tipe konten dari URL dan memuat data dari API.
 */
const EventDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const { t } = useLanguage();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Deteksi tipe konten (article atau event) dari URL path
    const isArticle = location.pathname.includes('/article/');
    const typeLabel = isArticle ? 'Berita' : 'Agenda';
    const endpoint = isArticle ? `/articles/${id}` : `/events/${id}`;

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const result = await api.get(endpoint);
                setData(result);
            } catch (err) {
                console.error('Gagal memuat detail:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [endpoint]);

    // Konfigurasi animasi
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    if (loading) {
        return (
            <div className="bg-neutral-bone min-h-screen flex items-center justify-center p-6">
                <div className="text-stone-dark/30 font-bold animate-pulse tracking-[0.2em] uppercase text-xs">
                    Memuat {typeLabel}...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-neutral-bone min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-stone-dark mb-4">Konten Tidak Ditemukan</h2>
                <p className="text-stone-dark/50 mb-8">{error || 'Data yang Anda cari mungkin sudah dihapus atau tidak tersedia.'}</p>
                <Link to="/events" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold">
                    Kembali ke Daftar
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(data.title)}</title>
                <meta name="description" content={data.excerpt || data.description?.substring(0, 160)} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Tombol kembali */}
                    <motion.div {...fadeIn} className="mb-12">
                        <Link to="/events" className="inline-flex items-center gap-2 text-stone-dark/60 hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Acara & Berita
                        </Link>
                    </motion.div>

                    {/* Header Konten */}
                    <motion.header {...fadeIn} transition={{ delay: 0.1 }} className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {data.category || typeLabel}
                            </span>
                            <div className="h-px flex-1 bg-stone-border/30"></div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-stone-dark mb-8 leading-[1.1]">
                            {data.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-dark/60">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-gold" />
                                {data.date}
                            </div>
                            {isArticle ? (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-brand-gold" />
                                    {data.author || 'Admin'}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-brand-gold" />
                                        {data.location}
                                    </div>
                                    {data.time && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-brand-gold" />
                                            {data.time}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.header>

                    {/* Gambar Utama */}
                    {data.image && (
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="relative aspect-[21/10] rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
                        >
                            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                        </motion.div>
                    )}

                    {/* Konten Utama */}
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.3 }}
                        className="prose prose-stone max-w-none"
                    >
                        {(data.excerpt || (isArticle && data.content)) && (
                            <p className="text-xl md:text-2xl text-stone-dark/80 leading-relaxed mb-12 font-light italic border-l-4 border-brand-gold/30 pl-8">
                                {data.excerpt || data.description?.substring(0, 200)}
                            </p>
                        )}

                        <div className="text-lg text-[#57534E] leading-[2] whitespace-pre-line space-y-6 font-light">
                            {isArticle ? data.content : data.description}
                        </div>
                    </motion.div>

                    {/* Footer Share */}
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.4 }}
                        className="mt-20 pt-12 border-t border-stone-border flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold uppercase tracking-widest text-stone-dark/60">Bagikan:</span>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-stone-border flex items-center justify-center cursor-pointer hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                        <Share2 className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link to="/events" className="text-brand-blue font-semibold hover:underline text-sm">
                            Lihat Semua Berita
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default EventDetail;
