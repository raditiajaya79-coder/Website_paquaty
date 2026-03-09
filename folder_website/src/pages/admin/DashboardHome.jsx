import React, { useState, useEffect } from 'react'; // React hooks
import { motion } from 'framer-motion'; // Library animasi
import { api } from '../../utils/api'; // Utilitas API
import {
    Package,
    FileText,
    Image as ImageIcon,
    Award,
    Calendar,
    Link as LinkIcon,
    TrendingUp,
    Users,
    ShieldCheck,
    ArrowUpRight,
    MessageSquare
} from 'lucide-react'; // Ikon statistik
import { useAdmin } from '../../context/AdminContext'; // Import Admin Context

/**
 * DashboardHome — Halaman utama dashboard admin.
 * Menampilkan ringkasan statistik data dari backend.
 * Layout diatur ulang agar lebih proporsional dan informatif.
 */
const DashboardHome = () => {
    const { profile } = useAdmin(); // Get profile data for welcome message
    // State untuk menyimpan data statistik dari API
    const [stats, setStats] = useState({
        products: 0,
        articles: 0,
        galleries: 0,
        certificates: 0,
        events: 0,
        contacts: 0
    });

    const [loading, setLoading] = useState(true); // Status loading data

    // Mengambil data ringkasan dari backend secara paralel saat pertama kali mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Promise.all: fetch 6 endpoint sekaligus untuk efisiensi
                const [p, a, g, c, e, co] = await Promise.all([
                    api.get('/products'),
                    api.get('/articles'),
                    api.get('/galleries'),
                    api.get('/certificates'),
                    api.get('/events'),
                    api.get('/contacts')
                ]);

                // Set hasil ke state, fallback 0 jika undefined
                setStats({
                    products: p.length || 0,
                    articles: a.length || 0,
                    galleries: g.length || 0,
                    certificates: c.length || 0,
                    events: e.length || 0,
                    contacts: co.length || 0
                });
            } catch (err) {
                console.error("Gagal mengambil statistik:", err); // Log error tanpa crash
            } finally {
                setLoading(false); // Matikan loading apapun hasilnya
            }
        };

        fetchStats();
    }, []);

    // Konfigurasi kartu statistik: label, value, ikon, dan warna gradient
    const cards = [
        { label: 'Katalog Produk', value: stats.products, icon: Package, gradient: 'from-blue-500 to-indigo-600', color: 'text-blue-600' },
        { label: 'Artikel Berita', value: stats.articles, icon: FileText, gradient: 'from-emerald-500 to-teal-600', color: 'text-emerald-600' },
        { label: 'Media Galeri', value: stats.galleries, icon: ImageIcon, gradient: 'from-violet-500 to-purple-600', color: 'text-violet-600' },
        { label: 'Sertifikasi', value: stats.certificates, icon: Award, gradient: 'from-amber-500 to-orange-600', color: 'text-amber-600' },
        { label: 'Event Agenda', value: stats.events, icon: Calendar, gradient: 'from-rose-500 to-pink-600', color: 'text-rose-600' },
        { label: 'Kanal Kontak', value: stats.contacts, icon: LinkIcon, gradient: 'from-indigo-500 to-blue-600', color: 'text-indigo-600' }
    ];

    // Tampilan loading saat data belum siap
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 border-[3px] border-slate-100 rounded-full"></div>
                        <div className="w-10 h-10 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Memuat Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero Section — Welcome message dengan nuansa gelap mewah */}
            <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-10 group min-h-[280px] flex items-center">
                {/* Dekorasi cahaya keemasan di pojok kanan atas */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[120px] -mr-40 -mt-40 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between items-start gap-8 w-full">
                    <div className="max-w-xl">
                        {/* Label subtitle dengan animasi muncul */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="h-0.5 w-8 bg-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">Administrative Portal</span>
                        </motion.div>
                        {/* Judul sapaan — memanggil nama dari context */}
                        <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-none mb-4">
                            Halo, <span className="text-brand-gold">{profile?.fullName || 'Administrator'}</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-sm lg:text-base leading-relaxed">
                            Pantau performa dan kelola aset digital PT Bala Aditi Pakuaty. Semua kendali bisnis ada dalam genggaman Anda hari ini.
                        </p>
                    </div>

                    {/* Badge status operasional sistem */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">System Status</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                                <span className="text-lg font-bold text-white tracking-tight">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Kartu Statistik — menampilkan ringkasan data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5, scale: 1.02 }} // Hover effect melayang
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group"
                    >
                        {/* Lingkaran Ikon dengan gradient */}
                        <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
                            <card.icon size={22} />
                        </div>
                        {/* Label kecil */}
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{card.label}</p>
                        {/* Nilai angka statistik */}
                        <h3 className="text-2xl font-bold text-stone-dark tracking-tight">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Area Konten Tambahan — Informasi bantuan dan tips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kartu 'Informasi Cepat' (Lebar 2 kolom) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/5 text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} /> Keamanan Sistem Aktif
                        </div>
                        <h3 className="text-2xl font-bold text-stone-dark leading-tight">Kelola konten Anda dengan satu klik.</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Pastikan data produk dan artikel selalu diperbarui untuk memberikan informasi terbaik kepada pelanggan. Anda dapat mengunggah gambar langsung dari komputer.
                        </p>
                        <button className="flex items-center gap-2 text-brand-blue font-bold text-sm group">
                            Pelajari Selengkapnya <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                    {/* Visual ilustrasi miniatur statistik */}
                    <div className="w-full md:w-48 aspect-video bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                        <TrendingUp size={48} />
                    </div>
                </div>

                {/* Kartu 'Dukungan Teknis' */}
                <div className="bg-brand-blue rounded-3xl p-8 text-white relative overflow-hidden group">
                    {/* Background glow di kartu biru */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10 space-y-5">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <MessageSquare size={24} className="text-brand-gold" />
                        </div>
                        <h3 className="text-xl font-bold">Butuh Bantuan?</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Hubungi tim IT jika Anda menemui kendala teknis atau kesalahan sinkronisasi data pada dashboard.
                        </p>
                        <a href="mailto:support@pakuaty.com" className="block w-full py-3 bg-white text-brand-blue text-center rounded-xl font-bold text-sm shadow-lg shadow-black/10 active:scale-[0.98] transition-all">
                            Hubungi Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
