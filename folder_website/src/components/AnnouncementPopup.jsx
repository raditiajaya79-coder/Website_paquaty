import React, { useState, useEffect } from 'react'; // React hooks
import { motion, AnimatePresence } from 'framer-motion'; // Animasi
import { X, ExternalLink, ArrowRight, Bell } from 'lucide-react'; // Ikon
import { api } from '../utils/api'; // Utilitas API

/**
 * AnnouncementPopup — Komponen Modal Pengumuman Global (Artisan Redesign).
 * Centered, Minimalist, Heritage style.
 */
const AnnouncementPopup = () => {
    const [isOpen, setIsOpen] = useState(false); // Status modal terbuka
    const [data, setData] = useState(null); // Data pengumuman dari API
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                // Ambil data terbaru dari backend
                const result = await api.get('/announcements');

                // Defensive check: Jika backend mengembalikan array, ambil index pertama
                const announcementData = Array.isArray(result) ? result[0] : result;

                // Cek apakah popup sudah pernah ditampilkan di sesi ini
                const hasBeenShown = sessionStorage.getItem('announcementShown');

                // Tampilkan jika aktif DAN belum pernah muncul di sesi ini
                if (announcementData && announcementData.is_active && !hasBeenShown) {
                    setData(announcementData);
                    setTimeout(() => {
                        setIsOpen(true);
                        // Tandai bahwa popup sudah muncul di sesi ini
                        sessionStorage.setItem('announcementShown', 'true');
                    }, 300); // Tampil cepat agar terasa responsif
                }
            } catch (err) {
                console.error("Gagal memuat pengumuman popup:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, []);

    // Tutup popup
    const closePopup = () => setIsOpen(false);

    if (loading || !data) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-hidden">
                    {/* Artistic Backdrop - Subtle Blur & Tint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 bg-[#0A0A0A]/30 backdrop-blur-[12px]"
                    />

                    {/* Centered Artisan Heritage Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 20 }}
                        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                        className="relative w-full max-w-[500px] bg-white rounded-[1.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border-[0.5px] border-brand-gold/20 overflow-hidden flex flex-col items-center text-center p-0"
                    >
                        {/* Elegant Close Text Button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-6 right-8 z-30 text-[9px] font-black uppercase tracking-[0.3em] text-stone-dark/40 hover:text-brand-gold transition-colors"
                        >
                            [ Tutup ]
                        </button>

                        {/* Top Branding Section */}
                        <div className="pt-12 pb-6 px-10 flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-gold mb-4">
                                Artisan Selection
                            </span>
                            <div className="h-0.5 w-12 bg-brand-gold/30 mb-8" />
                        </div>

                        {/* Visual Asset Section */}
                        {data.image ? (
                            <div className="w-full h-64 overflow-hidden px-8">
                                <img
                                    src={data.image}
                                    alt={data.title}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-brand-blue/5 rounded-[2rem] flex items-center justify-center text-brand-blue/20 mb-4">
                                <Bell size={48} />
                            </div>
                        )}

                        {/* Content Section - Heritage Typography */}
                        <div className="p-10 md:p-12 flex flex-col items-center">
                            <h2
                                className="text-3xl md:text-4xl font-normal text-stone-dark mb-6 leading-tight italic"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {data.title}
                            </h2>

                            <p className="text-[#87817D] text-sm md:text-base leading-relaxed mb-10 max-w-xs font-medium">
                                {data.message}
                            </p>

                            {/* Refined Action Area */}
                            {data.button_text && (
                                <a
                                    href={data.link || '#'}
                                    onClick={data.link ? null : (e) => e.preventDefault()}
                                    className="px-10 py-4 border border-stone-dark/10 hover:border-brand-gold hover:bg-brand-gold hover:text-stone-dark transition-all duration-500 rounded-full font-black text-[9px] uppercase tracking-[0.4em] text-stone-dark group flex items-center gap-3"
                                >
                                    {data.button_text}
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Aesthetic Footer Detail */}
                        <div className="w-full py-6 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-4">
                            <span className="text-[8px] font-bold text-stone-dark/30 uppercase tracking-widest">Est. 2026</span>
                            <span className="w-1 h-1 bg-stone-dark/10 rounded-full" />
                            <span className="text-[8px] font-bold text-stone-dark/30 uppercase tracking-widest italic">Authentic Culture</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AnnouncementPopup;
