import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { generatePageTitle } from '../utils/seo';
import { 
    Globe, 
    Leaf, 
    Users, 
    ShieldCheck, 
    BarChart3, 
    FileText,
    Droplets,
    Flame,
    PackageCheck,
    ChefHat,
    Verified
} from 'lucide-react';

/**
 * Production Page — Menunjukkan komitmen Pakuaty terhadap kualitas artisan,
 * Serta dampak sosial dan lingkungan yang mendasarinya.
 */
const Production = () => {
    const { t, lang } = useLanguage();
    const isEn = lang === 'en';

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    const steps = [
        {
            icon: Leaf,
            title: isEn ? "Premium Sourcing" : "Pemilihan Bahan Utama",
            desc: isEn 
                ? "We source only non-GMO soybeans from local sustainable farmers in East Java." 
                : "Kami hanya memilih biji kedelai non-GMO pilihan dari petani lokal Jawa Timur yang berkelanjutan.",
            detail: ["Organic Certified", "Strict Selection", "No Pesticides"]
        },
        {
            icon: Droplets,
            title: isEn ? "Traditional 48h Ferment" : "Fermentasi 48 Jam",
            desc: isEn 
                ? "The heart of pakuaty. Natural slow fermentation creates the perfect aroma and texture." 
                : "Inti dari Pakuaty. Fermentasi alami yang lambat menciptakan aroma dan tekstur yang sempurna.",
            detail: ["Natural Ragi", "Slow Growth", "Full Protein"]
        },
        {
            icon: ChefHat,
            title: isEn ? "Artisan Seasoning" : "Bumbu Tradisional",
            desc: isEn 
                ? "Hand-blended heritage spices inspired by authentic Nusantara recipes." 
                : "Rempah-rempah warisan yang diracik tangan terinspirasi dari resep otentik Nusantara.",
            detail: ["No MSG Added", "Whole Spices", "Manual Blend"]
        },
        {
            icon: Flame,
            title: isEn ? "Precision Frying" : "Penggorengan Presisi",
            desc: isEn 
                ? "Fried at controlled temperatures to ensure a crunch that isn't greasy." 
                : "Digoreng pada suhu terkendali untuk memastikan kerenyahan yang tidak berminyak.",
            detail: ["Premium Oil", "Low Fat Retain", "Golden Color"]
        },
        {
            icon: PackageCheck,
            title: isEn ? "Gold-Standard Packing" : "Pengemasan Standar Emas",
            desc: isEn 
                ? "Vacuum-sealed in premium holographic packaging for maximum freshness." 
                : "Segel vakum dalam kemasan holografik premium untuk kesegaran maksimal.",
            detail: ["Aura Fresh Guard", "Holographic Seal", "Export Grade"]
        }
    ];

    const pillars = [
        {
            icon: Leaf,
            title: isEn ? "Environmental" : "Lingkungan",
            desc: isEn 
                ? "Zero-waste production commitment and local soybean sourcing to reduce carbon footprint." 
                : "Komitmen produksi bebas limbah dan pengadaan kedelai lokal untuk mengurangi jejak karbon.",
            points: [
                isEn ? "100% Non-GMO Soybeans" : "100% Kedelai Non-GMO",
                isEn ? "Water Recycling System" : "Sistem Daur Ulang Air",
                isEn ? "Biodegradable Strategy" : "Strategi Kompos Biodegradabel"
            ]
        },
        {
            icon: Users,
            title: isEn ? "Social Impact" : "Dampak Sosial",
            desc: isEn 
                ? "Empowering local farmers and women in the production chain across Indonesia." 
                : "Memberdayakan petani lokal dan perempuan dalam rantai produksi di seluruh Indonesia.",
            points: [
                isEn ? "Fair Trade Principles" : "Prinsip Perdagangan Adil",
                isEn ? "Women Craftsmanship" : "Peluang Kerja Perempuan",
                isEn ? "Education Support" : "Dukungan Pendidikan Petani"
            ]
        },
        {
            icon: ShieldCheck,
            title: isEn ? "Governance" : "Tata Kelola",
            desc: isEn 
                ? "Maintaining strict transparency in sourcing, production, and global exports." 
                : "Menjaga transparansi ketat dalam pengadaan, produksi, dan ekspor global.",
            points: [
                isEn ? "Clean Chain Tracking" : "Pelacakan Rantai Bersih",
                isEn ? "Integrity Compliance" : "Kepatuhan Integritas",
                isEn ? "ESG Transparency" : "Transparansi ESG"
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.production_title'))}</title>
                <meta name="description" content="Pakuaty's commitment to artisan quality, global sustainability, and environmental responsibility." />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative">
                    
                    {/* ═══════════════════════════════════════════
                        HEADER SECTION
                    ═══════════════════════════════════════════ */}
                    <motion.div {...fadeIn} className="max-w-4xl mb-24 md:mb-32">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">
                            {t('nav.production_root')}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-medium text-stone-dark tracking-tight mb-10 leading-tight">
                            {isEn ? "Sustaining Our " : "Menjaga "}<span className="text-emerald-600 italic">{isEn ? "Roots" : "Akar"}</span>, {isEn ? "Growing Our Future" : "Menumbuhkan Masa Depan"}
                        </h1>
                        <p className="text-lg md:text-2xl text-[#57534E] font-light leading-relaxed">
                            {isEn 
                                ? "From humble seed to global crunch, our commitment to quality is inseparable from our commitment to the planet."
                                : "Dari biji sederhana hingga kerenyahan global, komitmen kami terhadap kualitas tak terpisahkan dari komitmen kami terhadap bumi."}
                        </p>
                    </motion.div>

                    {/* ═══════════════════════════════════════════
                        1. ARTISAN PROCESS SECTION
                    ═══════════════════════════════════════════ */}
                    <motion.div {...fadeIn} className="mb-20">
                        <h2 className="text-2xl md:text-4xl font-medium text-stone-dark mb-16 md:mb-24 flex items-center gap-4">
                            <Verified className="w-8 h-8 text-brand-gold" />
                            {isEn ? "The Craftsmanship Process" : "Seni Proses Produksi"}
                        </h2>
                        
                        <div className="space-y-12 md:space-y-24 relative">
                            {/* Center Path Line (Desktop) */}
                            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-gold/0 via-brand-gold/40 to-brand-gold/0 hidden md:block"></div>

                            {steps.map((step, idx) => {
                                const isEven = idx % 2 === 0;
                                const Icon = step.icon;

                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                                        className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                    >
                                        <div className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-stone-200 mb-6 md:hidden">
                                                <Icon className="w-6 h-6 text-brand-gold" />
                                            </div>
                                            <h3 className="text-xl md:text-3xl font-medium text-stone-dark mb-4">{step.title}</h3>
                                            <p className="text-stone-500 font-light text-sm md:text-base mb-6 leading-relaxed">{step.desc}</p>
                                            <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                                {step.detail.map((d, i) => (
                                                    <span key={i} className="px-3 py-1 bg-brand-gold/5 border border-brand-gold/20 rounded-full text-[8px] font-black text-brand-gold-dark uppercase tracking-widest">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative z-10 hidden md:block">
                                            <div className="w-14 h-14 rounded-full bg-stone-dark flex items-center justify-center shadow-xl border-4 border-neutral-bone group hover:scale-110 transition-transform duration-500">
                                                <Icon className="w-5 h-5 text-brand-gold" />
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full bg-white/40 backdrop-blur-sm rounded-[2rem] border border-emerald-100/50 aspect-video md:aspect-auto md:h-56 flex items-center justify-center overflow-hidden group">
                                             <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                                 <Icon className="w-10 h-10 text-emerald-600" />
                                                 <span className="text-[8px] font-black uppercase tracking-[0.3em]">Precision Quality</span>
                                             </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Divider Line */}
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-100 to-transparent my-32"></div>

                    {/* ═══════════════════════════════════════════
                        2. SUSTAINABILITY PILLARS
                    ═══════════════════════════════════════════ */}
                    <motion.div {...fadeIn} className="mb-24">
                        <h2 className="text-2xl md:text-4xl font-medium text-stone-dark mb-16 flex items-center gap-4">
                            <Globe className="w-8 h-8 text-emerald-600" />
                            {isEn ? "ESG Commitment" : "Komitmen Dampak & ESG"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
                            {pillars.map((pillar, idx) => {
                                const Icon = pillar.icon;
                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="bg-stone-dark rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                            <Icon className="w-20 h-20 stroke-[1px]" />
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-medium mb-6 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{pillar.title}</h3>
                                            <p className="text-stone-400 font-light text-sm leading-relaxed mb-10 flex-1">
                                                {pillar.desc}
                                            </p>
                                            <ul className="space-y-4">
                                                {pillar.points.map((pt, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                                        {pt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Impact Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {[
                                { label: isEn ? "Local Farmers" : "Petani Lokal", val: "250+" },
                                { label: isEn ? "Renewable Aim" : "Target Terbarukan", val: "2030" },
                                { label: isEn ? "Women Employment" : "Karyawan Perempuan", val: "65%" },
                                { label: isEn ? "Eco-Material Use" : "Material Ramah Lingkungan", val: "80%" }
                            ].map((stat, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[1.5rem] border border-stone-border/30 shadow-sm text-center"
                                >
                                    <span className="text-stone-400 font-bold uppercase tracking-widest text-[8px] mb-3 block">{stat.label}</span>
                                    <span className="text-2xl md:text-3xl font-medium text-emerald-700 tracking-tight">{stat.val}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ═══════════════════════════════════════════
                        3. IMPACT REPORT CALL-TO-ACTION
                    ═══════════════════════════════════════════ */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white border border-stone-border/40 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -mr-48 -mt-48 blur-[120px] transition-all duration-1000 group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <BarChart3 className="w-10 h-10 text-emerald-600 mx-auto mb-8" />
                            <h2 className="text-3xl md:text-5xl font-medium text-stone-dark mb-8 leading-tight">
                                {isEn ? "Impact Framework " : "Kerangka Kerja Dampak "} 2026
                            </h2>
                            <p className="text-stone-500 font-light max-w-2xl mx-auto mb-12 text-base md:text-lg">
                                {isEn 
                                    ? "Download our full framework for transparent ESG disclosures and how we integrate quality with planet-first principles."
                                    : "Unduh kerangka kerja lengkap kami untuk pengungkapan ESG yang transparan dan bagaimana kami mengintegrasikan kualitas dengan prinsip keberlanjutan."}
                            </p>
                            <button className="flex items-center gap-4 bg-stone-dark text-white px-10 py-5 rounded-2xl mx-auto font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-stone-900/5 active:scale-95 group/btn">
                                <FileText className="w-4 h-4 text-emerald-400 group-hover/btn:rotate-12 transition-transform" />
                                {isEn ? "View Impact Framework" : "Lihat Kerangka Dampak"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Production;
