import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, ShieldCheck, Check, Download, FileBadge, FileCheck, Landmark, Globe } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

const Certificates = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    const certifications = [
        {
            title: "HACCP Certified",
            sub: "Food Safety Management",
            desc: "Hazard Analysis and Critical Control Points (HACCP) is an internationally recognized system for reducing food safety hazards.",
            icon: ShieldCheck,
            color: "text-brand-blue",
            bg: "bg-brand-blue/5",
            span: "md:col-span-6"
        },
        {
            title: "Halal Indonesia",
            sub: "BPJPH Certified",
            desc: "Ensuring all products comply with Islamic dietary laws as regulated by the Indonesian government.",
            icon: Check,
            color: "text-brand-gold-dark",
            bg: "bg-brand-gold/5",
            span: "md:col-span-6"
        },
        {
            title: "SNI Standard",
            sub: "National Standard",
            desc: "The only standard that has national validity in Indonesia, ensuring product quality and safety.",
            icon: FileBadge,
            color: "text-brand-gold-dark",
            bg: "bg-brand-gold/5",
            span: "md:col-span-4"
        },
        {
            title: "BPOM RI",
            sub: "Health & Food Safety",
            desc: "Official registration ensuring that our products meet national health and safety requirements.",
            icon: FileCheck,
            color: "text-brand-blue",
            bg: "bg-brand-blue/5",
            span: "md:col-span-4"
        },
        {
            title: "ISO 22000",
            sub: "Safety Systems",
            desc: "International standard for food safety management across the entire supply chain.",
            icon: Landmark,
            color: "text-brand-gold-dark",
            bg: "bg-brand-gold/5",
            span: "md:col-span-4"
        }
    ];

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Certifications & Compliance')}</title>
                <meta name="description" content={`Pakuaty's commitment to global excellence. Explore our international food safety certifications (HACCP, ISO 22000, FDA, Halal) ensuring world-class quality in every chip.`} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                {/* Decorative Background — Migrated to High-Performance Gradient */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(218,165,32,0.08)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-28">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">Trust & Compliance</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            Global Standard <span className="text-brand-blue italic">Excellence</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-3xl mx-auto">
                            We maintain rigorous international food safety protocols and quality management systems to bring Indonesian heritage to the world stage.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {certifications.map((cert, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                className={`group bg-white rounded-[3rem] border border-stone-border/30 overflow-hidden hover:shadow-2xl transition-all duration-700 transform-gpu ${cert.span}`}
                            >
                                {/* Gallery Frame Effect */}
                                <div className="p-6 transition-all duration-700 group-hover:p-0 h-full flex flex-col">
                                    <div className="bg-neutral-50 rounded-[2.2rem] p-10 flex-grow transition-all duration-700 group-hover:rounded-none group-hover:bg-white flex flex-col items-start">
                                        <div className={`w-14 h-16 ${cert.bg} rounded-2xl border border-stone-border/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                            <cert.icon className={`w-7 h-7 ${cert.color}`} />
                                        </div>

                                        <h3 className="text-2xl font-bold text-stone-dark mb-2 group-hover:text-brand-blue transition-colors">
                                            {cert.title}
                                        </h3>
                                        <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em] mb-4">
                                            {cert.sub}
                                        </p>
                                        <p className="text-sm text-[#78716C] font-light leading-relaxed mb-8">
                                            {cert.desc}
                                        </p>

                                        <div className="mt-auto w-full">
                                            <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-dark/40 group-hover:text-brand-gold transition-colors">
                                                Verification View
                                                <Download className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quality Assurance Badge */}
                    <motion.div
                        {...fadeIn}
                        className="mt-20 md:mt-32 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-stone-dark text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                            <ShieldCheck className="w-full h-full -rotate-12 translate-x-1/4" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mb-8">
                                <Award className="w-6 h-6 text-stone-dark" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Commitment to <span className="text-brand-gold">Compliance</span></h2>
                            <p className="text-stone-300 text-base md:text-lg font-light leading-relaxed mb-10">
                                Every batch of Pakuaty tempe chips is monitored through our integrated quality system. From raw material sourcing to final export packaging, we ensure absolute transparency and safety.
                            </p>
                            <div className="flex flex-wrap gap-4 md:gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                    <span className="text-sm font-medium tracking-wide">100% Export Ready</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                    <span className="text-sm font-medium tracking-wide">Lab Tested Weekly</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                                    <span className="text-sm font-medium tracking-wide">Non-GMO Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Certificates;
