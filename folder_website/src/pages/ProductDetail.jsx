import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Globe2, MessageCircle, FileText } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { PRODUCTS, COMPANY_INFO } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const product = PRODUCTS.find(p => p.id === parseInt(id));

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    if (!product) {
        return (
            <div className="pt-40 pb-20 text-center">
                <h2 className="text-2xl font-serif text-stone-dark mb-4">Product Not Found</h2>
                <Link to="/products" className="text-brand-gold font-medium hover:underline">Return to Catalog</Link>
            </div>
        );
    }

    const handleWhatsAppOrder = () => {
        const message = `Halo ${COMPANY_INFO.name}, saya tertarik untuk mengimpor produk ${product.name} (${product.grade}). Mohon informasi katalog lengkap dan price list ekspor.`;
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(`${product.name} — Premium Export`)}</title>
                <meta name="description" content={`${product.name} from ${COMPANY_INFO.name}. Grade: ${product.grade}. Origin: ${product.origin}. Ready for global distribution.`} />
            </Helmet>

            <div className="bg-stone-light min-h-screen pt-32 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeIn} className="mb-12">
                        <Link to="/products" className="inline-flex items-center gap-2 text-[#78716C] hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Collection
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="relative rounded-[3.5rem] overflow-hidden bg-white border border-stone-border shadow-2xl"
                        >
                            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                            <div className="absolute top-10 left-10">
                                <span className="px-5 py-2 bg-stone-dark/80 backdrop-blur-xl text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em] border border-white/10">
                                    Quality Assured
                                </span>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:sticky lg:top-32">
                            <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block underline decoration-brand-gold/30 decoration-2 underline-offset-8">Premium Commodity</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-medium text-stone-dark tracking-tight mb-6 leading-[1.1]">{product.name}</h1>
                            <p className="text-2xl text-[#78716C] font-light mb-10 italic">Nature's finest selection.</p>

                            <div className="grid grid-cols-2 gap-4 mb-12">
                                <div className="p-6 bg-white rounded-3xl border border-stone-border shadow-sm flex flex-col gap-3">
                                    <Globe2 className="w-6 h-6 text-brand-blue" />
                                    <div>
                                        <p className="text-[10px] text-[#78716C] uppercase font-bold tracking-widest mb-1">Origin</p>
                                        <p className="font-bold text-stone-dark">{product.origin}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border border-stone-border shadow-sm flex flex-col gap-3">
                                    <ShoppingBag className="w-6 h-6 text-brand-blue" />
                                    <div>
                                        <p className="text-[10px] text-[#78716C] uppercase font-bold tracking-widest mb-1">MOQ</p>
                                        <p className="font-bold text-stone-dark">{product.moq}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-stone mb-12">
                                <p className="text-[#57534E] leading-relaxed font-light text-lg">
                                    Superior grade {product.name} sourced directly from our network of ethical farmers. Each batch undergoes rigorous quality control to ensure it meets our strict export standards.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                                    {[
                                        { icon: CheckCircle2, text: "International Standards" },
                                        { icon: ShieldCheck, text: "Verified Quality" },
                                        { icon: Globe2, text: "Global Logistics" },
                                        { icon: FileText, text: "Full Documentation" }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 text-stone-dark text-sm font-semibold">
                                            <feat.icon className="w-5 h-5 text-brand-blue" />
                                            {feat.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full py-6 bg-stone-dark text-white rounded-[2rem] font-bold text-sm tracking-widest uppercase hover:bg-brand-blue transition-all shadow-2xl shadow-stone-200 hover:shadow-brand-blue/30 flex items-center justify-center gap-3 active:scale-98"
                                >
                                    INQUIRE EXPORT PRICING
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <p className="text-center text-[10px] text-[#78716C] font-medium">Direct connection to {COMPANY_INFO.name} trade department.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
