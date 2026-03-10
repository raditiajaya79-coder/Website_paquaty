import React, { useState, useEffect } from 'react'; // React hooks
import { Link, useLocation } from 'react-router-dom'; // Utilitas navigasi
import {
    LayoutDashboard,
    Package,
    FileText,
    Image as ImageIcon,
    Award,
    Calendar,
    Link as LinkIcon,
    Bell,
    User,
    LogOut
} from 'lucide-react'; // Ikon modern dari lucide-react
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi transisi

/**
 * Sidebar — Komponen navigasi utama dashboard admin.
 * Desain compact, modern, dengan floating container dan soft visual.
 */
/**
 * Sidebar — Komponen navigasi utama dashboard admin.
 * Desain compact, modern, dengan floating container dan soft visual.
 * 
 * Props:
 * - isOpen: Boolean untuk mengontrol visibilitas di mobile
 * - onClose: Fungsi untuk menutup sidebar di mobile
 */
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation(); // Hook untuk mendapatkan path aktif

    // State profil admin, default jika belum ada data
    const [profile, setProfile] = useState({
        fullName: 'Administrator',
        role: 'Super Admin'
    });

    // Ambil data profil dari localStorage saat mount
    useEffect(() => {
        const adminData = localStorage.getItem('admin_user'); // Cek localStorage
        if (adminData) {
            try {
                setProfile(JSON.parse(adminData)); // Parse dan set ke state
            } catch (e) {
                console.error("Gagal memuat profil di Sidebar"); // Error handling
            }
        }
    }, []);

    // Daftar menu navigasi dengan path, ikon, dan nama
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Produk', icon: Package, path: '/admin/products' },
        { name: 'Artikel', icon: FileText, path: '/admin/articles' },
        { name: 'Galeri', icon: ImageIcon, path: '/admin/gallery' },
        { name: 'Sertifikat', icon: Award, path: '/admin/certificates' },
        { name: 'Event', icon: Calendar, path: '/admin/events' },
        { name: 'Kontak', icon: LinkIcon, path: '/admin/contacts' },
        { name: 'Pengumuman', icon: Bell, path: '/admin/announcement' },
        { name: 'Profil', icon: User, path: '/admin/profile' },
    ];

    return (
        <>
            {/* Overlay untuk mobile saat sidebar terbuka */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Aside container: fixed sidebar, tampil di lg+ atau saat isOpen di mobile */}
            <aside className={`
                w-72 h-screen p-4 flex flex-col fixed lg:sticky top-0 z-[70] transition-transform duration-500 ease-[0.22, 1, 0.36, 1]
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Floating container utama — glassmorphism effect */}
                <div className="flex-1 bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden relative">
                    {/* Tombol Close Mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-brand-blue transition-colors"
                    >
                        <LogOut size={20} className="rotate-180" />
                    </button>

                    {/* Dekorasi blur gradient di sudut kiri atas */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 blur-3xl -ml-16 -mt-16 rounded-full" />

                    {/* Branding Section — logo resmi Pakuaty */}
                    <div className="p-7 relative flex justify-center">
                        <img
                            src="/images/pure logo pakuaty.png"
                            alt="Pakuaty Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Profile Widget — menampilkan nama admin dan status online */}
                    <div className="px-5 mb-5">
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/60 flex items-center gap-4 shadow-sm">
                            {/* Avatar placeholder dengan ikon */}
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200/60 text-brand-gold shadow-md overflow-hidden">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                {/* Nama admin — truncate jika terlalu panjang */}
                                <p className="text-stone-dark text-sm font-bold truncate leading-none mb-1">{profile.fullName || 'Administrator'}</p>
                                {/* Status online indicator */}
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Connected</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu — daftar link halaman admin */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-4" onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path; // Cek apakah menu ini aktif
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[15px] overflow-hidden ${isActive
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' // Style aktif
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-stone-dark' // Style non-aktif
                                        }`}
                                >
                                    {/* Active Indicator — bar emas di sisi kiri */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab" // Shared layout animation
                                            className="absolute left-0 w-1.5 h-6 bg-brand-gold rounded-full"
                                        />
                                    )}

                                    {/* Ikon menu — scale up saat hover/active */}
                                    <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {/* Label teks menu */}
                                    <span className="relative z-10 tracking-tight">{item.name}</span>

                                    {/* Hover background overlay — hanya tampil saat non-aktif */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Section — tombol logout */}
                    <div className="p-4 mt-auto border-t border-slate-100/50 bg-slate-50/30">
                        <button
                            onClick={() => {
                                localStorage.removeItem('isLoggedIn'); // Hapus flag login
                                localStorage.removeItem('pakuaty_token'); // Hapus token
                                window.location.href = '/admin/login'; // Redirect ke login
                            }}
                            className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 font-bold text-sm group"
                        >
                            {/* Ikon logout — geser kiri saat hover */}
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="tracking-tight">System Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
