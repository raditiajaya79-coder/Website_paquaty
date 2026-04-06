/**
 * Preloader.jsx — Premium Warm Loading Screen untuk SPA
 * 
 * FUNGSI:
 * Tampil saat pertama kali buka website, sambil GlobalDataContext fetch semua data API.
 * Setelah semua data dimuat (isLoaded === true), preloader hilang dengan animasi smooth.
 * 
 * DESAIN v2 — Warm & Soft:
 * - Background cerah cream (brand-cream) yang hangat dan inviting
 * - Logo Pakuaty di tengah dengan gentle floating animation
 * - 3 titik bouncing yang organik dan playful
 * - Progress bar tipis dengan warna gold hangat
 * - Kesan: "artisan", "natural", "friendly" — bukan robotik
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalData } from '../context/GlobalDataContext';

const Preloader = () => {
    // Ambil status loading dari GlobalDataContext
    const { isLoaded, loadingProgress } = useGlobalData();

    return (
        <AnimatePresence>
            {/* Hanya tampil jika data belum selesai dimuat */}
            {!isLoaded && (
                <motion.div
                    // Animasi exit: fade out lembut ke atas
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                    style={{ backgroundColor: '#F5F0E8' }} // brand-cream — warna hangat, cerah, inviting
                >
                    {/* ═══ AMBIENT BACKGROUND — Glow lembut dekoratif ═══ */}

                    {/* Glow gold hangat di tengah atas — memberikan kehangatan */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],        // Breathing: membesar-mengecil perlahan
                            opacity: [0.3, 0.5, 0.3],   // Fade in-out halus
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-[-10%] w-[50rem] h-[50rem] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(218,165,32,0.12) 0%, rgba(218,165,32,0.04) 40%, transparent 70%)',
                        }}
                    />

                    {/* Glow biru lembut di kiri bawah — aksen subtle brand-blue */}
                    <div
                        className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(38,84,161,0.06) 0%, transparent 70%)',
                        }}
                    />

                    {/* Glow peach/warm di kanan bawah — sentuhan hangat tambahan */}
                    <div
                        className="absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 60%)',
                        }}
                    />

                    {/* ═══ MAIN CONTENT — Logo + Dots + Progress ═══ */}
                    <div className="relative z-10 flex flex-col items-center">

                        {/* ── Logo Pakuaty — Floating gentle animation ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mb-8"
                        >
                            <motion.img
                                src="/images/pure logo pakuaty.png"
                                alt="Pakuaty"
                                fetchPriority="high"
                                // Efek melayang halus — seperti daun di sungai, bukan mesin
                                animate={{
                                    y: [0, -6, 0],           // Naik-turun lembut 6px
                                }}
                                transition={{
                                    duration: 3,              // 3 detik per cycle = smooth & slow
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-sm"
                            />
                        </motion.div>

                        {/* ── Bouncing Dots — 3 titik yang melompat bergantian ── */}
                        {/* Animasi organik: setiap titik melompat dengan delay berbeda */}
                        <div className="flex items-center gap-2 mb-10">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -10, 0],          // Lompat naik 10px lalu kembali
                                        scale: [1, 1.2, 1],      // Sedikit membesar saat lompat
                                    }}
                                    transition={{
                                        duration: 0.8,            // 0.8 detik per bounce
                                        repeat: Infinity,
                                        delay: i * 0.15,          // Delay bertahap: 0, 0.15, 0.3 detik
                                        ease: [0.45, 0, 0.55, 1], // Custom easing — bouncy tapi smooth
                                    }}
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        // Warna: gold pertama, blue tengah, gold akhir
                                        backgroundColor: i === 1 ? '#2654A1' : '#DAA520',
                                    }}
                                />
                            ))}
                        </div>

                        {/* ── Progress Section ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-40 md:w-48 flex flex-col items-center gap-3"
                        >
                            {/* Progress Bar Track — Background lembut */}
                            <div
                                className="w-full h-[3px] rounded-full overflow-hidden"
                                style={{ backgroundColor: 'rgba(28,25,23,0.08)' }} // stone-dark sangat tipis
                            >
                                {/* Progress Bar Fill — Gold hangat, smooth transition */}
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        // Gradient hangat: gold solid → gold+hint blue
                                        background: 'linear-gradient(90deg, #DAA520, #C49B1A, #DAA520)',
                                    }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${loadingProgress}%` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Teks Status — Warm dan friendly */}
                            <p
                                className="text-[10px] font-bold tracking-[0.3em] uppercase"
                                style={{ color: 'rgba(28,25,23,0.25)' }} // stone-dark transparan
                            >
                                {loadingProgress < 100
                                    ? 'Preparing...'  // Bahasa yang lebih friendly dari "Loading"
                                    : '✓ Ready'
                                }
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
