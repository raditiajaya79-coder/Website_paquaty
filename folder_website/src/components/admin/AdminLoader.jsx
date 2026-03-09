import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi
import { useAdmin } from '../../context/AdminContext'; // Global state context

/**
 * AdminLoader — Overlay loading global dengan spinner compact.
 * Muncul saat globalLoading di context bernilai true.
 * Menggunakan backdrop blur agar konten di belakang tetap visible namun terhalang.
 */
const AdminLoader = () => {
    const { globalLoading } = useAdmin(); // Ambil status loading dari context

    return (
        <AnimatePresence>
            {globalLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/40 backdrop-blur-md"
                >
                    {/* Premium Artisan Spinner Container */}
                    <div className="relative flex flex-col items-center">
                        <div className="relative h-20 w-20">
                            {/* Outer Decorative Ring - Slow rotation */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-[0.5px] border-brand-gold/20"
                            />

                            {/* Middle Ring - Reverse rotation */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-[0.5px] border-brand-blue/10"
                            />

                            {/* Main Active Spinner Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                className="absolute inset-0 rounded-full border-t-2 border-brand-blue shadow-[0_0_15px_rgba(30,64,175,0.1)]"
                            />

                            {/* Center Core Gold Glow */}
                            <div className="absolute inset-7 bg-brand-gold rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-pulse" />
                        </div>

                        {/* Premium Typography Label */}
                        <div className="mt-8 flex flex-col items-center">
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue/60"
                            >
                                Memuat Data
                            </motion.p>
                            <div className="mt-2 flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                        className="w-1 h-1 bg-brand-gold rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdminLoader;
