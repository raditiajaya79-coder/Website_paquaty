// About.jsx — Halaman Tentang Kami
// Menampilkan: header, filosofi nama, pesan founder, core values, dan closing
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Globe, ShieldCheck, Award, Quote, Sprout, Lightbulb, Heart, Users } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { COMPANY_INFO, FOUNDER } from '../data/products';

/**
 * About — Halaman "Tentang Kami"
 * Berisi: header, filosofi nama perusahaan, pesan dari founder, core values, closing
 */
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';
const About = () => {
    const { t } = useLanguage();
    // Ambil settings dari data yang sudah di-preload (tidak perlu fetch lagi)
    const { settings } = useGlobalData();

    // Konfigurasi animasi fade-in
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            {/* SEO metadata */}
            <Helmet>
                <title>{generatePageTitle(t('seo.about_title'))}</title>
                <meta name="description" content={t('seo.about_desc')} />
            </Helmet>

            <div className="bg-brand-cream min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">

                    {/* ========================== */}
                    {/* HEADER — Judul halaman */}
                    {/* ========================== */}
                    <motion.header {...fadeIn} className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                        {/* Label kategori halaman */}
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">{t('about.header_label')}</span>
                        {/* Headline utama */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            {t('about.header_title_part1')} <br />
                            <span className="text-brand-blue">{t('about.header_title_part2')}</span>
                        </h1>
                        {/* Deskripsi singkat perusahaan */}
                        <p className="text-xl text-[#57534E] font-light leading-relaxed mb-6">
                            {t('about.header_desc')}
                        </p>
                        {/* Tagline */}
                        <p className="text-lg text-brand-blue/60 font-medium italic">
                            {t('about.header_tagline')}
                        </p>
                    </motion.header>

                    {/* ============================================= */}
                    {/* FILOSOFI NAMA — Arti di balik "Bala Aditi Pakuaty" */}
                    {/* ============================================= */}
                    <motion.section {...fadeIn} className="mb-20 md:mb-32">
                        {/* Card dark background untuk kontras visual */}
                        <div className="bg-stone-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                            {/* Decorative Gradients — Migrated from blur to High-Performance Ultra-Light pattern */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(38,84,161,0.15)_0%,transparent_70%)] transform translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(218,165,32,0.1)_0%,transparent_70%)] transform -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Label section */}
                                <span className="text-brand-gold font-medium tracking-[0.4em] uppercase text-xs mb-8 block">{t('about.philosophy_label')}</span>
                                {/* Judul section */}
                                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
                                    PT. <span className="text-brand-gold">{t('about.philosophy_title')}</span>
                                </h2>
                                {/* Penjelasan umum filosofi */}
                                <p className="text-neutral-400 leading-relaxed mb-12 max-w-3xl">
                                    {t('about.philosophy_desc')}
                                </p>

                                {/* Grid 3 kolom: penjelasan tiap kata */}
                                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                    {/* BALA — arti pertama */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">{t('about.bala_title')}</h3>
                                        </div>
                                        {/* Arti dalam bahasa Sansekerta */}
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">{t('about.bala_sub')}</p>
                                        {/* Penjelasan makna */}
                                        <p className="text-neutral-400 leading-relaxed">
                                            {t('about.bala_desc')}
                                        </p>
                                    </div>

                                    {/* ADITI — arti kedua */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">{t('about.aditi_title')}</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">{t('about.aditi_sub')}</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            {t('about.aditi_desc')}
                                        </p>
                                    </div>

                                    {/* PAKUATY — arti ketiga */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Heart className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">{t('about.pakuaty_title')}</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">{t('about.pakuaty_sub')}</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            {t('about.pakuaty_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* ============================================ */}
                    {/* PESAN DARI FOUNDER — Photo-only buffer for color clash fix */}
                    {/* ============================================ */}
                    <div className="mb-32">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Kolom kiri: Foto founder with white buffer background */}
                            <motion.div
                                {...fadeIn}
                                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-2 group"
                            >
                                <div className="relative w-full h-full rounded-[2.1rem] overflow-hidden bg-stone-100">
                                    {/* Gambar founder dari pengaturan atau data FOUNDER */}
                                    <img src={settings.founder_image || FOUNDER.image} alt={FOUNDER.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000 ease-[0.22,1,0.36,1]" />
                                    {/* Overlay gradient + nama founder di bawah gambar */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-stone-dark to-transparent">
                                        <h3 className="text-2xl font-semibold text-white">{FOUNDER.name}</h3>
                                        <p className="text-brand-gold text-sm font-medium tracking-widest">{FOUNDER.title}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Kolom kanan: Pesan dari founder */}
                            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="relative">
                                {/* Icon quote decorative */}
                                <Quote className="w-12 h-12 text-brand-blue/20 mb-6" />
                                {/* Label section */}
                                <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{t('about.founder_label')}</span>
                                {/* Paragraf pesan utama dari founder — konten dari user */}
                                <div className="space-y-4 text-[#57534E] text-base leading-relaxed font-light">
                                    <p>{t('about.founder_p1')}</p>
                                    <p>{t('about.founder_p2')}</p>
                                    <p>{t('about.founder_p3')}</p>
                                    <p>{t('about.founder_p4')}</p>
                                </div>
                                {/* Tanda tangan founder */}
                                <div className="mt-8 pt-8 border-t border-brand-blue/10">
                                    <p className="text-stone-dark font-semibold text-lg">{FOUNDER.name}</p>
                                    <p className="text-sm text-stone-dark/60">{FOUNDER.title}, PT. Bala Aditi Pakuaty</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ======================== */}
                    {/* CORE VALUES — Nilai Inti */}
                    {/* ======================== */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-4 block">{t('about.values_label')}</span>
                        <h2 className="text-4xl md:text-5xl font-medium text-stone-dark tracking-tight">{t('about.values_title')}</h2>
                    </motion.div>

                    {/* Grid/Flex container for core values */}
                    <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 md:gap-8 mb-32 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                        {[
                            {
                                icon: Lightbulb,
                                title: t('about.value1_title'),
                                desc: t('about.value1_desc')
                            },
                            {
                                icon: Globe,
                                title: t('about.value2_title'),
                                desc: t('about.value2_desc')
                            },
                            {
                                icon: Sprout,
                                title: t('about.value3_title'),
                                desc: t('about.value3_desc')
                            }
                        ].map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeIn}
                                transition={{ ...fadeIn.transition, delay: idx * 0.1 }}
                                className="min-w-[85vw] md:min-w-0 bg-white p-8 md:p-10 rounded-[2.5rem] border border-brand-gold/20 hover:border-brand-cyan hover:shadow-brand-cyan/10 transition-all duration-700 shadow-sm snap-center"
                            >
                                <pillar.icon className="w-10 h-10 text-brand-blue mb-6 group-hover:text-brand-cyan transition-colors" />
                                <h4 className="text-xl font-bold text-stone-dark mb-4">{pillar.title}</h4>
                                <p className="text-stone-dark/70 font-light leading-relaxed text-sm md:text-base">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* ================================ */}
                    {/* CLOSING — Pesan penutup manifesto */}
                    {/* ================================ */}
                    <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
                        <div className="bg-brand-blue border border-brand-blue/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl">
                            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6">
                                {t('about.closing_title')} <span className="text-brand-gold">{t('about.closing_title_accent')}</span>.<br />
                                {t('about.closing_title2')} <span className="text-brand-gold">{t('about.closing_title2_accent')}</span>.
                            </h2>
                            <p className="text-lg text-stone-200 font-light leading-relaxed">
                                {t('about.closing_desc')}
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default About;
