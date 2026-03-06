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
    Users
} from 'lucide-react'; // Ikon statistik

/**
 * Halaman utama dashboard admin.
 * Menampilkan ringkasan statistik data dari backend.
 */
const DashboardHome = () => {
    // State untuk menyimpan data statistik
    const [stats, setStats] = useState({
        products: 0,
        articles: 0,
        galleries: 0,
        certificates: 0,
        events: 0,
        contacts: 0
    });

    const [loading, setLoading] = useState(true); // Loading state

    // Mengambil data ringkasan dari backend saat mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch data secara paralel untuk efisiensi
                const [p, a, g, c, e, co] = await Promise.all([
                    api.get('/products'),
                    api.get('/articles'),
                    api.get('/galleries'),
                    api.get('/certificates'),
                    api.get('/events'),
                    api.get('/contacts')
                ]);

                setStats({
                    products: p.length || 0,
                    articles: a.length || 0,
                    galleries: g.length || 0,
                    certificates: c.length || 0,
                    events: e.length || 0,
                    contacts: co.length || 0
                });
            } catch (err) {
                console.error("Gagal mengambil statistik:", err);
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        fetchStats();
    }, []);

    // Konfigurasi kartu statistik
    const cards = [
        { label: 'Total Produk', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Artikel Berita', value: stats.articles, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Media Galeri', value: stats.galleries, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Sertifikat', value: stats.certificates, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Event Mendatang', value: stats.events, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Platform Kontak', value: stats.contacts, icon: LinkIcon, color: 'text-sky-600', bg: 'bg-sky-50' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-stone-dark/40">Memuat Data Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Welcome Section */}
            <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-stone-dark">Selamat Datang Kembali!</h1>
                    <p className="text-stone-dark/50 font-medium">Panel kontrol PT Bala Aditi Pakuaty. Kelola aset digital Anda di sini.</p>
                </div>
                <div className="flex items-center gap-4 bg-brand-gold/10 px-6 py-4 rounded-xl border border-brand-gold/10">
                    <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center text-stone-dark">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/40">Status Sistem</p>
                        <p className="text-lg font-bold text-stone-dark">Operational</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-sm font-medium text-stone-dark/50 mb-1">{card.label}</p>
                        <p className="text-2xl font-black text-stone-dark">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions / Integration Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-dark mb-6 flex items-center gap-2">
                        <Users size={20} className="text-brand-blue" /> Info Pengguna
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                            <span className="text-sm font-medium text-stone-dark/60">Hak Akses</span>
                            <span className="text-sm font-bold text-stone-dark bg-brand-gold/20 px-3 py-1 rounded-md">Super Admin</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                            <span className="text-sm font-medium text-stone-dark/60">Server Status</span>
                            <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Connected
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-blue p-8 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2 text-white">Pusat Bantuan</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-6">Jika Anda memerlukan bantuan teknis mengenai produk atau konten, hubungi tim support kami.</p>
                        </div>
                        <button className="inline-flex items-center justify-center p-3 bg-white text-brand-blue rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all">
                            Hubungi Developer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
