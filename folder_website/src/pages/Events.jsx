import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { generatePageTitle } from '../utils/seo';

const Events = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    const articles = [
        {
            id: 1,
            title: "Traditional Fermentation: The Secret to Pakuaty's Crunch",
            excerpt: "Discover the ancient heritage behind our 48-hour fermentation process that creates the unique texture and deep flavor profile of our artisan tempe.",
            date: "Jan 15, 2026",
            author: "Heritage Master",
            category: "Process",
            image: "/images/keripik tempe original pakuaty.jpg"
        },
        {
            id: 2,
            title: "Pakuaty Expands to Middle Eastern Markets",
            excerpt: "Our recent partnership with major retailers in Dubai marks a significant milestone in our journey to bring Indonesian flavors to the global stage.",
            date: "Feb 02, 2026",
            author: "Trade Dept",
            category: "Export",
            image: "/images/keirpik tempe balado pakuaty.jpg"
        },
        {
            id: 3,
            title: "Designing the Future: The Evolution of Our Packaging",
            excerpt: "Explore the design philosophy behind our new premium holographic packaging that balances modern aesthetics with traditional Indonesian motifs.",
            date: "Feb 18, 2026",
            author: "Design Team",
            category: "Innovation",
            image: "/images/logo pakuaty tagline.png"
        },
        {
            id: 4,
            title: "Sourcing Excellence: Meeting Our Local Soybean Farmers",
            excerpt: "We visit the heart of East Java to meet the families who grow the non-GMO soybeans that form the foundation of every Pakuaty tempe chip.",
            date: "Feb 25, 2026",
            author: "Sourcing Team",
            category: "Community",
            image: "/images/keripik tempe sapi pakuaty.jpg"
        },
        {
            id: 5,
            title: "The Health Benefits of Fermented Snacks",
            excerpt: "Scientific insights into why our traditional fermentation process makes tempe chips a superior snack choice for health-conscious consumers.",
            date: "Mar 01, 2026",
            author: "Health Expert",
            category: "Wellness",
            image: "/images/keripik jamur pakuaty.jpg"
        },
        {
            id: 6,
            title: "Upcoming Event: Indonesian Food Expo 2026",
            excerpt: "Join us in Jakarta this coming April as we showcase our latest flavor innovations and heritage craftsmanship at the national food exhibition.",
            date: "Mar 10, 2026",
            author: "PR Team",
            category: "Event",
            image: "/images/FOTO ALL KERIPIK TEMPE.jpg"
        }
    ];

    return (
        <div className="bg-brand-cream min-h-screen pt-32 pb-24 relative overflow-hidden">
            <Helmet>
                <title>{generatePageTitle('Events & Stories')}</title>
                <meta name="description" content="Stay updated with Pakuaty's latest events, heritage stories, and export milestones." />
            </Helmet>

            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-20 text-center">
                    <motion.span
                        {...fadeIn}
                        className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-brand-blue/20 decoration-2 underline-offset-8"
                    >
                        Latest Updates
                    </motion.span>
                    <motion.h1
                        {...fadeIn}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-medium tracking-tight text-stone-dark mb-6"
                    >
                        Events & <span className="text-brand-blue italic">Stories</span>
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-dark/60 max-w-2xl mx-auto"
                    >
                        Discover the journey behind our artisan tempe chips and stay updated with our latest global ventures.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {articles.map((article, idx) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-xl bg-white group">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-blue shadow-lg">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-brand-gold-dark" />
                                        {article.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-brand-gold-dark" />
                                        {article.author}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-stone-dark group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                    {article.title}
                                </h2>

                                <p className="text-[#57534E] leading-relaxed line-clamp-3 font-light">
                                    {article.excerpt}
                                </p>

                                <Link
                                    to={`/events/${article.id}`}
                                    className="pt-4 flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300"
                                >
                                    Read Full Story
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
