import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal — Komponen modal konfirmasi premium.
 * Menggantikan window.confirm browser yang standar agar terlihat lebih profesional.
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi Hapus",
    message = "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.",
    confirmText = "Ya, Hapus",
    cancelText = "Batalkan",
    type = "danger" // danger | warning | info
}) => {
    // Definisi warna berdasarkan tipe
    const colors = {
        danger: {
            bg: 'bg-red-50',
            icon: 'text-red-500',
            button: 'bg-red-600 hover:bg-red-700 shadow-red-900/20',
            border: 'border-red-100'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: 'text-amber-500',
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20',
            border: 'border-amber-100'
        },
        info: {
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            button: 'bg-[#1e40af] hover:bg-[#1d4ed8] shadow-blue-900/20',
            border: 'border-blue-100'
        }
    };

    const style = colors[type] || colors.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Status Icon Area */}
                        <div className={`p-8 ${style.bg} flex justify-center`}>
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                                    className="p-5 bg-white rounded-[1.5rem] shadow-xl text-red-500 flex items-center justify-center"
                                >
                                    <AlertTriangle className={`w-10 h-10 ${style.icon}`} />
                                </motion.div>
                                {/* Decorative elements */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-10 pt-8 text-center space-y-4">
                            <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">{title}</h3>
                            <p className="text-[#64748B] font-bold text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-10 pb-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs text-[#64748B] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" /> {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-8 py-4 ${style.button} text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95`}
                            >
                                {confirmText}
                            </button>
                        </div>

                        {/* Close shortcut */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
