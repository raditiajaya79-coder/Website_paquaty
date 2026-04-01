import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    Sprout, Microscope, Package, Store,
    Leaf, Flame, Truck, ShieldCheck, Award,
    Beaker, Factory, Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * ICON_MAP — Mapping string nama ikon ke komponen Lucide.
 * Dipakai untuk memetakan field `icon` dari database ke komponen React.
 */
const ICON_MAP = {
    Sprout, Microscope, Package, Store,
    Leaf, Flame, Truck, ShieldCheck, Award,
    Beaker, Factory, Globe
};

/**
 * JOURNEY_STEPS — Data statis paten (tidak dari API/dashboard).
 * 6 langkah proses heritage produksi keripik tempe Pakuaty.
 */
const JOURNEY_STEPS = [
    { id: 1, step_number: 1, title: 'Kedelai Premium', title_en: 'Premium Soybeans', description: 'Kedelai non-GMO lokal untuk kualitas terbaik.', description_en: 'Locally sourced non-GMO soybeans for the freshest quality.', icon: 'Sprout' },
    { id: 2, step_number: 2, title: 'Fermentasi Alami', title_en: 'Natural Fermentation', description: 'Proses fermentasi tradisional 48 jam.', description_en: 'Traditional 48-hour slow fermentation process.', icon: 'Microscope' },
    { id: 3, step_number: 3, title: 'Bumbu Khas', title_en: 'Bold Seasoning', description: 'Diramu dengan campuran rempah warisan.', description_en: 'Hand-seasoned with signature heritage spice blends.', icon: 'Package' },
    { id: 4, step_number: 4, title: 'Penggorengan Renyah', title_en: 'Crispy Frying', description: 'Digoreng dengan suhu optimal hingga renyah sempurna.', description_en: 'Fried at optimal temperature for perfect crispiness.', icon: 'Flame' },
    { id: 5, step_number: 5, title: 'Kontrol Kualitas', title_en: 'Quality Control', description: 'Setiap batch diperiksa ketat sebelum dikemas.', description_en: 'Every batch is strictly inspected before packaging.', icon: 'ShieldCheck' },
    { id: 6, step_number: 6, title: 'Siap Ekspor', title_en: 'Export Ready', description: 'Dikemas vakum untuk kualitas ekspor internasional.', description_en: 'Vacuum-sealed to ensure international export quality.', icon: 'Store' }
];

/**
 * JourneySection — Menampilkan 6 langkah proses heritage produksi.
 * Data statis (paten), tidak diambil dari API/dashboard.
 */
const JourneySection = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';
    const containerRef = useRef(null);

    // Scroll progress untuk animasi garis penghubung
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Spring animasi garis kuning
    const pathLength = useSpring(
        useTransform(scrollYProgress, [0.05, 0.45], [0, 1]),
        { stiffness: 100, damping: 30, restDelta: 0.001 }
    );

    // Animasi fade-in per item
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    /**
     * gridColsClass — Menentukan jumlah kolom grid secara dinamis
     * sesuai jumlah step. Memastikan layout proporsional 2-6 kolom.
     */
    // Jumlah kolom grid tetap 6 (data statis paten)
    const colCount = JOURNEY_STEPS.length;
    const gridColsClass = 'md:grid-cols-3 lg:grid-cols-6';

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-[#1A1A1A] text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* ── Header ── */}
                <div className="text-center mb-16">
                    <motion.div {...fadeIn} className="inline-block mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-[0.2em] uppercase border border-brand-blue/20">
                            {t('journey.badge')}
                        </span>
                    </motion.div>

                    <motion.h2
                        {...fadeIn}
                        transition={{ ...fadeIn.transition, delay: 0.1 }}
                        className="text-[clamp(2.25rem,5vw,3rem)] font-black tracking-tighter"
                    >
                        {t('journey.title_part1')} <span className="text-brand-gold italic">{t('journey.title_part2')}</span>
                    </motion.h2>
                </div>

                {/* ── Steps Grid ── */}
                <div className="relative">
                    <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory relative pt-6 pb-8 md:pb-0">
                        {/* Wrapper Utama: Lebar mobile flex menyesuaikan konten (w-max), grid menyesuaikan layar (w-full) */}
                        <div className={`relative w-max md:w-full md:grid ${gridColsClass} md:gap-4 lg:gap-2`}>

                            {/* ── Garis Penghubung Animasi ── */}
                            <div className="absolute top-[48px] left-[12.5%] right-[12.5%] h-px z-0 pointer-events-none">
                                <svg width="100%" height="2" viewBox="0 0 800 2" fill="none" preserveAspectRatio="none" className="w-full">
                                    {/* Garis putus-putus latar */}
                                    <line x1="0" y1="1" x2="800" y2="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="8 8" />
                                    {/* Garis kuning animasi scroll */}
                                    <motion.line
                                        x1="0" y1="1" x2="800" y2="1"
                                        stroke="#E5B326"
                                        strokeWidth="2"
                                        style={{ pathLength }}
                                    />
                                </svg>
                            </div>

                            {/* ── Render Setiap Step ── */}
                            {/* Inner Wrapper: Flex Horizontal di mobile, Menghilang di Desktop (md:contents) sehingga ikut grid parent */}
                            <div className="flex md:contents gap-6 md:gap-0 px-6 md:px-0">
                                {JOURNEY_STEPS.map((step, idx) => {
                                    // Resolve ikon dari string ke komponen React
                                    const IconComponent = ICON_MAP[step.icon] || Sprout;
                                    // Nomor tampilan (02, 03, dst)
                                    const displayNumber = String(step.step_number).padStart(2, '0');
                                    // Teks yang ditampilkan sesuai bahasa aktif
                                    const title = (isEn && step.title_en) ? step.title_en : step.title;
                                    const desc = (isEn && step.description_en) ? step.description_en : step.description;

                                    return (
                                        <motion.div
                                            key={step.id}
                                            {...fadeIn}
                                            transition={{ ...fadeIn.transition, delay: 0.2 + (idx * 0.1) }}
                                            className="flex flex-col items-center text-center group w-[240px] md:w-auto shrink-0 snap-center relative z-10"
                                        >
                                            {/* Icon Card */}
                                            <div className="relative mb-5 px-4">
                                                {/* Badge nomor langkah */}
                                                <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 bg-brand-gold text-stone-dark rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black z-20 border-[2px] border-[#1A1A1A] shadow-lg group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                                                    {displayNumber}
                                                </div>

                                                {/* Kotak ikon */}
                                                <div className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 border border-white/5 bg-white/5 backdrop-blur-sm group-hover:bg-brand-gold/10 group-hover:scale-105 group-hover:border-brand-gold/30 group-hover:shadow-brand-gold/20 relative z-10">
                                                    <IconComponent className="w-9 h-9 text-brand-gold group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                                                </div>
                                            </div>

                                            {/* Info teks */}
                                            <div className="px-6 flex flex-col items-center flex-1">
                                                <h3 className="text-base md:text-lg font-black mb-1.5 tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                                                    {title}
                                                </h3>
                                                <p className="text-[12px] md:text-[13px] text-zinc-400 leading-relaxed max-w-[190px] font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                                    {desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
