// Products.jsx — Halaman katalog semua produk
// Menampilkan grid semua varian Keripik Tempe Pakuaty dengan harga
// Data diambil dari backend API /api/products
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/products'; // Info perusahaan (statis)
import { api } from '../utils/api'; // Utilitas API backend
import { generatePageTitle } from '../utils/seo';

/**
 * Products — Halaman katalog produk
 * Menampilkan semua varian keripik tempe dalam grid card
 * Data produk diambil dari database via API
 */
const Products = () => {
    const [products, setProducts] = useState([]); // State daftar produk dari API
    const [loading, setLoading] = useState(true); // State loading saat fetch data

    // Ambil data produk dari backend saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/products'); // GET /api/products
                setProducts(data); // Simpan data produk ke state
            } catch (error) {
                console.error('Gagal memuat produk:', error.message);
            } finally {
                setLoading(false); // Matikan loading
            }
        };
        fetchProducts();
    }, []);

    // Konfigurasi animasi fade-in untuk motion components
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
            {/* SEO metadata — title dan description untuk halaman katalog */}
            <Helmet>
                <title>{generatePageTitle('Our Products')}</title>
                <meta name="description" content={`Discover the authentic taste of Indonesia. Explore our range of premium, export-quality tempe chips at ${COMPANY_INFO.name}. Crafted with heritage, powered by innovation.`} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header section — judul dan deskripsi halaman */}
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Flavors</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            Every Crunch <span className="text-brand-blue">Tells a Story</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            From classic original to bold spicy balado — each flavor is crafted from premium fermented tempe and the finest Indonesian spices.
                        </p>
                    </motion.div>

                    {/* Loading state — tampilkan skeleton saat data belum tersedia */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-3xl border border-stone-border overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-stone-100"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-5 bg-stone-100 rounded w-2/3"></div>
                                        <div className="h-4 bg-stone-100 rounded w-1/2"></div>
                                        <div className="h-6 bg-stone-100 rounded w-1/3 mt-4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Grid produk — 3 kolom di desktop, 2 di tablet, 1 di mobile */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.map((product) => (
                                // Setiap card adalah link ke halaman detail produk
                                <Link to={`/products/${product.id}`} key={product.id} className="block group">
                                    <motion.div
                                        {...fadeIn}
                                        className="bg-white rounded-3xl border border-stone-border hover:border-brand-gold/50 transition-all duration-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform-gpu"
                                    >
                                        {/* Image Container with "Breathing Room" */}
                                        <div className="aspect-square relative overflow-hidden bg-stone-50/50 p-8 flex items-center justify-center">
                                            {/* Image — refined zoom for elegant gallery feel */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105 drop-shadow-2xl"
                                            />

                                            {/* Badge tag produk (Best Seller, Spicy, dll) di pojok kiri atas */}
                                            {product.tag && (
                                                <span className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-gold text-stone-dark shadow-lg">
                                                    {product.tag}
                                                </span>
                                            )}
                                        </div>

                                        {/* Konten card: nama, grade, harga, origin */}
                                        <div className="p-6">
                                            {/* Nama varian dan grade */}
                                            <h3 className="text-xl font-semibold text-stone-dark mb-1">{product.name}</h3>
                                            <p className="text-brand-gold-dark text-sm font-medium mb-3">{product.grade}</p>

                                            {/* Section harga — tampilkan harga coret + harga aktual */}
                                            {product.price && (
                                                <div className="mb-6">
                                                    <div className="flex items-baseline gap-3">
                                                        {/* Harga aktual setelah diskon */}
                                                        <span className="text-xl font-bold text-stone-dark">
                                                            Rp {formatPrice(product.price)}
                                                        </span>
                                                        {/* Harga asli dicoret (jika ada dan lebih besar dari harga aktual) */}
                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                            <span className="text-sm text-[#A8A29E] line-through font-medium">
                                                                Rp {formatPrice(product.originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Keterangan ukuran kemasan */}
                                                    <p className="text-xs text-[#78716C] mt-1">/ 50 gram</p>
                                                </div>
                                            )}

                                            {/* Footer card: origin + arrow icon */}
                                            <div className="flex justify-between items-center pt-4 border-t border-stone-border">
                                                <div>
                                                    {/* Label origin */}
                                                    <p className="text-[10px] text-[#78716C] uppercase tracking-widest mb-1">Origin</p>
                                                    <p className="text-sm font-medium text-stone-dark">{product.origin}</p>
                                                </div>
                                                {/* Arrow icon — visual cue untuk klik ke detail */}
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
