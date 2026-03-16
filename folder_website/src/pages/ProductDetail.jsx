import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Globe2, MessageCircle, FileText, Package, MapPin } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { COMPANY_INFO } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import useSWR from 'swr';
import { API_BASE_URL } from '../utils/api';

const fetcher = (url) => fetch(url).then(res => res.json());

/**
 * ProductDetail — Halaman detail produk
 * Menampilkan rincian produk berdasarkan ID yang dipilih.
 * Layout compact dan fungsional dengan dukungan multi-bahasa.
 */
const ProductDetail = () => {
    const { t, lang } = useLanguage();
    const { id } = useParams();

    const [selectedPackaging, setSelectedPackaging] = useState(null);

    // SWR Data Fetching
    const { data: product, isLoading: loading, error } = useSWR(
        `${API_BASE_URL}/products/${id}`,
        fetcher,
        { refreshInterval: 60000, revalidateOnFocus: true }
    );

    // Set auto packaging to the first option when product loads
    useEffect(() => {
        if (product && product.packaging_options) {
            const options = typeof product.packaging_options === 'string'
                ? JSON.parse(product.packaging_options)
                : (product.packaging_options || []);

            if (options.length > 0 && !selectedPackaging) {
                setSelectedPackaging(options[0]);
            }
        }
    }, [product]);

    // Konfigurasi animasi
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    /**
     * formatPrice — Format angka ke format Rupiah Indonesia
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    /**
     * handleWhatsAppOrder — Buka WhatsApp dengan pesan pre-filled untuk order
     */
    const handleWhatsAppOrder = () => {
        const productName = product.name;
        const message = lang === 'id'
            ? `Halo ${COMPANY_INFO.name}, saya tertarik dengan produk Keripik Tempe Pakuaty rasa ${productName} (${selectedPackaging?.label || ''}). Mohon info harga dan ketersediaan.`
            : `Hello ${COMPANY_INFO.name}, I am interested in Pakuaty Tempe Chips ${productName} flavor (${selectedPackaging?.label || ''}). Please provide information on price and availability.`;
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };


    // Loading state UI
    if (loading) {
        return (
            <div className="bg-neutral-bone min-h-screen pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-stone-dark/40">{t('event.detail.loading')}</p>
                </div>
            </div>
        );
    }

    // Tampilan fallback jika produk tidak ditemukan
    if (!product) {
        return (
            <div className="pt-40 pb-20 text-center bg-neutral-bone min-h-screen">
                <h2 className="text-2xl font-serif text-stone-dark mb-4">{t('event.detail.not_found')}</h2>
                <Link to="/products" className="text-brand-gold-dark font-medium hover:underline">{t('product.detail.back')}</Link>
            </div>
        );
    }
    // Hitung persentase diskon jika ada original_price
    const discountPercent = product.original_price && product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const packagingOptions = typeof product.packaging_options === 'string'
        ? JSON.parse(product.packaging_options)
        : (product.packaging_options || []);

    return (
        <>
            {/* SEO metadata */}
            <Helmet>
                <title>{generatePageTitle(`${(lang === 'en' && product.name_en) ? product.name_en : product.name} — Keripik Tempe Pakuaty`)}</title>
                <meta name="description" content={`${(lang === 'en' && product.name_en) ? product.name_en : product.name}. ${(lang === 'en' && product.grade_en) ? product.grade_en : product.grade}. Harga Rp ${formatPrice(product.price || 0)}.`} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:pb-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tombol kembali */}
                    <motion.div {...fadeIn} className="mb-8">
                        <Link to="/products" className="inline-flex items-center gap-2 text-[#78716C] hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            {t('product.detail.back')}
                        </Link>
                    </motion.div>

                    {/* Layout 2 kolom */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="relative rounded-[2.5rem] overflow-hidden bg-white border border-stone-border shadow-xl"
                        >
                            {/* Image Container */}
                            <div className="w-full aspect-square p-12 flex items-center justify-center bg-stone-50/50">
                                <img
                                    src={product.detail_image || product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        if (e.target.src !== '/images/pure logo pakuaty.png') {
                                            e.target.src = '/images/pure logo pakuaty.png';
                                            e.target.className += ' opacity-20 grayscale';
                                        }
                                    }}
                                />
                            </div>
                            <div className="absolute top-8 left-8">
                                <span className="px-4 py-1.5 bg-stone-dark/80 backdrop-blur-xl text-white text-[10px] font-bold rounded-full uppercase tracking-[0.15em] border border-white/10">
                                    Quality Assured
                                </span>
                            </div>
                            {discountPercent > 0 && (
                                <div className="absolute top-8 right-8">
                                    <span className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-lg">
                                        -{discountPercent}%
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Rincian Produk */}
                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:sticky lg:top-32">
                            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
                                Keripik Tempe Pakuaty
                            </span>

                            <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-dark tracking-tight mb-1 leading-[1.1]">
                                {(lang === 'en' && product.name_en) ? product.name_en : product.name}
                            </h1>

                            <p className="text-base text-[#78716C] font-light mb-5 italic">
                                {(lang === 'en' && product.grade_en) ? product.grade_en : product.grade}
                            </p>

                            {/* Harga */}
                            {product.price && (
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-2xl font-bold text-brand-blue">
                                        Rp{formatPrice(product.price)}
                                    </span>
                                    {product.original_price && product.original_price > product.price && (
                                        <span className="text-sm text-[#A8A29E] line-through">
                                            Rp{formatPrice(product.original_price)}
                                        </span>
                                    )}
                                    {discountPercent > 0 && (
                                        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                            {discountPercent}%
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Info singkat */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#57534E]">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                                    {product.origin}
                                </span>
                                <span className="w-1 h-1 bg-[#D6D3D1] rounded-full"></span>
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5 text-brand-blue" />
                                    {selectedPackaging?.label || '50 Gram'}
                                </span>
                            </div>

                            {/* Pilih Kemasan */}
                            {packagingOptions.length > 1 && (
                                <div className="mb-6">
                                    <p className="text-xs text-[#78716C] uppercase font-bold tracking-widest mb-3">{t('product.detail.options')}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {packagingOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSelectedPackaging(opt)}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectedPackaging?.value === opt.value
                                                    ? 'bg-brand-blue border-brand-blue text-white shadow-md'
                                                    : 'bg-white border-stone-border text-stone-dark hover:border-brand-blue/40'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-stone-border mb-6"></div>

                            {/* Deskripsi */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-stone-dark uppercase tracking-widest mb-3">{t('product.detail.description')}</h3>
                                <p className="text-sm text-[#57534E] leading-[1.8] whitespace-pre-line">
                                    {(lang === 'en' && product.description_en) ? product.description_en : product.description}
                                </p>
                            </div>

                            {/* Fitur */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { icon: CheckCircle2, text: lang === 'id' ? "Standar Internasional" : "International Standards" },
                                    { icon: ShieldCheck, text: lang === 'id' ? "Kualitas Terverifikasi" : "Verified Quality" },
                                    { icon: Globe2, text: lang === 'id' ? "Logistik Global" : "Global Logistics" },
                                    { icon: FileText, text: lang === 'id' ? "Dokumentasi Lengkap" : "Full Documentation" }
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#57534E]">
                                        <feat.icon className="w-4 h-4 text-brand-blue shrink-0" />
                                        {feat.text}
                                    </div>
                                ))}
                            </div>

                            {/* Tombol Order */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full py-4 bg-stone-dark text-white rounded-2xl font-bold text-sm tracking-wider uppercase hover:bg-brand-blue transition-all shadow-xl hover:shadow-brand-blue/20 flex items-center justify-center gap-2"
                                >
                                    {t('product.detail.order')}
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                                <p className="text-center text-[10px] text-[#78716C]">{t('product.detail.connected')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ProductDetail;
