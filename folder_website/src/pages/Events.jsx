import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, MapPin } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
/**
 * Events — Halaman unifikasi Acara & Berita
 * Menampilkan Event utama (Hero/Banner) di atas, 
 * dan daftar Artikel di bawahnya.
 * Data saat ini dikosongkan karena beralih ke mode statis.
 */
const Events = () => {
    const { t } = useLanguage();
    const [events, setEvents] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventsRes, articlesRes] = await Promise.all([
                fetch('http://localhost:5000/api/events'),
                fetch('http://localhost:5000/api/articles')
            ]);

            if (eventsRes.ok && articlesRes.ok) {
                const eventsData = await eventsRes.json();
                const articlesData = await articlesRes.json();
                setEvents(eventsData);
                setArticles(articlesData);
            }
        } catch (error) {
            console.error('Failed to fetch events/articles:', error);
        } finally {
            setLoading(false);
        }
    };

    // Logic penentuan Featured (Acara Utama)
    // Sesuai permintaan: Hanya tampilkan banner jika ada data 'events'
    // Jika tidak ada 'events', container banner (FeaturedSection) akan disembunyikan
    const featuredContent = events.length > 0 ? { ...events[0], type: 'event' } : null;

    // Daftar Berita/Artikel yang akan ditampilkan di grid
    // Jika tidak ada banner (featuredContent null), tampilkan semua artikel dari awal
    const displayArticles = articles;

    // Konfigurasi animasi
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    if (loading) {
        return (
            <div className="bg-neutral-bone min-h-screen flex items-center justify-center">
                <div className="text-stone-dark/40 font-bold animate-pulse tracking-widest uppercase text-xs">
                    Memuat Acara & Berita...
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.events_title'))}</title>
                <meta name="description" content={t('seo.events_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">

                    {/* 1. Featured Section — Agenda Terkini (Mungkin Cuma 1) */}
                    {featuredContent && (
                        <motion.div
                            {...fadeIn}
                            className="relative mb-20 md:mb-32 overflow-hidden rounded-[3rem] bg-stone-dark group"
                        >
                            <div className="grid md:grid-cols-2">
                                {/* Visual: Gambar Featured */}
                                <div className="aspect-[4/3] md:aspect-auto h-full overflow-hidden">
                                    <img
                                        src={featuredContent.image}
                                        alt={featuredContent.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                                    />
                                </div>
                                {/* Konten: Info Acara Utama */}
                                <div className="p-8 md:p-16 flex flex-col justify-center text-white">
                                    {/* Label kategori banner: Selalu 'Agenda Mendatang' karena featured hanya untuk event */}
                                    <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">
                                        Agenda Mendatang
                                    </span>
                                    {/* Judul acara */}
                                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
                                        {featuredContent.title}
                                    </h2>
                                    {/* Deskripsi singkat acara */}
                                    <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed line-clamp-3 mb-10">
                                        {featuredContent.description}
                                    </p>

                                    {/* Metadata: Tanggal dan Lokasi acara */}
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-stone-400">
                                        <div className="flex items-center gap-2">
                                            {/* Icon Kalender */}
                                            <Calendar className="w-4 h-4 text-brand-gold" />
                                            {featuredContent.date}
                                        </div>
                                        {featuredContent.location && (
                                            <div className="flex items-center gap-2">
                                                {/* Icon Pin Lokasi */}
                                                <MapPin className="w-4 h-4 text-brand-gold" />
                                                {featuredContent.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tombol ajakan bertindak (CTA) */}
                                    <Link
                                        to={`/events/event/${featuredContent.id}`}
                                        className="inline-flex items-center gap-4 text-brand-gold hover:text-white transition-all uppercase text-xs font-bold tracking-widest group/btn"
                                    >
                                        Selengkapnya
                                        {/* Icon Panah dengan animasi hover */}
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Header Artikel */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">
                            Arsip & Berita
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-stone-dark tracking-tight">
                            Cerita <span className="text-brand-blue italic">Pakuaty</span>
                        </h2>
                    </motion.div>

                    {/* 2. Article Grid — Daftar Berita di bawahnya */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayArticles.map((article, idx) => (
                            <Link to={`/events/article/${article.id}`} key={article.id} className="block group">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="bg-white rounded-[2rem] border border-stone-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700"
                                >
                                    {/* Gambar artikel */}
                                    <div className="aspect-[3/2] overflow-hidden relative">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-brand-blue shadow-md uppercase tracking-wider">
                                            {article.category || 'Berita'}
                                        </span>
                                    </div>

                                    {/* Konten card */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#78716C] mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                                {article.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-brand-gold-dark" />
                                                {article.author || 'Admin'}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-stone-dark mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-[#57534E] line-clamp-3 mb-6 leading-relaxed font-light">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-brand-blue text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                            Baca Selengkapnya
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {articles.length === 0 && events.length === 0 && (
                        <div className="text-center py-20 text-[#78716C]">
                            <p className="text-xl italic">Belum ada acara atau berita yang diterbitkan.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Events;
