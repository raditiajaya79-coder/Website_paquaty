import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';

/**
 * Events — Halaman artikel & berita
 * Menampilkan daftar artikel atau berita terbaru.
 * Menggunakan data statis dan dukungan multi-bahasa.
 */
const Events = () => {
    const { t } = useLanguage();

    // Data artikel statis (mengikuti pola incoming pull)
    const articles = [
        { id: 1, image: "/images/keripik tempe original pakuaty.jpg" },
        { id: 2, image: "/images/keirpik tempe balado pakuaty.jpg" },
        { id: 3, image: "/images/logo pakuaty tagline.png" },
        { id: 4, image: "/images/keripik tempe sapi pakuaty.jpg" },
        { id: 5, image: "/images/keripik jamur pakuaty.jpg" },
        { id: 6, image: "/images/FOTO ALL KERIPIK TEMPE.jpg" }
    ];

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
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">
                            {t('events.header_label')}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            {t('events.header_title')}<span className="text-brand-blue italic">{t('events.header_title_accent')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            {t('events.header_desc')}
                        </p>
                    </motion.div>

                    {/* Grid artikel */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, idx) => (
                            <Link to={`/events/${article.id}`} key={article.id} className="block group">
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
                                            alt={t(`article.${article.id}.title`)}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        {/* Badge kategori */}
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-brand-blue shadow-md uppercase tracking-wider">
                                            {t(`article.${article.id}.cat`)}
                                        </span>
                                    </div>

                                    {/* Konten card */}
                                    <div className="p-6">
                                        {/* Meta: tanggal + author */}
                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#78716C] mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                                {t(`article.${article.id}.date`) || "2026"}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-brand-gold-dark" />
                                                {t(`article.${article.id}.author`)}
                                            </div>
                                        </div>

                                        {/* Judul */}
                                        <h3 className="text-xl font-bold text-stone-dark mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                            {t(`article.${article.id}.title`)}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-sm text-[#57534E] line-clamp-3 mb-6 leading-relaxed font-light">
                                            {t(`article.${article.id}.excerpt`)}
                                        </p>

                                        {/* Read more */}
                                        <div className="flex items-center gap-2 text-brand-blue text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                            {t('events.read_more')}
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {articles.length === 0 && (
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
