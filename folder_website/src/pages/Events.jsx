import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, MapPin } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
import useSWR from 'swr';
import { API_BASE_URL } from '../utils/api';

const fetcher = (url) => fetch(url).then(res => res.json());

/**
 * Events — Halaman unifikasi Acara & Berita
 * Menampilkan Event utama (Hero/Banner) di atas, 
 * dan daftar Artikel di bawahnya.
 */
const Events = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';

    // SWR fetching untuk events
    const { data: events = [], isLoading: eventsLoading } = useSWR(
        `${API_BASE_URL}/events`,
        fetcher,
        { refreshInterval: 60000, revalidateOnFocus: true }
    );

    // SWR fetching untuk articles
    const { data: articles = [], isLoading: articlesLoading } = useSWR(
        `${API_BASE_URL}/articles`,
        fetcher,
        { refreshInterval: 60000, revalidateOnFocus: true }
    );

    const loading = eventsLoading || articlesLoading;

    // Logic penentuan Featured (Acara Utama) berdasarkan status 'Sematkan' (is_pinned)
    // 1. Gabungkan semua data (events & articles)
    const allContent = [
        ...events.map(e => ({ ...e, type: 'event' })),
        ...articles.map(a => ({ ...a, type: 'article' }))
    ];

    // 2. Cari konten yang statusnya disematkan (is_pinned: true)
    // Ambil yang paling baru (sort by date descending)
    const pinnedContent = allContent
        .filter(item => item.is_pinned === true || item.is_pinned === 1)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Set Featured Content: Prioritaskan yang disematkan, 
    // jika tidak ada yang disematkan, gunakan Event terbaru (events[0]). 
    // Jika event juga tidak ada, gunakan Article terbaru (articles[0]), jika kosong, maka null.
    const featuredContent = pinnedContent.length > 0
        ? pinnedContent[0]
        : (events.length > 0 ? { ...events[0], type: 'event' } : (articles.length > 0 ? { ...articles[0], type: 'article' } : null));

    // Daftar Berita/Artikel yang akan ditampilkan di grid
    // Filter agar konten yang sudah tampil di Banner Utama (featuredContent) TIDAK muncul lagi di daftar bawah (mencegah ganda)
    const displayArticles = articles.filter(article => featuredContent ? article.id !== featuredContent.id || featuredContent.type !== 'article' : true);

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
                    {t('events.loading')}
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
                                <div className="aspect-[16/9] md:aspect-auto h-full overflow-hidden">
                                    <img
                                        src={featuredContent.image}
                                        alt={featuredContent.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                                    />
                                </div>
                                {/* Konten: Info Acara Utama */}
                                <div className="p-6 md:p-16 flex flex-col justify-center text-white">
                                    {/* Label kategori banner: Selalu 'Agenda Mendatang' karena featured hanya untuk event */}
                                    <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[9px] md:text-[10px] mb-4 md:mb-6 block">
                                        {t('events.hero_label')}
                                    </span>
                                    {/* Judul acara */}
                                    <h2 className="text-2xl md:text-5xl font-medium tracking-tight mb-4 md:mb-8 leading-tight">
                                        {(isEn && featuredContent.title_en) ? featuredContent.title_en : featuredContent.title}
                                    </h2>
                                    {/* Deskripsi singkat acara */}
                                    <p className="text-stone-300 text-xs md:text-base font-light leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 md:mb-10">
                                        {(isEn && featuredContent.description_en) ? featuredContent.description_en : featuredContent.description}
                                    </p>

                                    {/* Metadata: Tanggal dan Lokasi acara */}
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-8 md:mb-12 text-stone-400">
                                        <div className="flex items-center gap-2">
                                            {/* Icon Kalender */}
                                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-brand-gold" />
                                            {featuredContent.date}
                                        </div>
                                        {featuredContent.location && (
                                            <div className="flex items-center gap-2">
                                                {/* Icon Pin Lokasi */}
                                                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-brand-gold" />
                                                <span className="line-clamp-1">{featuredContent.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tombol ajakan bertindak (CTA) */}
                                    <Link
                                        to={`/events/event/${featuredContent.id}`}
                                        className="inline-flex items-center gap-4 text-brand-gold hover:text-white transition-all uppercase text-xs font-bold tracking-widest group/btn"
                                    >
                                        {t('events.hero_more')}
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
                            {t('events.article_header')}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-stone-dark tracking-tight">
                            {t('events.article_title')} <span className="text-brand-blue italic">{t('events.article_title_accent')}</span>
                        </h2>
                    </motion.div>

                    {/* 2. Article Grid — Daftar Berita di bawahnya */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {displayArticles.map((article, idx) => (
                            <Link to={`/events/article/${article.id}`} key={article.id} className="block group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        className="bg-white rounded-2xl md:rounded-[2rem] border border-stone-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 h-full flex flex-col"
                                    >
                                    {/* Gambar artikel */}
                                    <div className="aspect-[3/2] overflow-hidden relative shrink-0">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-brand-blue shadow-md uppercase tracking-wider">
                                            {article.category || t('events.article_category_default')}
                                        </span>
                                    </div>

                                    {/* Konten card */}
                                    <div className="p-4 md:p-6 flex flex-col flex-1">
                                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#78716C] mb-3 md:mb-4 opacity-60">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                                {article.date}
                                            </div>
                                            {!isEn && article.author && (
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <User className="w-3 h-3 text-brand-gold-dark" />
                                                    {article.author}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-base md:text-xl font-bold text-stone-dark mb-2 md:mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                            {(isEn && article.title_en) ? article.title_en : article.title}
                                        </h3>

                                        <p className="hidden md:block text-sm text-[#57534E] line-clamp-3 mb-6 leading-relaxed font-light">
                                            {(isEn && article.excerpt_en) ? article.excerpt_en : (article.excerpt || article.content)}
                                        </p>

                                        <div className="mt-auto">
                                            <div
                                                className="md:px-8 md:py-3.5 bg-brand-blue text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 w-full md:w-fit py-2.5 flex items-center justify-center gap-2"
                                            >
                                                {t('events.read_more')}
                                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {articles.length === 0 && events.length === 0 && (
                        <div className="text-center py-20 text-[#78716C]">
                            <p className="text-xl italic">{t('events.empty')}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Events;
