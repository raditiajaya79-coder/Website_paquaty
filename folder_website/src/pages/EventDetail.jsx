import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

// Mock data (matching Events.jsx)
const ARTICLES = [
    {
        id: 1,
        title: "Traditional Fermentation: The Secret to Pakuaty's Crunch",
        content: "Our fermentation process is a labor of love that spans generations. We start with carefully selected non-GMO soybeans, which are soaked and then inoculated with a traditional starter culture. The critical phase is the 48-hour slow fermentation in a temperature-controlled environment. This allows the mycelium to fully bind the soybeans, creating a dense, protein-rich 'cake' that forms the base of our chips.\n\nThis patient approach is what differentiates Pakuaty. While industrial methods try to speed up this process, we believe that true flavor and the perfect 'crunch' can only be achieved by respecting nature's timeline. The result is a snack that isn't just delicious, but deeply rooted in Indonesian heritage.",
        date: "Jan 15, 2026",
        author: "Heritage Master",
        category: "Process",
        image: "/images/keripik tempe original pakuaty.jpg"
    }
    // ...other articles will fallback to a generic template for this dummy implementation
];

const EventDetail = () => {
    const { id } = useParams();
    const article = ARTICLES.find(a => a.id === parseInt(id)) || ARTICLES[0];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="bg-neutral-bone min-h-screen pt-32 pb-24">
            <Helmet>
                <title>{generatePageTitle(article.title)}</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-6">
                <motion.div {...fadeIn} className="mb-12">
                    <Link to="/events" className="inline-flex items-center gap-2 text-stone-dark/60 hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Stories
                    </Link>
                </motion.div>

                <motion.header {...fadeIn} transition={{ delay: 0.1 }} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {article.category}
                        </span>
                        <div className="h-px flex-1 bg-stone-border/30"></div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-stone-dark mb-8 leading-[1.1]">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase tracking-widest text-stone-dark/60">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-gold" />
                            {article.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-gold" />
                            {article.author}
                        </div>
                    </div>
                </motion.header>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-[21/10] rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
                >
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </motion.div>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.3 }}
                    className="prose prose-stone max-w-none"
                >
                    <p className="text-xl text-stone-dark/80 leading-relaxed mb-8 font-light italic">
                        {article.excerpt || "At Pakuaty, we believe that every bite should tell a story of craftsmanship, dedication, and the rich culinary landscape of Indonesia."}
                    </p>
                    <div className="text-lg text-stone-dark/70 leading-[1.8] whitespace-pre-line space-y-6">
                        {article.content || "Full story content coming soon. We are currently documenting our journey to bring you closer to the heart of Pakuaty's heritage."}
                    </div>
                </motion.div>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.4 }}
                    className="mt-20 pt-12 border-t border-stone-border flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold uppercase tracking-widest text-stone-dark/60">Share Story:</span>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white border border-stone-border flex items-center justify-center cursor-pointer hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                    <Share2 className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetail;
