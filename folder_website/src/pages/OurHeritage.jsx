import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Quote, Globe, Users, Heart, Sprout, Lightbulb, Award } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { COMPANY_INFO, FOUNDER } from '../data/products';

/**
 * OurHeritage — The consolidated premium "About Us" experience.
 * Features: Parallax storytelling, sticky founder section, and philosophy reveal.
 */
const OurHeritage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Parallax transforms for various sections
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    const fadeIn = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div ref={containerRef} className="bg-neutral-bone min-h-screen">
            <Helmet>
                <title>{generatePageTitle('Our Heritage')}</title>
                <meta name="description" content="Discover the heartbeat of PT Bala Aditi Pakuaty. A journey of heritage, global vision, and the soul of Indonesian tempe." />
            </Helmet>

            {/* ========================== */}
            {/* HERO SECTION — Parallax 7xl */}
            {/* ========================== */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY, opacity: opacityHero }} className="relative z-10 text-center px-6">
                    <span className="text-brand-blue font-bold tracking-[0.5em] uppercase text-xs mb-8 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">Legacy & Vision</span>
                    <h1 className="text-6xl md:text-9xl font-medium text-stone-dark tracking-tighter mb-8 leading-[0.9]">
                        Our <span className="text-brand-blue italic">Heritage</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-dark/60 font-light max-w-2xl mx-auto leading-relaxed">
                        PT Bala Aditi Pakuaty is more than a name; it is a promise of quality, a tribute to tradition, and a vision for a global future.
                    </p>
                </motion.div>

                {/* Decorative background mesh */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(38,84,161,0.05)_0%,transparent_60%)]" />
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full" />
                </div>
            </section>

            {/* ========================== */}
            {/* PHILOSOPHY — The Reveal */}
            {/* ========================== */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-24">
                        <h2 className="text-4xl md:text-6xl font-medium text-stone-dark tracking-tight mb-8">
                            The Meaning of <br />
                            <span className="text-brand-blue italic">Bala Aditi Pakuaty</span>
                        </h2>
                        <div className="w-24 h-1 bg-brand-gold" />
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Users,
                                title: "Bala",
                                subtitle: "The Force",
                                lang: "Sanskrit — 'Pasukan' (Team)",
                                desc: "Represents the collaborative spirit of every individual in our company, united as one team to create products that are recognized and loved worldwide."
                            },
                            {
                                icon: Globe,
                                title: "Aditi",
                                subtitle: "The Horizon",
                                lang: "Sanskrit — 'Mendunia' (Global)",
                                desc: "Represents our vision to reach every corner of the globe, bringing authentic Indonesian flavors and sustainable nutrition to all."
                            },
                            {
                                icon: Heart,
                                title: "Pakuaty",
                                subtitle: "The Core",
                                lang: "'Pakunya Hati' (Anchor of Hearts)",
                                desc: "Our brand identity. A promise that our products will captivate hearts, creating a bond so strong that customers will never look elsewhere."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeIn}
                                transition={{ delay: idx * 0.2 }}
                                className="group p-12 bg-white rounded-[3rem] border border-stone-border/30 hover:border-brand-gold transition-all duration-700 hover:shadow-2xl hover:-translate-y-2"
                            >
                                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold text-stone-dark mb-2 tracking-tight">{item.title}</h3>
                                <p className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{item.subtitle}</p>
                                <p className="text-brand-blue text-xs font-semibold italic mb-6">{item.lang}</p>
                                <p className="text-stone-dark/60 leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================== */}
            {/* FOUNDERS JOURNEY — Sticky */}
            {/* ========================== */}
            <section className="py-32 bg-stone-dark relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        {/* Sticky Photo */}
                        <div className="lg:sticky lg:top-32">
                            <motion.div {...fadeIn} className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden group">
                                <img src={FOUNDER.image} alt={FOUNDER.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-dark via-transparent opacity-60" />
                                <div className="absolute bottom-12 left-12">
                                    <h3 className="text-3xl font-bold text-white mb-2">{FOUNDER.name}</h3>
                                    <p className="text-brand-gold font-medium tracking-[0.3em] uppercase text-xs">Founder & CEO</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Story Content */}
                        <div className="space-y-16">
                            <motion.div {...fadeIn}>
                                <Quote className="w-16 h-16 text-brand-gold/20 mb-10" />
                                <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-12">
                                    A Message <br />
                                    from our <span className="text-brand-gold italic">Founder</span>
                                </h2>
                                <div className="space-y-8 text-neutral-400 text-lg leading-relaxed font-light">
                                    <p className="text-white font-medium italic border-l-4 border-brand-gold pl-8">
                                        "Welcome to PT Bala Aditi Pakuaty, where every chip is a labor of love and a bridge between Indonesian tradition and global excellence."
                                    </p>
                                    <p>
                                        Our journey began with a simple yet profound realization: Indonesia's traditional tempe is a nutritional miracle. But to make the world notice, we needed more than just a product; we needed a movement.
                                    </p>
                                    <p>
                                        We combined the patient art of fermentation with modern high-precision craft. Every 'crunch' of Pakuaty is designed to resonate with the hearts of global consumers, ensuring that Indonesian heritage is no longer a secret, but a celebrated standard.
                                    </p>
                                    <p>
                                        I invite you to be part of this journey. Together, we are not just selling snacks; we are anchoring Indonesian excellence in the hearts of the world.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Pillars of Excellence */}
                            <div className="grid gap-8">
                                {[
                                    { icon: Lightbulb, title: "Precision Craft", desc: "Merging traditional 'ragi' techniques with high-tech production consistency." },
                                    { icon: Sprout, title: "Origin Integrity", desc: "Directly empowering local farmers to ensure the purest non-GMO ingredients." },
                                    { icon: Award, title: "Global Standard", desc: "Setting the benchmark for premium fermented exports since day one." }
                                ].map((pillar, idx) => (
                                    <motion.div
                                        key={idx}
                                        {...fadeIn}
                                        className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex gap-6 items-center hover:bg-white/10 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                                            <pillar.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{pillar.title}</h4>
                                            <p className="text-neutral-400 text-sm">{pillar.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================== */}
            {/* CALL TO ACTION — World Class */}
            {/* ========================== */}
            <section className="py-40 px-6 text-center">
                <motion.div {...fadeIn} className="max-w-4xl mx-auto bg-brand-blue rounded-[4rem] p-16 md:p-24 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(38,84,161,0.3)]">
                    {/* Background Texture */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold opacity-10 blur-[100px] rounded-full -mr-20 -mt-20" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-medium text-white tracking-tighter mb-10 leading-[0.9]">
                            Together, we <br />
                            <span className="text-brand-gold italic">Anchor Excellence</span>
                        </h2>
                        <p className="text-xl text-stone-100/70 font-light mb-12 max-w-2xl mx-auto">
                            Join us in bringing the soul of Indonesian tradition to the world's most discerning tables.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="px-10 py-5 bg-white text-brand-blue rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-white transition-all shadow-xl active:scale-95">Our Products</button>
                            <button className="px-10 py-5 bg-transparent border border-white/30 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Contact Team</button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default OurHeritage;
