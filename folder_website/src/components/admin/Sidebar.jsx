import React from 'react'; // React
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
    LogOut,
    X
} from 'lucide-react'; // Ikon modern dari lucide-react
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi transisi
import { useAdmin } from '../../context/AdminContext'; // Global State

/**
 * Sidebar — Komponen navigasi utama dashboard admin.
 * Desain compact, modern, dengan floating container dan soft visual.
 */
const Sidebar = () => {
    const location = useLocation(); // Hook untuk mendapatkan path aktif
    const { profile, isSidebarOpen, setIsSidebarOpen } = useAdmin(); // Ambil state global untuk sidebar dan profil

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
        <AnimatePresence>
            {/* 
                Sidebar Logic:
                1. Layar Desktop (lg+): Selalu tampil, posisi sticky.
                2. Layar Mobile (<lg): Tampil sebagai drawer (fixed) jika isSidebarOpen = true.
            */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen z-[10001] transition-all duration-500
                    ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-0 lg:w-72'}
                    flex flex-col p-4
                `}
            >
                {/* Overlay untuk mobile (hanya muncul saat sidebar terbuka di layar kecil) */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[-1] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Floating container utama — glassmorphism effect */}
                <div className="flex-1 bg-white/95 backdrop-blur-2xl border border-slate-200/50 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden relative">
                    {/* Header Mobile: Tombol Close - Hanya tampil di mobile saat drawer terbuka */}
                    <div className="lg:hidden absolute top-4 right-4 z-20">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-10 h-10 bg-slate-100/50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Dekorasi blur gradient di sudut kiri atas */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 blur-3xl -ml-16 -mt-16 rounded-full" />

                    {/* Branding Section — logo resmi Pakuaty */}
                    <div className="p-7 relative flex justify-center border-b border-slate-50">
                        <img
                            src="/images/pure logo pakuaty.png"
                            alt="Pakuaty Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                        {/* Profile Widget — menampilkan nama admin dan status online */}
                        <div className="px-5 my-4">
                            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/60 flex items-center gap-4 shadow-sm">
                                {/* Avatar placeholder dengan ikon */}
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200/60 text-brand-gold shadow-md overflow-hidden">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-stone-dark text-sm font-bold truncate leading-none mb-1">{profile.fullName || 'Administrator'}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Connected</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu — daftar link halaman admin */}
                        <nav className="px-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                                        className={`group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[14px] overflow-hidden ${isActive
                                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-stone-dark'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 w-1.5 h-6 bg-brand-gold rounded-full"
                                            />
                                        )}
                                        <item.icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        <span className="relative z-10 tracking-tight">{item.name}</span>
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer Section — tombol logout */}
                    <div className="p-4 mt-auto border-t border-slate-100/50 bg-slate-50/30">
                        <button
                            onClick={() => {
                                localStorage.removeItem('isLoggedIn');
                                localStorage.removeItem('pakuaty_token');
                                window.location.href = '/admin/login';
                            }}
                            className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 font-bold text-sm group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="tracking-tight">System Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </AnimatePresence>
    );
};

export default Sidebar;
