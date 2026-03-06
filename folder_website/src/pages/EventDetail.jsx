const ARTICLE_IMAGES = {
    1: "/images/keripik tempe original pakuaty.jpg",
    2: "/images/keirpik tempe balado pakuaty.jpg",
    3: "/images/logo pakuaty tagline.png",
    4: "/images/keripik tempe sapi pakuaty.jpg",
    5: "/images/keripik jamur pakuaty.jpg",
    6: "/images/FOTO ALL KERIPIK TEMPE.jpg"
};

const EventDetail = () => {
    const { id } = useParams();
    const { t } = useLanguage();

    // We use the ID to pull localized content
    const articleId = parseInt(id) || 1;
    const image = ARTICLE_IMAGES[articleId] || ARTICLE_IMAGES[1];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="bg-neutral-bone min-h-screen pt-32 pb-24">
            <Helmet>
                <title>{generatePageTitle(t(`article.${articleId}.title`))}</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-6">
                <motion.div {...fadeIn} className="mb-12">
                    <Link to="/events" className="inline-flex items-center gap-2 text-stone-dark/60 hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                        <ArrowLeft className="w-4 h-4" />
                        {t('article.detail.back')}
                    </Link>
                </motion.div>

                <motion.header {...fadeIn} transition={{ delay: 0.1 }} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {t(`article.${articleId}.cat`)}
                        </span>
                        <div className="h-px flex-1 bg-stone-border/30"></div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-stone-dark mb-8 leading-[1.1]">
                        {t(`article.${articleId}.title`)}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase tracking-widest text-stone-dark/60">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-gold" />
                            {t(`article.${articleId}.date`)}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-gold" />
                            {t(`article.${articleId}.author`)}
                        </div>
                    </div>
                </motion.header>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-[21/10] rounded-[3rem] overflow-hidden mb-16 shadow-2xl"
                >
                    <img src={image} alt={t(`article.${articleId}.title`)} className="w-full h-full object-cover" />
                </motion.div>

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.3 }}
                    className="prose prose-stone max-w-none"
                >
                    <p className="text-xl text-stone-dark/80 leading-relaxed mb-8 font-light italic">
                        {t(`article.${articleId}.excerpt`)}
                    </p>
                    <div className="text-lg text-stone-dark/70 leading-[1.8] whitespace-pre-line space-y-6">
                        {t(`article.${articleId}.content`)}
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
