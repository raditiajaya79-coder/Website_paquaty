import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
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
            title: "The Heritage of Kediri: Crafting the Perfect Tempe",
            excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedenim omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            date: "Oct 24, 2025",
            author: "Pakuaty Heritage Team",
            category: "Heritage",
            image: "/images/keripik tempe original pakuaty.jpg"
        },
        {
            id: 2,
            title: "Expanding to Global Markets: Our Recent Export Milestone",
            excerpt: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
            date: "Nov 12, 2025",
            author: "Trade Department",
            category: "Export",
            image: "/images/keirpik tempe balado pakuaty.jpg"
        },
        {
            id: 3,
            title: "Innovation in Snacks: New Flavors Coming Soon",
            excerpt: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
            date: "Dec 05, 2025",
            author: "R&D Team",
            category: "Innovation",
            image: "/images/keripik tempe bbq pakuaty.jpg"
        }
    ];

    return (
        <div className="bg-stone-light min-h-screen pt-32 pb-24">
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
                        Events & <span className="text-brand-gold italic">Stories</span>
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
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-xl bg-stone-200 flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-200 opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
                                <div className="relative z-10 text-stone-400 font-bold tracking-tighter text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 select-none">
                                    PAKUATY
                                </div>
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-blue shadow-lg">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-brand-gold" />
                                        {article.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-brand-gold" />
                                        {article.author}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-stone-dark group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                                    {article.title}
                                </h2>

                                <p className="text-[#57534E] leading-relaxed line-clamp-3 font-light">
                                    {article.excerpt}
                                </p>

                                <div className="pt-4 flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                    Read Full Story
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
