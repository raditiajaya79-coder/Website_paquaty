import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, ShieldCheck, Check, Download, FileBadge, FileCheck, Landmark, X } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

const Certificates = () => {
    const [selectedCert, setSelectedCert] = React.useState(null);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    const certifications = [
        {
            title: "HACCP Certified",
            sub: "Food Safety",
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
            sub: "Food Safety",
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

            <div className="bg-brand-cream min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(218,165,32,0.08)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-28">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">Trust & Compliance</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            Global Standard <span className="text-brand-blue italic">Excellence</span>
                        </h1>
                        <p className="text-base md:text-xl text-[#57534E] font-light leading-relaxed max-w-3xl mx-auto">
                            We maintain rigorous international food safety protocols to bring Indonesian heritage to the world stage.
                        </p>
                    </motion.div>

                    {/* Certifications Grid: 2 columns on mobile, spanning md columns on desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8">
                        {certifications.map((cert, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                onClick={() => {
                                    if (window.innerWidth < 768) setSelectedCert(cert);
                                }}
                                className={`group bg-white rounded-[1.5rem] md:rounded-[3rem] border border-stone-border/30 overflow-hidden hover:shadow-2xl transition-all duration-700 transform-gpu cursor-pointer md:cursor-default ${cert.span}`}
                            >
                                <div className="p-3 md:p-6 h-full flex flex-col">
                                    <div className="bg-white rounded-[1.2rem] md:rounded-[2.2rem] p-5 md:p-10 flex-grow transition-all duration-700 hover:bg-white/50 flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className={`w-10 h-10 md:w-14 md:h-16 ${cert.bg} rounded-xl md:rounded-2xl border border-stone-border/30 flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                            <cert.icon className={`w-5 h-5 md:w-7 md:h-7 ${cert.color}`} />
                                        </div>

                                        <h3 className="text-sm md:text-2xl font-bold text-stone-dark mb-1 md:mb-2 group-hover:text-brand-blue transition-colors line-clamp-1 md:line-clamp-none">
                                            {cert.title}
                                        </h3>
                                        <p className="text-[7px] md:text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em] mb-4">
                                            {cert.sub}
                                        </p>

                                        {/* Hidden on mobile card, shown on desktop */}
                                        <p className="hidden md:block text-sm text-[#78716C] font-light leading-relaxed mb-8">
                                            {cert.desc}
                                        </p>

                                        <div className="mt-auto w-full hidden md:block">
                                            <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-dark/40 group-hover:text-brand-cyan transition-colors">
                                                Verification View
                                                <Download className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Mobile Tap Indicator */}
                                        <div className="md:hidden mt-1">
                                            <span className="text-[7px] font-bold text-brand-blue/50 uppercase tracking-widest">Tap to View</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pop-up Modal for Mobile Details */}
                    <AnimatePresence>
                        {selectedCert && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:hidden">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedCert(null)}
                                    className="absolute inset-0 bg-stone-dark/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setSelectedCert(null)}
                                        className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 text-stone-dark active:scale-90 transition-transform"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-5 mb-8">
                                        <div className={`w-14 h-16 ${selectedCert.bg} rounded-2xl border border-stone-border/30 flex items-center justify-center shrink-0`}>
                                            <selectedCert.icon className={`w-7 h-7 ${selectedCert.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-stone-dark leading-tight">
                                                {selectedCert.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em] mt-1">
                                                {selectedCert.sub}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-base text-[#78716C] font-light leading-relaxed mb-8">
                                        {selectedCert.desc}
                                    </p>

                                    <button className="w-full py-4 bg-brand-blue text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-brand-cyan transition-all active:scale-95">
                                        Verify Certificate
                                        <Download className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Quality Assurance Badge */}
                    <motion.div
                        {...fadeIn}
                        className="mt-20 md:mt-32 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-stone-dark text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                            <ShieldCheck className="w-full h-full -rotate-12 translate-x-1/4" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-gold rounded-full flex items-center justify-center mb-8">
                                <Award className="w-5 h-5 md:w-6 md:h-6 text-stone-dark" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight">Our Commitment to <span className="text-brand-gold">Compliance</span></h2>
                            <p className="text-stone-300 text-sm md:text-lg font-light leading-relaxed mb-10">
                                Every batch of Pakuaty tempe chips is monitored through our integrated quality system. From raw material sourcing to final export packaging.
                            </p>
                            <div className="flex flex-wrap gap-4 md:gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">100% Export Ready</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">Lab Tested Weekly</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                    <span className="text-xs md:text-sm font-medium tracking-wide">Non-GMO Guaranteed</span>
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
