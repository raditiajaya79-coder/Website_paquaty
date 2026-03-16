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
    const { t, lang } = useLanguage();

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
                    {t('event.detail.loading')} {typeLabel}...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-neutral-bone min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-stone-dark mb-4">{t('event.detail.not_found')}</h2>
                <p className="text-stone-dark/50 mb-8">{error || t('event.detail.not_found_desc')}</p>
                <Link to="/events" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold">
                    {t('event.detail.back')}
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{generatePageTitle((lang === 'en' && data.title_en) ? data.title_en : data.title)}</title>
                <meta name="description" content={((lang === 'en' && data.excerpt_en) ? data.excerpt_en : data.excerpt) || ((lang === 'en' && data.description_en) ? data.description_en : data.description)?.substring(0, 160)} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tombol kembali */}
                    <motion.div {...fadeIn} className="mb-12">
                        <Link to="/events" className="inline-flex items-center gap-2 text-stone-dark/60 hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            {t('event.detail.back')}
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
                            {(lang === 'en' && data.title_en) ? data.title_en : data.title}
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
                            className="relative aspect-[21/9] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
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
                        {( (lang === 'en' ? (data.excerpt_en || data.excerpt) : data.excerpt) || (isArticle && (lang === 'en' ? (data.content_en || data.content) : data.content))) && (
                            <p className="text-xl md:text-2xl text-stone-dark/80 leading-relaxed mb-12 font-light italic border-l-4 border-brand-gold/30 pl-8">
                                {(lang === 'en' ? (data.excerpt_en || data.excerpt) : data.excerpt) || (lang === 'en' ? (data.description_en || data.description) : data.description)?.substring(0, 200)}
                            </p>
                        )}

                        <div className="text-lg text-[#57534E] leading-[2] space-y-10 font-light">
                            {(() => {
                                let content = isArticle ? data.content : data.description;
                                if (lang === 'en') {
                                    const contentEn = isArticle ? data.content_en : data.description_en;
                                    if (contentEn && contentEn !== '[]' && contentEn !== '""') {
                                        content = contentEn;
                                    }
                                }
                                if (!content) return null;

                                try {
                                    // Coba parse sebagai JSON (Modul Dinamis Antigravity)
                                    const blocks = JSON.parse(content);
                                    if (Array.isArray(blocks)) {
                                        return blocks.map((block, idx) => {
                                            if (block.type === 'text') {
                                                return (
                                                    <p key={idx} className="whitespace-pre-line">
                                                        {block.value}
                                                    </p>
                                                );
                                            }
                                            if (block.type === 'image') {
                                                return (
                                                    <div key={idx} className="my-12 relative rounded-[2rem] overflow-hidden shadow-xl border border-stone-200/50">
                                                        <img 
                                                            src={block.value} 
                                                            alt="Content" 
                                                            className="w-full h-auto object-cover max-h-[600px]"
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        });
                                    }
                                } catch (e) {
                                    // Fallback ke rendering teks biasa jika bukan JSON
                                    return <div className="whitespace-pre-line">{content}</div>;
                                }
                            })()}
                        </div>
                    </motion.div>

                    {/* Footer Share */}
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.4 }}
                        className="mt-20 pt-12 border-t border-stone-border flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold uppercase tracking-widest text-stone-dark/60">{t('event.detail.share')}</span>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-stone-border flex items-center justify-center cursor-pointer hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                        <Share2 className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link to="/events" className="text-brand-blue font-semibold hover:underline text-sm">
                            {t('event.detail.view_all')}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default EventDetail;
