import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Globe, ShieldCheck, Award, Quote, Sprout, Lightbulb, Heart, Users } from 'lucide-react';
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
                <meta name="description" content="Discover PT Bala Aditi Pakuaty — the story behind Indonesia's finest tempe chips, rooted in tradition and crafted for the world." />
            </Helmet>

            <div className="bg-stone-light min-h-screen pt-32 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.header {...fadeIn} className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Story</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            A Heritage of Flavor, <br />
                            <span className="text-brand-blue">A Vision for the World.</span>
                        </h1>
                        <p className="text-xl text-[#57534E] font-light leading-relaxed mb-6">
                            Pakuaty is a premium Indonesian tempe chip brand under PT. Bala Aditi Pakuaty. We transform traditional fermented protein into globally competitive, export-ready snack products.
                        </p>
                        <p className="text-lg text-brand-gold font-medium italic">
                            Rooted in Indonesian wisdom. Designed for international markets.
                        </p>
                    </motion.header>

                    {/* The Name — Etymology Section */}
                    <motion.section {...fadeIn} className="mb-32">
                        <div className="bg-stone-dark rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-[100px] opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-gold rounded-full blur-[80px] opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

                            <div className="relative z-10">
                                <span className="text-brand-gold font-medium tracking-[0.4em] uppercase text-xs mb-8 block">The Meaning Behind Our Name</span>
                                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-12">
                                    Bala Aditi <span className="text-brand-gold">Pakuaty</span>
                                </h2>

                                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Bala</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">Sanskrit — "Team" or "Force"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Reflects the strength of collaboration — every individual in our company unites to create world-class products.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Aditi</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">Sanskrit — "Global" or "Boundless"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Represents our vision to bring the authentic taste of Indonesia to every corner of the world — sustainably.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Heart className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Pakuaty</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">"Pakunya Hati" — "Nail of the Heart"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            A symbol of our commitment to captivate and win the hearts of our customers through authentic taste, the finest quality, and unforgettable experiences.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Philosophy Section */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div {...fadeIn} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img src={FOUNDER.image} alt={FOUNDER.name} className="w-full h-full object-cover grayscale-[0.2]" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-stone-dark to-transparent">
                                <h3 className="text-2xl font-semibold text-white">{FOUNDER.name}</h3>
                                <p className="text-brand-gold text-sm font-medium tracking-widest">{FOUNDER.title}</p>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                            <Quote className="w-12 h-12 text-brand-blue/20 mb-8" />
                            <h2 className="text-3xl md:text-4xl font-medium text-stone-dark mb-8 leading-tight">
                                "We believe tempe is not just a food, but a technology—a bridge between Indonesian heritage and global food innovation."
                            </h2>
                            <p className="text-[#57534E] text-lg leading-relaxed font-light mb-10">
                                Built on the foundational values of traditional wisdom, goodness, and innovation, we continue to move forward — building a future for the food industry that is more nutritious, sustainable, and proudly Indonesian on the global stage.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-stone-border">
                                <div><p className="text-3xl font-bold text-brand-blue mb-1">500+</p><p className="text-xs font-bold text-[#78716C] uppercase tracking-widest">Global Partners</p></div>
                                <div><p className="text-3xl font-bold text-brand-blue mb-1">100%</p><p className="text-xs font-bold text-[#78716C] uppercase tracking-widest">Quality Verified</p></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Core Values */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-4 block">What Drives Us</span>
                        <h2 className="text-4xl md:text-5xl font-medium text-stone-dark tracking-tight">Our Core Values</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {[
                            { icon: Lightbulb, title: "The Tempe Technology", desc: "We see tempe not just as a bean, but as a centuries-old fermentation process that can be applied to any protein source globally." },
                            { icon: Globe, title: "Global Adaptability", desc: "Our vision is to empower other nations to use their local beans with Indonesian fermentation expertise to create sustainable nutrition." },
                            { icon: Sprout, title: "Indonesian Wisdom", desc: "Honoring the traditional 'ragi' techniques while evolving them into a high-tech global solution for the future of food." }
                        ].map((pillar, idx) => (
                            <motion.div key={idx} {...fadeIn} transition={{ delay: idx * 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-stone-border hover:border-brand-gold transition-colors">
                                <pillar.icon className="w-10 h-10 text-brand-gold mb-6" />
                                <h4 className="text-xl font-bold text-stone-dark mb-4">{pillar.title}</h4>
                                <p className="text-[#57534E] font-light leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing Manifesto */}
                    <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
                        <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-[2.5rem] p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-medium text-stone-dark tracking-tight mb-6">
                                Together, we bring <span className="text-brand-gold">flavor</span>.<br />
                                Together, we build a <span className="text-brand-gold">better world</span>.
                            </h2>
                            <p className="text-lg text-[#57534E] font-light leading-relaxed">
                                At Pakuaty, every chip carries a story — of farmers who nurture the land, of traditions that inspire us, and of a future we're building together.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default About;
