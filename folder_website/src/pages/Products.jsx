import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../data/products';
import { generatePageTitle } from '../utils/seo';

const Products = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Our Products')}</title>
                <meta name="description" content={`Explore our range of premium natural commodities at ${COMPANY_INFO.name}.`} />
            </Helmet>

            <div className="bg-[#050A06] min-h-screen pt-32 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 bg-[#132316] blur-3xl rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-24">
                        <span className="text-[#A3B14B] font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Collection</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-8">
                            Premium <span className="text-[#A3B14B]">Commodities</span>
                        </h1>
                        <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
                            Directly sourced from organic farms, processed with the highest standards for global distribution.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {PRODUCTS.map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="block group">
                                <motion.div
                                    {...fadeIn}
                                    className="bg-[#132316] rounded-3xl border border-white/5 hover:border-[#A3B14B]/50 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a140c] via-transparent to-transparent opacity-60 z-10"></div>
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        {product.tag && (
                                            <span className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full text-xs font-bold bg-[#A3B14B] text-white shadow-lg">
                                                {product.tag}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{product.name}</h3>
                                        <p className="text-[#A3B14B] font-medium mb-6">{product.grade}</p>

                                        <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                            <div>
                                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Origin</p>
                                                <p className="text-sm font-medium text-neutral-200">{product.origin}</p>
                                            </div>
                                            <div className="bg-white/5 hover:bg-[#A3B14B] text-white p-3 rounded-full transition-all group-hover:scale-110">
                                                <ArrowRight className="w-5 h-5 -rotate-45" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;
