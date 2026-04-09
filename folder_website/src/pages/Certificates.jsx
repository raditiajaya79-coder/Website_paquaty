import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Award, CheckCircle2, X, Download, FileCheck, Landmark, FileBadge, Check } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';
/**
 * Certificates — Halaman Sertifikasi & Kualitas
 * Data saat ini dikosongkan karena beralih ke mode statis tanpa dashboard admin.
 */
const Certificates = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';
    const [selectedCert, setSelectedCert] = useState(null);
    // Ambil certificates dari data yang sudah di-preload (tidak perlu fetch lagi)
    const { certificates } = useGlobalData();
    const loading = false; // Data sudah dimuat di preloader

    // Ikon default berdasarkan index (karena ikon tidak disimpan di database)
    const iconMap = [ShieldCheck, Check, FileBadge, FileCheck, Landmark];
    // Warna default berdasarkan index (alternating blue/gold)
    const colorMap = [
        { color: "text-brand-blue", bg: "bg-brand-blue/5" },
        { color: "text-brand-gold-dark", bg: "bg-brand-gold/5" },
        { color: "text-brand-gold-dark", bg: "bg-brand-gold/5" },
        { color: "text-brand-blue", bg: "bg-brand-blue/5" },
        { color: "text-brand-gold-dark", bg: "bg-brand-gold/5" }
    ];

    // Animasi komponen
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="bg-neutral-bone min-h-screen pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-stone-dark/40">Memuat Sertifikat...</p>
                </div>
            </div>
        );
    }

    // Jika tidak ada sertifikat aktif, tampilkan pesan kosong
    const activeCertificates = certificates.filter(c => c.is_active);
    if (activeCertificates.length === 0) {
        return (
            <>
                <Helmet>
                    <title>{generatePageTitle(t('seo.certs_title'))}</title>
                    <meta name="description" content={t('seo.certs_desc')} />
                </Helmet>
                <div className="bg-neutral-bone min-h-screen pt-24 pb-16 flex items-center justify-center">
                    <div className="text-center">
                        <ShieldCheck className="mx-auto text-stone-200 mb-6" size={64} />
                        <h2 className="text-2xl font-bold text-stone-dark/30 mb-2">Belum Ada Sertifikat</h2>
                        <p className="text-stone-dark/20">Sertifikat akan ditampilkan setelah diaktifkan.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.certs_title'))}</title>
                <meta name="description" content={t('seo.certs_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(218,165,32,0.08)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-28">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">
                            {t('certs.header_label')}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            {t('certs.header_title')}<span className="text-brand-blue italic">{t('certs.header_title_accent')}</span>
                        </h1>
                        <p className="text-base md:text-xl text-[#57534E] font-light leading-relaxed max-w-3xl mx-auto">
                            {t('certs.header_desc')}
                        </p>
                    </motion.div>

                    {/* ═══════════════════════════════════════════
                        CERTIFICATIONS GRID — Premium Card Design
                    ═══════════════════════════════════════════ */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {certificates.filter(c => c.is_active).map((cert, idx) => {
                            /* Stabil index untuk ikon & warna fallback */
                            const stableIdx = cert.id;
                            const IconComponent = iconMap[stableIdx % iconMap.length];
                            const colors = colorMap[stableIdx % colorMap.length];
                            /* Cek apakah gambar valid */
                            const hasRealImage = cert.image && !cert.image.includes('pure%20logo') && !cert.image.includes('pure logo');

                            return (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={() => setSelectedCert({ ...cert, icon: IconComponent, ...colors })}
                                    className="group cursor-pointer"
                                >
                                    {/* Card utama */}
                                    <div className="relative bg-stone-dark rounded-2xl md:rounded-[2rem] overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 hover:-translate-y-2">

                                        {/* Area gambar dengan overlay gradient */}
                                        <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden">
                                            {hasRealImage ? (
                                                <>
                                                    {/* Gambar certificate */}
                                                    <img
                                                        src={cert.image}
                                                        alt={cert.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.22,1,0.36,1]"
                                                        onError={(e) => {
                                                            if (e.target.src !== '/images/pure logo pakuaty.png') {
                                                                e.target.src = '/images/pure logo pakuaty.png';
                                                                e.target.className += ' opacity-20 grayscale';
                                                            }
                                                        }}
                                                    />
                                                    {/* Gradient overlay bawah — teks readable */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-dark via-stone-dark/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                                </>
                                            ) : (
                                                /* Fallback ikon */
                                                <div className="w-full h-full bg-gradient-to-br from-stone-dark to-stone-dark/80 flex items-center justify-center">
                                                    <div className={`w-12 h-12 md:w-20 md:h-20 ${colors.bg} rounded-xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
                                                        <IconComponent className={`w-6 h-6 md:w-10 md:h-10 ${colors.color}`} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Konten teks absolute di bawah gambar */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7">
                                                {/* Aksen garis emas di atas judul */}
                                                <div className="w-6 md:w-10 h-[2px] bg-brand-gold mb-2 md:mb-4 group-hover:w-10 md:group-hover:w-16 transition-all duration-500" />

                                                {/* Judul sertifikat */}
                                                <h3 className="text-sm sm:text-base md:text-xl font-bold text-white mb-0.5 md:mb-1 leading-snug tracking-tight group-hover:text-brand-gold transition-colors duration-300">
                                                    {(isEn && cert.title_en) ? cert.title_en : cert.title}
                                                </h3>
                                                {/* Sub-judul */}
                                                <p className="text-[7px] sm:text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] line-clamp-1">
                                                    {(isEn && cert.sub_en) ? cert.sub_en : (cert.sub || cert.issued_by)}
                                                </p>
                                            </div>

                                            {/* Badge "View" di pojok kanan atas */}
                                            <div className="absolute top-3 right-3 md:top-5 md:right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                                <div className="px-2 py-1 md:px-4 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                    <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest">
                                                        {t('certs.tap_indicator') || 'View'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Jaminan Kualitas Badge */}
                    <motion.div
                        {...fadeIn}
                        className="mt-20 md:mt-32 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-stone-dark text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                            <ShieldCheck className="w-full h-full -rotate-12 translate-x-1/4" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-gold rounded-full flex items-center justify-center mb-8">
                                <Award className="w-5 h-5 md:w-6 md:h-6 text-stone-dark" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight">
                                {t('certs.footer_title')}<span className="text-brand-gold">{t('certs.footer_title_accent')}</span>
                            </h2>
                            <p className="text-stone-300 text-sm md:text-lg font-light leading-relaxed mb-10">
                                {t('certs.footer_desc')}
                            </p>
                            <div className="flex flex-wrap gap-4 md:gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">{t('certs.footer_point1')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">{t('certs.footer_point2')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">{t('certs.footer_point3')}</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                LIGHTBOX — Hanya gambar sertifikat saja
                Tanpa card putih, tanpa judul/deskripsi
            ═══════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedCert && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                        {/* Backdrop gelap + blur — klik untuk tutup */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCert(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Tombol tutup — mengambang di pojok kanan atas */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setSelectedCert(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 active:scale-90 transition-all border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        {/* Gambar sertifikat — tampil besar tanpa bingkai */}
                        <motion.img
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            src={selectedCert.image}
                            alt={selectedCert.title}
                            onClick={() => setSelectedCert(null)}
                            className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl cursor-pointer select-none"
                        />
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Certificates;

