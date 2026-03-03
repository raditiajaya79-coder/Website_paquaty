// ProductDetail.jsx — Halaman detail produk individual
// Menampilkan gambar, deskripsi, harga, dan opsi packaging per produk
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Globe2, MessageCircle, FileText, Package, MapPin } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { PRODUCTS, COMPANY_INFO } from '../data/products';

/**
 * ProductDetail — Komponen halaman detail produk
 * Mengambil data produk dari PRODUCTS array berdasarkan ID di URL
 * Layout compact seperti marketplace (Tokopedia/Shopee style)
 */
const ProductDetail = () => {
    // Ambil parameter ID dari URL (misal /products/1)
    const { id } = useParams();

    // Cari produk yang cocok berdasarkan ID
    const product = PRODUCTS.find(p => p.id === parseInt(id));

    // State untuk pilihan kemasan (default: opsi pertama)
    const [selectedPackaging, setSelectedPackaging] = useState(product?.packagingOptions?.[0] || { label: "50 Gram", value: "50g" });

    // Konfigurasi animasi fade-in untuk motion components
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    // Tampilan fallback jika produk tidak ditemukan
    if (!product) {
        return (
            <div className="pt-40 pb-20 text-center">
                <h2 className="text-2xl font-serif text-stone-dark mb-4">Product Not Found</h2>
                <Link to="/products" className="text-brand-gold-dark font-medium hover:underline">Return to Catalog</Link>
            </div>
        );
    }

    /**
     * handleWhatsAppOrder — Buka WhatsApp dengan pesan pre-filled untuk order
     */
    const handleWhatsAppOrder = () => {
        const message = `Halo ${COMPANY_INFO.name}, saya tertarik dengan produk Keripik Tempe Pakuaty rasa ${product.name} (${selectedPackaging.label}). Mohon info harga dan ketersediaan.`;
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    /**
     * formatPrice — Format angka ke format Rupiah Indonesia
     * Contoh: 12000 → "12.000"
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    // Hitung persentase diskon jika ada originalPrice
    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <>
            {/* SEO metadata */}
            <Helmet>
                <title>{generatePageTitle(`${product.name} — Keripik Tempe Pakuaty`)}</title>
                <meta name="description" content={`Keripik Tempe Pakuaty rasa ${product.name}. ${product.grade}. Harga Rp ${formatPrice(product.price || 0)}.`} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:pb-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tombol kembali ke halaman produk */}
                    <motion.div {...fadeIn} className="mb-8">
                        <Link to="/products" className="inline-flex items-center gap-2 text-[#78716C] hover:text-brand-blue transition-all text-xs font-bold tracking-widest uppercase">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Collection
                        </Link>
                    </motion.div>

                    {/* Layout 2 kolom: gambar (kiri) + detail (kanan) */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="relative rounded-[2.5rem] overflow-hidden bg-white border border-stone-border shadow-xl"
                        >
                            {/* Image Container with Breathing Room to fix "Kesempitan" — Using detailImage for packaging photo */}
                            <div className="w-full aspect-square p-12 flex items-center justify-center bg-stone-50/50">
                                <img
                                    src={product.detailImage || product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                />
                            </div>
                            {/* Badge Quality Assured */}
                            <div className="absolute top-8 left-8">
                                <span className="px-4 py-1.5 bg-stone-dark/80 backdrop-blur-xl text-white text-[10px] font-bold rounded-full uppercase tracking-[0.15em] border border-white/10">
                                    Quality Assured
                                </span>
                            </div>
                            {/* Badge diskon (jika ada) */}
                            {discountPercent > 0 && (
                                <div className="absolute top-8 right-8">
                                    <span className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-lg">
                                        -{discountPercent}%
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* === KOLOM KANAN: Detail Produk === */}
                        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:sticky lg:top-32">
                            {/* Label sub-brand */}
                            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
                                Keripik Tempe Pakuaty
                            </span>

                            {/* Nama produk */}
                            <h1 className="text-3xl md:text-5xl font-serif font-medium text-stone-dark tracking-tight mb-1 leading-[1.1]">
                                {product.name}
                            </h1>

                            {/* Grade / subtitle */}
                            <p className="text-base text-[#78716C] font-light mb-5 italic">{product.grade}</p>

                            {/* === HARGA — Marketplace style: compact, inline === */}
                            {product.price && (
                                <div className="flex items-center gap-3 mb-5">
                                    {/* Harga aktual */}
                                    <span className="text-2xl font-bold text-brand-blue">
                                        Rp{formatPrice(product.price)}
                                    </span>
                                    {/* Harga asli dicoret */}
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-sm text-[#A8A29E] line-through">
                                            Rp{formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    {/* Badge diskon kecil */}
                                    {discountPercent > 0 && (
                                        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                            {discountPercent}%
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Info singkat: origin + packaging — inline horizontal */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#57534E]">
                                {/* Origin */}
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                                    {product.origin}
                                </span>
                                {/* Divider */}
                                <span className="w-1 h-1 bg-[#D6D3D1] rounded-full"></span>
                                {/* Packaging aktif */}
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5 text-brand-blue" />
                                    {selectedPackaging.label}
                                </span>
                            </div>

                            {/* Pilih Kemasan — hanya tampil jika >1 opsi */}
                            {product.packagingOptions.length > 1 && (
                                <div className="mb-6">
                                    <p className="text-xs text-[#78716C] uppercase font-bold tracking-widest mb-3">Pilih Kemasan</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.packagingOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSelectedPackaging(opt)}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectedPackaging.value === opt.value
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

                            {/* Separator tipis */}
                            <div className="border-t border-stone-border mb-6"></div>

                            {/* === DESKRIPSI PRODUK === */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-stone-dark uppercase tracking-widest mb-3">Deskripsi Produk</h3>
                                {product.description ? (
                                    // Deskripsi dari data produk dengan whitespace-pre-line untuk line break
                                    <p className="text-sm text-[#57534E] leading-[1.8] whitespace-pre-line">
                                        {product.description}
                                    </p>
                                ) : (
                                    // Fallback untuk produk tanpa deskripsi
                                    <p className="text-sm text-[#57534E] leading-relaxed">
                                        Premium {product.name} dari {COMPANY_INFO.name}. Setiap batch melalui quality control ketat untuk menjamin standar kualitas terbaik.
                                    </p>
                                )}
                            </div>

                            {/* Badge fitur — compact horizontal */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { icon: CheckCircle2, text: "International Standards" },
                                    { icon: ShieldCheck, text: "Verified Quality" },
                                    { icon: Globe2, text: "Global Logistics" },
                                    { icon: FileText, text: "Full Documentation" }
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#57534E]">
                                        <feat.icon className="w-4 h-4 text-brand-blue shrink-0" />
                                        {feat.text}
                                    </div>
                                ))}
                            </div>

                            {/* === TOMBOL ORDER === */}
                            <div className="flex flex-col gap-3">
                                {/* Tombol WhatsApp */}
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full py-4 bg-stone-dark text-white rounded-2xl font-bold text-sm tracking-wider uppercase hover:bg-brand-blue transition-all shadow-xl hover:shadow-brand-blue/20 flex items-center justify-center gap-2"
                                >
                                    PESAN SEKARANG
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                                {/* Keterangan */}
                                <p className="text-center text-[10px] text-[#78716C]">Terhubung langsung ke {COMPANY_INFO.name} via WhatsApp</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ProductDetail;
