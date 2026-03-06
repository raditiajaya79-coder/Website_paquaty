// Certificates.jsx — Halaman Sertifikasi & Kualitas
// Data diambil dari backend API /api/certificates
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Award, CheckCircle2, X } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { api } from '../utils/api'; // Utilitas API

/**
 * Certificates — Menampilkan daftar sertifikasi dan jaminan kualitas
 * Data diambil dari database via API /api/certificates
 */
const Certificates = () => {
    const [certificates, setCertificates] = useState([]); // State daftar sertifikat
    const [loading, setLoading] = useState(true); // State loading
    const [selectedCert, setSelectedCert] = useState(null); // State untuk modal detail (mobile)

    // Fetch data sertifikat dari backend
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const data = await api.get('/certificates'); // GET /api/certificates
                setCertificates(data);
            } catch (error) {
                console.error('Gagal memuat sertifikat:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    // Animasi komponen
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Quality & Certificates')}</title>
                <meta name="description" content="Pakuaty's commitment to excellence. Discover our international food safety certifications and quality standards." />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Committed to Excellence</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            Verified <span className="text-brand-blue">Standard</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            Every Pakuaty chip is a promise of quality — backed by international food safety standards and national certifications.
                        </p>
                    </motion.div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] p-8 h-64 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        /* Grid Sertifikat */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {certificates.map((cert, index) => (
                                <motion.div
                                    key={cert.id}
                                    {...fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-[2rem] p-8 md:p-10 border border-stone-border hover:border-brand-gold/50 transition-all duration-700 hover:shadow-2xl group flex flex-col cursor-pointer lg:cursor-default"
                                    onClick={() => setSelectedCert(cert)}
                                >
                                    <div className="mb-8 p-4 bg-stone-50 rounded-2xl inline-block group-hover:bg-brand-cream transition-colors duration-700">
                                        <Award className="w-8 h-8 text-brand-blue" />
                                    </div>
                                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block italic">{cert.sub}</span>
                                    <h3 className="text-2xl font-medium text-stone-dark mb-4">{cert.title}</h3>
                                    <p className="text-sm text-[#57534E] leading-relaxed mb-6 flex-grow">
                                        {cert.description}
                                    </p>
                                    <div className="pt-6 border-t border-stone-border flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest">Issued By</span>
                                        <span className="text-xs font-bold text-stone-dark">{cert.issuedBy}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Jaminan Kualitas Badge */}
                    <motion.div {...fadeIn} className="mt-24 md:mt-40">
                        <div className="bg-brand-blue rounded-[2rem] md:rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="p-8 bg-white/10 rounded-[2.5rem] backdrop-blur-xl border border-white/20">
                                    <ShieldCheck className="w-20 h-20 md:w-32 md:h-32 text-brand-gold" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Your Trust is Our <br /><span className="text-brand-gold">Highest Standard</span></h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                        {[
                                            "ISO 22000 Food Safety Management",
                                            "Sustainable Farming Partnerships",
                                            "Non-GMO Soybean Selection",
                                            "Strict Laboratory Testing"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm md:text-base opacity-90">
                                                <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile/Detail Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-dark/60 backdrop-blur-sm"
                            onClick={() => setSelectedCert(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setSelectedCert(null)} className="absolute top-6 right-6 text-[#A8A29E] hover:text-red-500">
                                <X size={24} />
                            </button>
                            <div className="mb-6 p-4 bg-brand-cream rounded-2xl inline-block">
                                <Award className="w-8 h-8 text-brand-blue" />
                            </div>
                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block italic">{selectedCert.sub}</span>
                            <h3 className="text-2xl font-medium text-stone-dark mb-4">{selectedCert.title}</h3>
                            <p className="text-sm text-[#57534E] leading-relaxed mb-8">{selectedCert.description}</p>
                            <div className="pt-6 border-t border-stone-border">
                                <p className="text-[10px] text-[#A8A29E] uppercase font-bold mb-1">Issued By</p>
                                <p className="text-sm font-bold text-stone-dark">{selectedCert.issuedBy}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Certificates;
