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
                        <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Story</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            Rooted in Tradition, <br />
                            <span className="text-primary">Crafted for the World.</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-light leading-relaxed">
                            Welcome to PT Bala Aditi Pakuaty — home of Pakuaty tempe chips, bringing the authentic flavors of Indonesia to the world with a spirit of collaboration and sustainability.
                        </p>
                    </motion.header>

                    {/* The Name — Etymology Section */}
                    <motion.section {...fadeIn} className="mb-32">
                        <div className="bg-stone-dark rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-15 transform translate-x-1/3 -translate-y-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-[80px] opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

                            <div className="relative z-10">
                                <span className="text-accent font-medium tracking-[0.4em] uppercase text-xs mb-8 block">The Meaning Behind Our Name</span>
                                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-12">
                                    Bala Aditi <span className="text-accent">Pakuaty</span>
                                </h2>

                                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                    <div className="border-l-2 border-accent/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-6 h-6 text-accent" />
                                            <h3 className="text-xl font-semibold text-white">Bala</h3>
                                        </div>
                                        <p className="text-sm text-accent font-medium mb-3 italic">Sanskrit — "Team" or "Force"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Reflects the strength of collaboration — every individual in our company unites to create world-class products.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-accent/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="w-6 h-6 text-accent" />
                                            <h3 className="text-xl font-semibold text-white">Aditi</h3>
                                        </div>
                                        <p className="text-sm text-accent font-medium mb-3 italic">Sanskrit — "Global" or "Boundless"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Represents our vision to bring the authentic taste of Indonesia to every corner of the world — sustainably.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-accent/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Heart className="w-6 h-6 text-accent" />
                                            <h3 className="text-xl font-semibold text-white">Pakuaty</h3>
                                        </div>
                                        <p className="text-sm text-accent font-medium mb-3 italic">"Pakunya Hati" — "Nail of the Heart"</p>
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
                                <p className="text-accent text-sm font-medium tracking-widest">{FOUNDER.title}</p>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                            <Quote className="w-12 h-12 text-primary/20 mb-8" />
                            <h2 className="text-3xl md:text-4xl font-medium text-stone-dark mb-8 leading-tight">
                                "We believe that food is not just a product, but a bridge between tradition, innovation, and sustainability."
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed font-light mb-10">
                                Built on the foundational values of traditional wisdom, goodness, and innovation, we continue to move forward — building a future for the food industry that is more nutritious, sustainable, and proudly Indonesian on the global stage.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-stone-border">
                                <div><p className="text-3xl font-bold text-primary mb-1">500+</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Partners</p></div>
                                <div><p className="text-3xl font-bold text-primary mb-1">100%</p><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quality Verified</p></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Core Values */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-4 block">What Drives Us</span>
                        <h2 className="text-4xl md:text-5xl font-medium text-stone-dark tracking-tight">Our Core Values</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {[
                            { icon: Sprout, title: "Traditional Wisdom", desc: "Honoring heritage recipes and time-tested techniques passed down through generations of Indonesian artisans." },
                            { icon: Lightbulb, title: "Innovation", desc: "Continuously evolving our processes to deliver better nutrition, quality, and experiences without losing authenticity." },
                            { icon: Globe, title: "Sustainability", desc: "Committed to ethical sourcing, responsible production, and building a food industry that benefits both people and planet." }
                        ].map((pillar, idx) => (
                            <motion.div key={idx} {...fadeIn} transition={{ delay: idx * 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-stone-border hover:border-accent transition-colors">
                                <pillar.icon className="w-10 h-10 text-accent mb-6" />
                                <h4 className="text-xl font-bold text-stone-dark mb-4">{pillar.title}</h4>
                                <p className="text-slate-600 font-light leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing Manifesto */}
                    <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
                        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-medium text-stone-dark tracking-tight mb-6">
                                Together, we bring <span className="text-accent">flavor</span>.<br />
                                Together, we build a <span className="text-accent">better world</span>.
                            </h2>
                            <p className="text-lg text-slate-600 font-light leading-relaxed">
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
