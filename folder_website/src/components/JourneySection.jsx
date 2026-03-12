import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Microscope, Package, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const JourneySection = () => {
    const { lang } = useLanguage();

    const steps = [
        {
            id: '01',
            icon: Sprout,
            title: lang === 'id' ? 'Ethical Sourcing' : 'Ethical Sourcing',
            desc: lang === 'id'
                ? 'Kami bermitra langsung dengan petani, memastikan upah yang adil dan praktik panen yang berkelanjutan.'
                : 'We partner directly with farmers, ensuring fair wages and sustainable harvesting practices.'
        },
        {
            id: '02',
            icon: Microscope,
            title: lang === 'id' ? 'Quality Control' : 'Quality Control',
            desc: lang === 'id'
                ? 'Pengujian lab yang ketat untuk kemurnian, kadar air, dan tingkat residu pestisida.'
                : 'Rigorous lab testing for purity, moisture content, and pesticide residue levels.'
        },
        {
            id: '03',
            icon: Package,
            title: lang === 'id' ? 'Global Logistics' : 'Global Logistics',
            desc: lang === 'id'
                ? 'Penanganan ekspor yang efisien, bea cukai, dan pengiriman dengan suhu terkendali.'
                : 'Efficient export handling, customs clearance, and temperature-controlled shipping.'
        },
        {
            id: '04',
            icon: Store,
            title: lang === 'id' ? 'Retail Ready' : 'Retail Ready',
            desc: lang === 'id'
                ? 'Dikirim ke gudang Anda atau rak supermarket, siap untuk konsumen akhir.'
                : 'Delivered to your warehouse or supermarket shelves, ready for the end consumer.'
        }
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <section className="py-24 bg-[#1A1206] text-white relative overflow-hidden">
            {/* Background pattern if needed, but keeping it clean like the image */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        {...fadeIn}
                        className="text-brand-gold font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block"
                    >
                        TRANSPARENCY FIRST
                    </motion.span>
                    <motion.h2
                        {...fadeIn}
                        transition={{ ...fadeIn.transition, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight italic"
                    >
                        Farm to Shelf Journey
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connecting line (Desktop only) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-brand-gold/20 -z-0"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 0.2 + (idx * 0.1) }}
                            className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10"
                        >
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group hover:border-brand-gold transition-all duration-500 backdrop-blur-sm">
                                <step.icon className="w-10 h-10 text-brand-gold group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            <span className="text-brand-gold/40 font-black text-[10px] tracking-[0.3em] uppercase mb-3">
                                STEP {step.id}
                            </span>

                            <h3 className="text-xl font-bold mb-4 tracking-tight">
                                {step.title}
                            </h3>

                            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
