import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/products'; // Info perusahaan
import { generatePageTitle } from '../utils/seo';
import { useLanguage } from '../context/LanguageContext';
import React from 'react';
import useSWR from 'swr';

/**
 * Fetcher standar untuk SWR
 */
const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Products — Halaman katalog semua produk
 * Menampilkan grid semua varian Keripik Tempe Pakuaty dengan harga.
 * Menggunakan data statis dan dukungan multi-bahasa.
 */
const Products = () => {
    const { t } = useLanguage();

    // SWR Hook untuk Data Fetching & Background Revalidation
    const { data: products = [], isLoading: loading } = useSWR(
        'http://localhost:5000/api/products',
        fetcher,
        {
            // Opsi tambahan untuk polling background:
            refreshInterval: 60000, // Cek tiap 60 detik otomatis
            revalidateOnFocus: true, // Auto-update ketika pindah tab balik
        }
    );

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    /**
     * formatPrice — Format angka ke format Rupiah Indonesia
     * Contoh: 12000 → "12.000"
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    return (
        <>
            {/* SEO metadata */}
            <Helmet>
                <title>{generatePageTitle(t('seo.products_title'))}</title>
                <meta name="description" content={t('seo.home_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header section — judul dan deskripsi halaman */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">{t('products.header_label')}</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            {t('products.header_title')}<span className="text-brand-blue">{t('products.header_title_accent')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            {t('products.header_desc')}
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#78716C] font-medium tracking-widest uppercase text-xs">Belum ada produk yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.map((product) => (
                                <Link to={`/products/${product.id}`} key={product.id} className="block group">
                                    <motion.div
                                        {...fadeIn}
                                        className="bg-white rounded-3xl border border-stone-border hover:border-brand-gold/50 transition-all duration-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform-gpu h-full flex flex-col"
                                    >
                                        <div className="aspect-square relative overflow-hidden bg-stone-50/50 p-8 flex items-center justify-center">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105 drop-shadow-2xl"
                                            />
                                            {product.tag && (
                                                <span className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-gold text-stone-dark shadow-lg">
                                                    {product.tag}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold text-stone-dark mb-1">{product.name}</h3>
                                                <p className="text-brand-gold-dark text-sm font-medium mb-3">{product.grade}</p>

                                                {product.price && (
                                                    <div className="mb-6">
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-xl font-bold text-stone-dark">
                                                                Rp {formatPrice(product.price)}
                                                            </span>
                                                            {product.original_price && product.original_price > product.price && (
                                                                <span className="text-xs text-[#A8A29E] line-through">
                                                                    Rp {formatPrice(product.original_price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#78716C] mt-1">/ {t('products.price_gram')}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-stone-border mt-auto">
                                                <div>
                                                    <p className="text-[10px] text-[#78716C] uppercase tracking-widest mb-1">{t('products.origin')}</p>
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
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;
