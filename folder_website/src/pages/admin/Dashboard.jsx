import React from 'react'; // React library
import { motion } from 'framer-motion'; // Animasi
import { TrendingUp, Package, Image, Users, Award, Calendar, Loader2 } from 'lucide-react'; // Ikon stats

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
        { label: 'Total Produk', key: 'totalProducts', icon: Package, color: 'bg-blue-500', trend: '+5 bulan ini' },
        { label: 'Galeri Foto', key: 'totalGalleries', icon: Image, color: 'bg-indigo-500', trend: 'Baru ditambahkan' },
        { label: 'Event Berlangsung', key: 'totalEvents', icon: Calendar, color: 'bg-emerald-500', trend: 'On track' },
        { label: 'Sertifikat Aktif', key: 'totalCertificates', icon: Award, color: 'bg-amber-500', trend: '+1 valid' },
    ];

    return (
        <div className="space-y-5">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Ringkasan Dashboard</h1>
                <p className="text-xs text-[#64748B] mt-1 font-bold">Selamat datang kembali, berikut rincian aktifitas terkini.</p>
            </div>

            {/* Stats Grid — Kartu-kartu statistik utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {statsConfig.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-center"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3.5 rounded-2xl ${item.color}/10 border border-${item.color.split('-')[1]}-200`}>
                                        <item.icon className={`w-6 h-6 text-${item.color.split('-')[1]}-600`} />
                                    </div>
                                    <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider">{item.trend}</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1E293B] mb-1">{statsData ? statsData[item.key] : '0'}</h3>
                                <p className="text-[#64748B] text-xs font-bold">{item.label}</p>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Main Grid — Layout dua kolom untuk detail tambahan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: News/Announcements Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e40af] rounded-2xl p-7 overflow-hidden relative shadow-lg shadow-blue-900/10">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-lg font-black text-white mb-1 tracking-tight">Pantau Perkembangan Bisnis</h2>
                                <p className="text-blue-100/80 mb-4 text-[12px] font-semibold">Kelola semua konten website Anda di satu tempat secara efisien.</p>
                                <div className="flex gap-3 justify-center md:justify-start">
                                    <button className="px-5 py-2 bg-white text-[#1e40af] rounded-xl font-black text-xs shadow-xl shadow-blue-900/10 hover:bg-blue-50 transition-colors">Laporan Detil</button>
                                    <button className="px-5 py-2 bg-blue-400/20 border border-white/20 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-colors">Bantuan</button>
                                </div>
                            </div>
                            <div className="w-1/4 hidden md:flex justify-center">
                                <div className="p-6 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                                    <TrendingUp className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-5 px-1">
                            <h3 className="font-black text-[#1E293B] text-sm">Log Aktivitas Terbaru</h3>
                            <button className="text-[11px] font-black text-[#2563EB] hover:underline uppercase tracking-widest">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                            {statsData?.activityLogs?.length > 0 ? (
                                statsData.activityLogs.map((log, i) => (
                                    <div key={log.id} className="flex items-center gap-4 p-3.5 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                            <Users className="w-6 h-6 text-[#2563EB]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-[#1E293B]">
                                                {log.admin_name} <span className="font-normal text-slate-500">melakukan</span> {log.action}{' '}
                                                <span className="text-[#2563EB]">"{log.target_name}"</span>
                                            </p>
                                            <p className="text-[11px] text-[#64748B] font-black uppercase tracking-widest mt-0.5">
                                                {new Date(log.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 font-bold text-xs italic">
                                    Belum ada aktivitas yang tercatat.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Quick Access / Calendar */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                        <h3 className="font-black text-[#1E293B] text-base mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {['Produk Baru', 'Gallery Upload', 'Sertifikat', 'Event'].map((item, i) => (
                                <button key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-[#64748B] text-center hover:bg-[#2563EB] hover:text-white transition-all uppercase tracking-widest">{item}</button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                        <h3 className="font-black text-[#1E293B] text-base mb-4">Pengumuman Internal</h3>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center">
                            <p className="text-[11px] text-orange-900 leading-relaxed font-bold italic">
                                "Pembaruan database akan dilakukan pada malam Minggu jam 23:00 WIB. Harap simpan pekerjaan Anda."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
