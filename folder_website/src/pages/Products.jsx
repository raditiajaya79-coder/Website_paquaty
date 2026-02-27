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

            <div className="bg-stone-light min-h-screen pt-32 pb-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div {...fadeIn} className="text-center mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Flavors</span>
                        <h1 className="text-5xl md:text-7xl font-medium text-stone-dark tracking-tight mb-8">
                            Every Crunch <span className="text-brand-gold">Tells a Story</span>
                        </h1>
                        <p className="text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            From classic original to bold spicy balado — each flavor is crafted from premium fermented tempe and the finest Indonesian spices.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {PRODUCTS.map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="block group">
                                <motion.div
                                    {...fadeIn}
                                    className="bg-white rounded-3xl border border-stone-border hover:border-brand-gold/50 transition-all duration-500 overflow-hidden hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-dark via-transparent to-transparent opacity-40 z-10"></div>
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        {product.tag && (
                                            <span className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-gold text-stone-dark shadow-lg">
                                                {product.tag}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-2xl font-semibold text-stone-dark mb-2">{product.name}</h3>
                                        <p className="text-brand-gold font-medium mb-6">{product.grade}</p>

                                        <div className="flex justify-between items-center pt-6 border-t border-stone-border">
                                            <div>
                                                <p className="text-[10px] text-[#78716C] uppercase tracking-widest mb-1">Origin</p>
                                                <p className="text-sm font-medium text-stone-dark">{product.origin}</p>
                                            </div>
                                            <div className="bg-neutral-50 hover:bg-brand-gold text-[#78716C] hover:text-stone-dark p-3 rounded-full transition-all group-hover:scale-110">
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
