import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Sprout, Microscope, Container, Store, Award, ShieldCheck, Check, FileBadge, Leaf, Scale } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import CTA from '../components/CTA';

const Home = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="bg-stone-light">
            {/* Hero Section */}
            <section className="md:pt-48 md:pb-32 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        Now exporting 2024 Harvest
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:text-7xl lg:text-8xl leading-[1.1] text-5xl font-medium text-[#1C1917] tracking-tight mb-8"
                    >
                        Bridging Nature <br />
                        <span className="text-primary">to Global Markets.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light mb-10"
                    >
                        We facilitate the ethical trade of premium natural products. From the misty hills of cardamom farms to your distribution centers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <button className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-900 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                            Request Catalog
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="w-full md:w-auto bg-white border border-stone-border text-stone-dark px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-light hover:border-primary transition-all">
                            View Sourcing Map
                        </button>
                    </motion.div>
                </div>

                {/* Trust Strip */}
                <div className="mt-20 border-y border-[#E7E5E4] bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {["WholeFoods", "TESCO", "Carrefour", "Waitrose", "TraderJoe's"].map(brand => (
                                <span key={brand} className="text-xl font-semibold tracking-tight">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section id="products" className="relative py-32 bg-[#020617] overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-40 pointer-events-none mix-blend-screen bg-blue-950/20 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-30 pointer-events-none mix-blend-screen bg-accent/10 blur-2xl rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-medium mb-4 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                                2024 Harvest Collection
                            </div>
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                                Cultivated by <span className="text-accent">Nature</span>
                            </h2>
                            <p className="text-lg text-neutral-400 max-w-md font-light leading-relaxed">
                                Premium organic commodities sourced from the world's most biodiverse regions.
                            </p>
                        </div>

                        <Link to="/products" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#A3B14B] hover:border-[#A3B14B] transition-all duration-300 backdrop-blur-sm">
                            <span className="text-neutral-200 font-medium group-hover:text-white">View Full Catalog</span>
                            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.slice(0, 3).map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="group relative h-[500px] rounded-3xl bg-slate-900 border border-white/5 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden block">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 z-10"></div>
                                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />

                                <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        {product.tag && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-stone-dark shadow-lg backdrop-blur-md border border-white/10">
                                                {product.tag}
                                            </span>
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 ml-auto">
                                            <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                                        </div>
                                    </div>

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-3xl font-semibold text-white tracking-tight mb-2">{product.name}</h3>
                                        <p className="text-accent font-medium text-base mb-6">{product.grade}</p>

                                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Origin</p>
                                                <p className="text-sm font-medium text-neutral-200">{product.origin}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">MOQ</p>
                                                <p className="text-sm font-medium text-neutral-200">{product.moq}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supply Chain Journey */}
            <section id="process" className="py-24 bg-stone-dark text-white relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-accent font-medium tracking-wide uppercase text-sm">Transparency First</span>
                        <h2 className="md:text-5xl text-3xl font-medium tracking-tight mt-4">Farm to Shelf Journey</h2>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-neutral-800 via-accent to-neutral-800"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {[
                                { step: "01", title: "Ethical Sourcing", desc: "Direct partnerships with farmers for fair wages.", icon: Sprout },
                                { step: "02", title: "Quality Control", desc: "Rigorous lab testing for purity and moisture.", icon: Microscope },
                                { step: "03", title: "Global Logistics", desc: "Efficient handling and customs clearance.", icon: Container },
                                { step: "04", title: "Retail Ready", desc: "Delivered to your shelves, consumer-ready.", icon: Store },
                            ].map((item, idx) => (
                                <div key={idx} className="relative group text-center md:text-left">
                                    <div className="w-24 h-24 rounded-full bg-slate-900 border border-neutral-800 flex items-center justify-center mb-6 relative z-10 group-hover:border-accent transition-colors duration-300 mx-auto md:mx-0">
                                        <item.icon className="w-10 h-10 text-accent" />
                                    </div>
                                    <span className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-widest">Step {item.step}</span>
                                    <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
                                    <p className="text-lg text-neutral-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Section */}
            <section id="compliance" className="py-32 bg-stone-light/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            {/* Certificate Stack Visual */}
                            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 transform transition-all duration-700 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-neutral-200 -rotate-2 scale-95 opacity-60 transition-transform group-hover:-rotate-6"></div>
                                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent text-stone-dark flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-semibold text-stone-dark mb-2 tracking-tight">Certificate of Registration</h3>
                                    <p className="text-sm italic text-slate-500 mb-8">Excellence in International Trade Standards</p>
                                    <div className="w-full space-y-3 opacity-20 mb-8 px-8">
                                        <div className="h-1.5 bg-black rounded w-full"></div>
                                        <div className="h-1.5 bg-black rounded w-5/6 mx-auto"></div>
                                        <div className="h-1.5 bg-black rounded w-4/5 mx-auto"></div>
                                    </div>
                                </div>
                                <div className="absolute -right-4 top-12 bg-white px-4 py-3 rounded-xl shadow-xl border border-neutral-100 flex items-center gap-3">
                                    <div className="bg-blue-50 text-blue-600 p-1 rounded-full"><Check className="w-4 h-4" /></div>
                                    <div className="text-left"><p className="text-xs font-semibold text-stone-dark">Verified 2024</p></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                                    <ShieldCheck className="w-4 h-4" />
                                    Global Compliance
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-stone-dark mb-6">Certified Excellence</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">We maintain the highest international standards. Download our certificates for verification.</p>
                            </div>

                            <div className="space-y-4">
                                {[{ title: "ISO 22000:2018", sub: "Food Safety Management", icon: FileBadge },
                                { title: "USDA Organic", sub: "Certified Organic Exporter", icon: Leaf },
                                { title: "Fair Trade Certified", sub: "Ethical Trading Standards", icon: Scale }
                                ].map((cert, idx) => (
                                    <div key={idx} className="group bg-white p-4 pr-6 rounded-xl border border-stone-border hover:border-accent transition-all flex items-center gap-5 cursor-pointer">
                                        <div className="w-14 h-16 bg-stone-light rounded border border-stone-border flex items-center justify-center shrink-0">
                                            <cert.icon className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-stone-dark group-hover:text-accent transition-colors">{cert.title}</h3>
                                            <p className="text-sm text-slate-500">{cert.sub}</p>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-stone-light border border-stone-border flex items-center justify-center group-hover:bg-accent group-hover:text-stone-dark transition-all transform group-hover:scale-105">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <CTA />
        </div>
    );
};

export default Home;
