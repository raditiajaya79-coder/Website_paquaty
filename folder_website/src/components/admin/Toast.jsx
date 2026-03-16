import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

/**
 * Toast — Notifikasi melayang (top-right) untuk feedback cepat ke user.
 */
const Toast = ({
    show,
    message,
    title,
    type = 'success',
    onClose,
    duration = 3000
}) => {
    // ... logic remains same
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
            bg: 'bg-[#10b981]', // More vibrant emerald from screenshot
            icon: <CheckCircle2 className="w-5 h-5 shadow-sm" />,
            shadow: 'shadow-[#10b981]/30'
        },
        error: {
            bg: 'bg-red-500',
            icon: <AlertCircle className="w-5 h-5 shadow-sm" />,
            shadow: 'shadow-red-500/30'
        },
        info: {
            bg: 'bg-blue-500',
            icon: <Info className="w-5 h-5 shadow-sm" />,
            shadow: 'shadow-blue-500/30'
        }
    };

    const style = styles[type] || styles.success;

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -100, x: '-50%', scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95, transition: { duration: 0.2 } }}
                    className="fixed top-8 left-1/2 z-[10000]"
                >
                    <div className={`${style.bg} ${style.shadow} text-white px-7 py-4 rounded-full flex items-center gap-5 shadow-2xl min-w-[340px] max-w-[90vw] border border-white/20 backdrop-blur-md relative overflow-hidden group`}>
                        {/* Subtle inner highlight */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
                        
                        <div className="p-2.5 bg-white/25 rounded-full shadow-inner border border-white/10 shrink-0 flex items-center justify-center">
                            {style.icon}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 leading-none mb-1">
                                {title || (type === 'success' ? 'Berhasil' : type === 'error' ? 'Gagal' : 'Info')}
                            </h4>
                            <p className="text-[13px] font-black text-white leading-tight tracking-tight">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-all active:scale-90 shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
