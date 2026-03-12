import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

/**
 * Toast — Notifikasi melayang (top-right) untuk feedback cepat ke user.
 */
const Toast = ({
    show,
    message,
    type = 'success',
    onClose,
    duration = 3000
}) => {
    // Auto close setelah durasi tertentu
    useEffect(() => {
        if (show && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const styles = {
        success: {
            bg: 'bg-emerald-500',
            icon: <CheckCircle2 className="w-5 h-5" />,
            shadow: 'shadow-emerald-500/20'
        },
        error: {
            bg: 'bg-red-500',
            icon: <AlertCircle className="w-5 h-5" />,
            shadow: 'shadow-red-500/20'
        },
        info: {
            bg: 'bg-blue-500',
            icon: <Info className="w-5 h-5" />,
            shadow: 'shadow-blue-500/20'
        }
    };

    const style = styles[type] || styles.success;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed top-8 right-8 z-[10000]"
                >
                    <div className={`${style.bg} ${style.shadow} text-white px-6 py-4 rounded-3xl flex items-center gap-4 shadow-2xl min-w-[280px] border border-white/20 backdrop-blur-md`}>
                        <div className="p-2 bg-white/20 rounded-xl">
                            {style.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest">{type === 'success' ? 'Berhasil' : 'Peringatan'}</p>
                            <p className="text-sm font-bold opacity-90">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
