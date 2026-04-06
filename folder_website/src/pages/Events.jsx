import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, MapPin } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';

/**
 * Events — Halaman unifikasi Acara & Berita
 * Menampilkan Event utama (Hero/Banner) di atas, 
 * dan daftar Artikel di bawahnya.
 */
const Events = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';

    // Ambil events dan articles dari data yang sudah di-preload (tidak perlu fetch lagi)
    const { events, articles } = useGlobalData();

    // Data sudah dimuat di preloader, tidak perlu loading state
    const loading = false;

    // Logic penentuan Featured (Acara Utama) berdasarkan status 'Sematkan' (is_pinned)
    const allContent = [
        ...events.map(e => ({ ...e, type: 'event' })),
        ...articles.map(a => ({ ...a, type: 'article' }))
    ];

    // 1. Ambil konten yang disematkan (is_pinned: true/1)
    const pinnedContent = allContent
        .filter(item => item.is_pinned === true || item.is_pinned === 1)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Featured Content: HANYA jika ada yang disematkan.
    const featuredContent = pinnedContent.length > 0 ? pinnedContent[0] : null;

    // 3. Daftar konten yang akan ditampilkan di grid (semua yang TIDAK tampil di Hero)
    const displayContent = allContent
        .filter(item => !featuredContent || (item.id !== featuredContent.id || item.type !== featuredContent.type))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

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
                <title>{generatePageTitle(t('seo.events_title'))}</title>
                <meta name="description" content={t('seo.events_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">

                    {/* 1. Featured Section — Agenda Terkini (Mungkin Cuma 1) */}
                    {featuredContent && (
                        <motion.div
                            {...fadeIn}
                            className="relative mb-20 md:mb-32 overflow-hidden rounded-2xl md:rounded-[3rem] bg-stone-dark group shadow-2xl aspect-[1.8/1] sm:aspect-[2.2/1] lg:aspect-[2.8/1]"
                        >
                            <Link to={`/events/${featuredContent.type === 'event' ? 'event' : 'article'}/${featuredContent.id}`} className="block w-full h-full">
                                <div className="grid grid-cols-[1fr_1.2fr] md:grid-cols-2 items-stretch h-full w-full">
                                    {/* Visual: Gambar Featured */}
                                    <div className="w-full h-full overflow-hidden">
                                        <img
                                            src={featuredContent.image}
                                            alt={featuredContent.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                                        />
                                    </div>
                                    {/* Konten: Info Acara Utama */}
                                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center text-white bg-stone-900/40 backdrop-blur-sm h-full">
                                        {/* Label kategori banner */}
                                        <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[7px] md:text-[10px] mb-1.5 md:mb-4 block opacity-60">
                                            {t('events.hero_label')}
                                        </span>
                                        {/* Judul acara */}
                                        <h2 className="text-sm md:text-3xl lg:text-4xl font-medium tracking-tight mb-3 md:mb-4 leading-snug md:leading-tight line-clamp-2">
                                            {(isEn && featuredContent.title_en) ? featuredContent.title_en : featuredContent.title}
                                        </h2>
                                        {/* Deskripsi singkat acara - Hidden on mobile */}
                                        <p className="hidden md:block text-stone-300 text-xs md:text-sm font-light leading-relaxed line-clamp-2 mb-4 md:mb-6">
                                            {(isEn && featuredContent.description_en) ? featuredContent.description_en : featuredContent.description}
                                        </p>

                                        {/* Metadata: Tanggal dan Lokasi acara - Hidden on mobile */}
                                        <div className="hidden md:flex flex-wrap items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-6 md:mb-8 text-stone-400">
                                            <div className="flex items-center gap-2">
                                                {/* Icon Kalender */}
                                                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-brand-gold" />
                                                {featuredContent.date}
                                            </div>
                                            {featuredContent.location && (
                                                <div className="flex items-center gap-2">
                                                    {/* Icon Pin Lokasi */}
                                                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-gold" />
                                                    <span className="line-clamp-1">{featuredContent.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tombol CTA */}
                                        <div
                                            className="inline-flex items-center gap-2 md:gap-3 text-white text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] group/btn mt-2 md:mt-0"
                                        >
                                            <span className="relative">
                                                {t('events.view_details')}
                                                <span className="absolute -bottom-0.5 md:-bottom-1 left-0 w-full h-[1px] bg-brand-gold transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></span>
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-gold group-hover/btn:translate-x-2 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
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

                    {/* 2. Content Grid — Daftar Berita & Event di bawahnya */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {displayContent.map((item, idx) => (
                            <Link to={`/events/${item.type}/${item.id}`} key={`${item.type}-${item.id}`} className="block group">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="bg-white rounded-2xl md:rounded-[2rem] border border-stone-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 h-full flex flex-col"
                                >
                                    {/* Gambar item */}
                                    <div className="aspect-[3/2] overflow-hidden relative shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-brand-blue shadow-md uppercase tracking-wider">
                                            {item.category || (item.type === 'event' ? t('events.event_category_default') : t('events.article_category_default'))}
                                        </span>
                                    </div>

                                    {/* Konten card */}
                                    <div className="p-4 md:p-6 flex flex-col flex-1">
                                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#78716C] mb-3 md:mb-4 opacity-60">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                                {item.date}
                                            </div>
                                            {item.type === 'article' && item.author && (
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <User className="w-3 h-3 text-brand-gold-dark" />
                                                    {item.author}
                                                </div>
                                            )}
                                            {item.type === 'event' && item.location && (
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <MapPin className="w-3 h-3 text-brand-gold-dark" />
                                                    {item.location}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-base md:text-xl font-bold text-stone-dark mb-2 md:mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                            {(isEn && item.title_en) ? item.title_en : item.title}
                                        </h3>

                                        <p className="hidden md:block text-sm text-[#57534E] line-clamp-3 mb-6 leading-relaxed font-light">
                                            {(isEn && (item.excerpt_en || item.description_en)) ? (item.excerpt_en || item.description_en) : (item.excerpt || item.content || item.description)}
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
