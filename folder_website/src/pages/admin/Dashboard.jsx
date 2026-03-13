import React from 'react'; // React library
import { motion } from 'framer-motion'; // Animasi
import { TrendingUp, Package, Image, Users, Award, Calendar, Loader2 } from 'lucide-react'; // Ikon stats
import { Link } from 'react-router-dom'; // Komponen navigasi internal
/**
 * Dashboard Component — Halaman ringkasan statistik admin.
 * Menampilkan kartu informasi utama untuk memberikan gambaran cepat.
 */
const Dashboard = () => {
    const [statsData, setStatsData] = React.useState(null); // State untuk data dari API
    const [loading, setLoading] = React.useState(true); // State loading

    // Ambil statistik saat komponen dimuat
    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Gagal memuat statistik');
                const data = await response.json();
                setStatsData(data);
            } catch (error) {
                console.error('❌ Dashboard Stats Error:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Konfigurasi visual kartu statistik
    const statsConfig = [
        { label: 'Total Produk', key: 'totalProducts', icon: Package, color: 'bg-blue-500', trend: 'Tersedia' },
        { label: 'Galeri Foto', key: 'totalGalleries', icon: Image, color: 'bg-indigo-500', trend: 'Tersedia' },
        { label: 'Event Berlangsung', key: 'totalEvents', icon: Calendar, color: 'bg-emerald-500', trend: 'Aktif' },
        { label: 'Sertifikat Aktif', key: 'totalCertificates', icon: Award, color: 'bg-amber-500', trend: 'Tersedia' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">Ringkasan Dashboard</h1>
                    <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5 font-bold uppercase tracking-wider opacity-70">Selamat datang kembali, berikut rincian aktifitas terkini.</p>
                </div>
                <div className="hidden sm:block">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid — Kartu-kartu statistik utama */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {statsConfig.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-3 sm:mb-6">
                                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${item.color}/10 border border-${item.color.split('-')[1]}-200`}>
                                        <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color.split('-')[1]}-600`} />
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] text-[#64748B] font-black uppercase tracking-wider text-right">{item.trend}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#1E293B] mb-0.5">{statsData ? statsData[item.key] : '0'}</h3>
                                    <p className="text-[#64748B] text-[10px] sm:text-xs font-bold uppercase tracking-tight opacity-80">{item.label}</p>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Main Grid — Layout dua kolom untuk detail tambahan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Kolom Kiri: News/Announcements Preview */}
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                    <div className="bg-[#1e40af] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 overflow-hidden relative shadow-lg shadow-blue-900/10">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">Pantau Perkembangan Bisnis</h2>
                                <p className="text-blue-100/80 mb-6 text-[11px] sm:text-[13px] font-medium leading-relaxed max-w-md">Kelola semua konten website Anda di satu tempat secara efisien dengan sistem manajemen terpusat.</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <Link to="/admin/products" className="px-6 py-2.5 bg-white text-[#1e40af] rounded-xl font-black text-[11px] shadow-xl shadow-blue-900/10 hover:bg-blue-50 transition-all active:scale-95 text-center">Kelola Produk</Link>
                                    <Link to="/admin/contact" className="px-6 py-2.5 bg-blue-400/20 border border-white/20 text-white rounded-xl font-bold text-[11px] hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm text-center">Pesan Masuk</Link>
                                </div>
                            </div>
                            <div className="w-1/3 hidden md:flex justify-center">
                                <div className="p-8 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                                    <TrendingUp className="w-14 h-14 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wider">Log Aktivitas Terbaru</h3>
                            <button className="text-[10px] font-black text-[#2563EB] hover:underline uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                            {statsData?.activityLogs?.length > 0 ? (
                                statsData.activityLogs.map((log, i) => (
                                    <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-all group">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
                                                {log.admin_name} <span className="font-normal text-slate-500">melakukan</span> {log.action}{' '}
                                                <span className="text-[#2563EB] font-black italic">"{log.target_name}"</span>
                                            </p>
                                            <p className="text-[9px] sm:text-[10px] text-[#64748B] font-black uppercase tracking-widest mt-1 opacity-70">
                                                {new Date(log.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-300 font-bold text-xs italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    Belum ada aktivitas yang tercatat.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Quick Access / Calendar */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6">
                        <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wider mb-5">Akses Cepat</h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {[
                                { label: 'Produk Baru', color: 'hover:bg-blue-600', path: '/admin/products/add' },
                                { label: 'Gallery', color: 'hover:bg-indigo-600', path: '/admin/gallery' },
                                { label: 'Sertifikat', color: 'hover:bg-amber-600', path: '/admin/certificates' },
                                { label: 'Event Baru', color: 'hover:bg-emerald-600', path: '/admin/events/add' }
                            ].map((item, i) => (
                                <Link to={item.path} key={i} className={`p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-[#64748B] flex items-center justify-center hover:text-white transition-all uppercase tracking-widest active:scale-95 ${item.color}`}>{item.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Widget Panduan Singkat - Memberi arahan dasar penggunaan panel admin */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6">
                        <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wider mb-4">Panduan Singkat</h3>
                        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl relative overflow-hidden">
                            {/* Efek dekoratif lingkaran di pojok kanan atas */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -mr-8 -mt-8"></div>

                            {/* Teks panduan statis */}
                            <p className="text-[11px] text-blue-900 leading-relaxed font-bold italic relative z-10">
                                "Selamat datang di Panel Admin. Gunakan menu navigasi untuk mengelola konten katalog, detail produk, serta memantau log aktivitas."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
