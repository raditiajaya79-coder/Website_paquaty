import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Globe, ShieldCheck, Award, Quote } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { COMPANY_INFO, FOUNDER } from '../data/products';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Our Story')}</title>
                <meta name="description" content={`Learn the vision behind ${COMPANY_INFO.name}.`} />
            </Helmet>

            <div className="bg-[#FAFAF9] min-h-screen pt-32 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.header {...fadeIn} className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-[#A3B14B] font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Transparency First</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-[#1C1917] tracking-tight mb-8">
                            Rooted in Nature, <br />
                            <span className="text-[#A3B14B]">Grown for the World.</span>
                        </h1>
                        <p className="text-xl text-[#57534E] font-light leading-relaxed">
                            {COMPANY_INFO.tagline}. We connect ethical farmers with the global market, ensuring top-tier quality in every shipment.
                        </p>
                    </motion.header>

                    {/* Narrative Section */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div {...fadeIn} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img src={FOUNDER.image} alt={FOUNDER.name} className="w-full h-full object-cover grayscale-[0.2]" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#1C1917] to-transparent">
                                <h3 className="text-2xl font-semibold text-white">{FOUNDER.name}</h3>
                                <p className="text-[#A3B14B] text-sm font-medium tracking-widest">{FOUNDER.title}</p>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                            <Quote className="w-12 h-12 text-[#A3B14B]/20 mb-8" />
                            <h2 className="text-3xl md:text-4xl font-medium text-[#1C1917] mb-8 leading-tight">
                                "Our mission is to bridge the gap between local heritage and global standards."
                            </h2>
                            <p className="text-[#57534E] text-lg leading-relaxed font-light mb-10">
                                {FOUNDER.bio}
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-[#E7E5E4]">
                                <div><p className="text-3xl font-bold text-[#A3B14B] mb-1">500+</p><p className="text-xs font-bold text-[#78716C] uppercase tracking-widest">Global Partners</p></div>
                                <div><p className="text-3xl font-bold text-[#A3B14B] mb-1">100%</p><p className="text-xs font-bold text-[#78716C] uppercase tracking-widest">Quality Verified</p></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Core Pillars */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: "Global Reach", desc: "Specializing in the logistics of international commodity trade." },
                            { icon: ShieldCheck, title: "Verified Safety", desc: "Exceeding standards for absolute consumer confidence." },
                            { icon: Award, title: "Premium Quality", desc: "Hand-selected ingredients processed with heritage techniques." }
                        ].map((pillar, idx) => (
                            <motion.div key={idx} {...fadeIn} transition={{ delay: idx * 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-[#E7E5E4] hover:border-[#A3B14B] transition-colors">
                                <pillar.icon className="w-10 h-10 text-[#A3B14B] mb-6" />
                                <h4 className="text-xl font-bold text-[#1C1917] mb-4">{pillar.title}</h4>
                                <p className="text-[#57534E] font-light leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
