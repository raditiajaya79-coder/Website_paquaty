import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'; // Ikon status
import { useAdmin } from '../../context/AdminContext'; // Global state context

/**
 * AdminToast — Sistem notifikasi melayang (Floating Notification).
 * Compact design: lebih kecil, dengan accent bar di kiri berdasarkan tipe.
 * Menggunakan framer-motion untuk animasi slide & fade.
 */
const AdminToast = () => {
    const { toasts } = useAdmin(); // Ambil daftar toast dari context

    // Mapping warna berdasarkan tipe notifikasi
    const getStyles = (type) => {
        switch (type) {
            case 'error':
                return 'border-l-red-500 bg-white border-red-100 text-red-600 shadow-red-500/5'; // Merah untuk error
            case 'info':
                return 'border-l-blue-500 bg-white border-blue-100 text-blue-600 shadow-blue-500/5'; // Biru untuk info
            default:
                return 'border-l-emerald-500 bg-white border-emerald-100 text-emerald-600 shadow-emerald-500/5'; // Hijau untuk sukses
        }
    };

    return (
        // Container: fixed di kanan bawah, stack vertikal
        <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 16, scale: 0.95 }} // Animasi masuk: geser dari kanan
                        animate={{ opacity: 1, x: 0, scale: 1 }}     // State aktif: posisi normal
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }} // Animasi keluar: fade + shrink
                        className={`pointer-events-auto min-w-[260px] max-w-[320px] flex items-center gap-3 p-3 rounded-xl border border-l-4 shadow-lg backdrop-blur-xl ${getStyles(toast.type)}`}
                    >
                        {/* Ikon berdasarkan tipe */}
                        <div className="flex items-center gap-2.5">
                            {toast.type === 'error' ? <AlertCircle size={16} /> :
                                toast.type === 'info' ? <Info size={16} /> :
                                    <CheckCircle size={16} />}
                            {/* Pesan notifikasi */}
                            <span className="text-xs font-semibold tracking-tight leading-snug">{toast.message}</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AdminToast;
