import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight, Bell } from 'lucide-react';

/**
 * AnnouncementPopup — Pop-up Informasi Dinamis (Artisan Style)
 * Mengambil data dari /api/announcement dan menampilkan jika is_active true.
 */
const AnnouncementPopup = () => {
    const [data, setData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('pakuaty_announcement_seen');
        if (hasSeenPopup) {
            setLoading(false);
            return;
        }

        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/announcements');
            if (response.ok) {
                const dataArray = await response.json();
                // Find the first active announcement
                const activeAnnouncement = Array.isArray(dataArray)
                    ? dataArray.find(a => a.is_active)
                    : (dataArray.is_active ? dataArray : null);

                if (activeAnnouncement) {
                    setData(activeAnnouncement);
                    // Delay sedikit agar transisi halaman selesai
                    setTimeout(() => setIsOpen(true), 1500);
                }
            }
        } catch (error) {
            console.error('Failed to fetch announcement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('pakuaty_announcement_seen', 'true');
    };

    if (loading || !data || !isOpen) return null;

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
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-brand-gold/20"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-8 z-30 text-[9px] font-black uppercase tracking-[0.3em] text-stone-dark/40 hover:text-brand-gold transition-colors"
                    >
                        [ Tutup ]
                    </button>

                    <div className="flex flex-col">
                        {/* Image Header */}
                        {data.image && (
                            <div className="w-full h-56 overflow-hidden">
                                <img
                                    src={data.image}
                                    alt={data.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-10 md:p-14 text-center">
                            <span className="text-brand-gold font-bold tracking-[0.5em] uppercase text-[9px] mb-4 block">
                                Information
                            </span>

                            <h2 className="text-3xl font-serif font-medium text-stone-dark mb-6 leading-tight italic">
                                {data.title}
                            </h2>

                            <p className="text-[#87817D] text-sm leading-relaxed mb-10 font-medium">
                                {data.message}
                            </p>

                            <div className="flex justify-center">
                                {data.link ? (
                                    <a
                                        href={data.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-10 py-4 border border-stone-dark/10 hover:border-brand-gold hover:bg-brand-gold hover:text-stone-dark transition-all duration-500 rounded-full font-black text-[9px] uppercase tracking-[0.4em] text-stone-dark flex items-center gap-3 group"
                                    >
                                        {data.button_text || 'Lihat Detail'}
                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleClose}
                                        className="px-10 py-4 bg-stone-dark text-white rounded-full font-black text-[9px] uppercase tracking-[0.4em] hover:bg-brand-blue transition-all"
                                    >
                                        {data.button_text || 'Tutup'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Aesthetic Footer */}
                        <div className="w-full py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-4">
                            <span className="text-[8px] font-bold text-stone-dark/20 uppercase tracking-widest">Official Announcement</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AnnouncementPopup;
