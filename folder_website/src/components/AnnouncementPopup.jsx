import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight, Bell } from 'lucide-react';
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';

/**
 * AnnouncementPopup — Pop-up Informasi Dinamis (Artisan Style)
 * Mengambil data dari /api/announcement dan menampilkan jika is_active true.
 */
import { useLanguage } from '../context/LanguageContext';

const AnnouncementPopup = () => {
    const { lang, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Ambil announcements dari data yang sudah di-preload (tidak perlu fetch lagi)
    const { announcements, isLoaded } = useGlobalData();
    const isLoading = !isLoaded; // Loading state berdasarkan preloader global

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('pakuaty_announcement_seen');
        if (hasSeenPopup) return;

        if (announcements) {
            // Find the first active announcement
            const activeAnnouncement = Array.isArray(announcements)
                ? announcements.find(a => a.is_active)
                : (announcements.is_active ? announcements : null);

            if (activeAnnouncement) {
                // Delay sedikit agar transisi halaman selesai
                const timer = setTimeout(() => setIsOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [announcements]);

    const data = Array.isArray(announcements)
        ? announcements.find(a => a.is_active)
        : (announcements?.is_active ? announcements : null);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('pakuaty_announcement_seen', 'true');
    };

    if (isLoading || !data || !isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-stone-dark/30 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-brand-gold/20"
                >
                    <div className="flex flex-col md:flex-row min-h-[400px]">
                        {/* Image Layer (Left Side on Desktop) */}
                        {data.image && (
                            <div className="w-full md:w-[45%] h-64 md:h-auto overflow-hidden relative">
                                <img
                                    src={data.image}
                                    alt={lang === 'en' ? (data.title_en || data.title) : data.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-dark/10 to-transparent mix-blend-multiply" />
                            </div>
                        )}

                        {/* Content Layer (Right Side on Desktop) */}
                        <div className={`w-full ${data.image ? 'md:w-[55%]' : ''} p-8 md:p-14 flex flex-col justify-center text-center md:text-left`}>
                            <span className="text-brand-gold font-bold tracking-[0.5em] uppercase text-[9px] mb-4 block">
                                {t('announcement.info')}
                            </span>

                            <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-dark mb-4 leading-tight italic">
                                {lang === 'en' ? (data.title_en || data.title) : data.title}
                            </h2>

                            <p className="text-[#87817D] text-sm md:text-base leading-relaxed mb-10 font-medium">
                                {lang === 'en' ? (data.message_en || data.message) : data.message}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-8 border-t border-stone-100 gap-6">
                                {/* Aesthetic Footer (Kiri Bawah) */}
                                <span className="text-[8px] font-bold text-stone-dark/20 uppercase tracking-widest text-center sm:text-left">
                                    {t('announcement.official')}
                                </span>

                                {/* Tombol Tutup (Kanan Bawah) */}
                                <button
                                    onClick={handleClose}
                                    className="w-full sm:w-auto px-10 py-4 bg-stone-dark text-white border border-stone-dark rounded-full font-black text-[9px] uppercase tracking-[0.4em] hover:bg-brand-gold hover:border-brand-gold hover:text-stone-dark transition-all duration-500"
                                >
                                    {t('announcement.close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AnnouncementPopup;
