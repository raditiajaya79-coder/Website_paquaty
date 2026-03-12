import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Award, CheckCircle2, X, Download, FileCheck, Landmark, FileBadge, Check } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
/**
 * Certificates — Halaman Sertifikasi & Kualitas
 * Data saat ini dikosongkan karena beralih ke mode statis tanpa dashboard admin.
 */
const Certificates = () => {
    const { t } = useLanguage();
    const [selectedCert, setSelectedCert] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/certificates');
            if (response.ok) {
                const data = await response.json();
                // Filter is_active on the client side just in case, 
                // but the API should handle it too.
                setCertificates(data);
            }
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        } finally {
            setLoading(false);
        }
    };

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
    // Span grid default berdasarkan index
    const spanMap = ["md:col-span-6", "md:col-span-6", "md:col-span-4", "md:col-span-4", "md:col-span-4"];

    // Animasi komponen
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
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
    if (certificates.length === 0) {
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

                    {/* Certifications Grid — hanya sertifikat aktif yang ditampilkan */}
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8">
                        {certificates.filter(c => c.is_active).map((cert, idx) => {
                            // Assign ikon, warna, dan span berdasarkan index (looping jika lebih dari 5)
                            const IconComponent = iconMap[idx % iconMap.length];
                            const colors = colorMap[idx % colorMap.length];
                            const span = spanMap[idx % spanMap.length];

                            return (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                    onClick={() => {
                                        if (window.innerWidth < 768) setSelectedCert({ ...cert, icon: IconComponent, ...colors });
                                    }}
                                    className={`group bg-white rounded-[1.5rem] md:rounded-[3rem] border border-stone-border/30 overflow-hidden hover:shadow-2xl transition-all duration-700 transform-gpu cursor-pointer md:cursor-default ${span}`}
                                >
                                    <div className="p-3 md:p-6 h-full flex flex-col">
                                        <div className="bg-white rounded-[1.2rem] md:rounded-[2.2rem] p-5 md:p-10 flex-grow transition-all duration-700 hover:bg-white/50 flex flex-col items-center md:items-start text-center md:text-left">
                                            {/* Ikon sertifikat */}
                                            <div className={`w-10 h-10 md:w-14 md:h-16 ${colors.bg} rounded-xl md:rounded-2xl border border-stone-border/30 flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                                <IconComponent className={`w-5 h-5 md:w-7 md:h-7 ${colors.color}`} />
                                            </div>

                                            {/* Judul sertifikat */}
                                            <h3 className="text-sm md:text-2xl font-bold text-stone-dark mb-1 md:mb-2 group-hover:text-brand-blue transition-colors line-clamp-1 md:line-clamp-none">
                                                {cert.title}
                                            </h3>
                                            {/* Sub-judul */}
                                            <p className="text-[7px] md:text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em] mb-4">
                                                {cert.sub || cert.issued_by}
                                            </p>

                                            {/* Deskripsi — hanya desktop */}
                                            <p className="hidden md:block text-sm text-[#78716C] font-light leading-relaxed mb-8">
                                                {cert.description}
                                            </p>

                                            {/* Tombol verifikasi — hanya desktop */}
                                            <div className="mt-auto w-full hidden md:block">
                                                <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-dark/40 group-hover:text-brand-blue transition-colors">
                                                    {t('certs.card_verification')}
                                                    <Download className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Mobile Tap Indicator */}
                                            <div className="md:hidden mt-1">
                                                <span className="text-[7px] font-bold text-brand-blue/50 uppercase tracking-widest">{t('certs.tap_indicator')}</span>
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
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile/Detail Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCert(null)}
                            className="absolute inset-0 bg-stone-dark/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 text-stone-dark active:scale-90 transition-transform"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-5 mb-8">
                                <div className={`w-14 h-16 ${selectedCert.bg} rounded-2xl border border-stone-border/30 flex items-center justify-center shrink-0`}>
                                    {selectedCert.icon && <selectedCert.icon className={`w-7 h-7 ${selectedCert.color}`} />}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-stone-dark leading-tight">
                                        {selectedCert.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em] mt-1">
                                        {selectedCert.sub || selectedCert.issuedBy}
                                    </p>
                                </div>
                            </div>
                            <p className="text-base text-[#78716C] font-light leading-relaxed mb-8">
                                {selectedCert.description}
                            </p>

                            <button className="w-full py-4 bg-brand-blue text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-stone-dark transition-all active:scale-95">
                                {t('certs.modal_verify')}
                                <Download className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Certificates;
