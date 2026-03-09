import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'; // Komponen navigasi
import React, { useEffect } from 'react'; // React effect hook
import Sidebar from '../components/admin/Sidebar'; // Mengimpor sidebar
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi
import { Bell } from 'lucide-react'; // Ikon
import { AdminProvider, useAdmin } from '../context/AdminContext'; // Global State
import AdminToast from '../components/admin/AdminToast'; // Notifikasi Global
import AdminLoader from '../components/admin/AdminLoader'; // Loading Global

/**
 * AdminLayout — Root layout admin yang mengatur sidebar + header + area konten.
 * Komponen ini memiliki akses ke AdminProvider (di-render di App.jsx).
 */
const AdminLayout = () => {
    const navigate = useNavigate(); // Hook navigasi programatik
    const location = useLocation(); // Hook lokasi URL aktif
    const { isLoggedIn, isAuthChecked } = useAdmin(); // Ambil state auth global

    /**
     * getPageTitle — Mengekstrak nama halaman dari path URL.
     */
    const getPageTitle = (path) => {
        const route = path.split('/').pop() || 'Dashboard'; // Ambil segmen terakhir
        return route.charAt(0).toUpperCase() + route.slice(1); // Capitalize huruf pertama
    };

    // Proteksi Rute: Tunggu hingga pengecekan auth selesai
    if (!isAuthChecked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Jika tidak login, redirect ke halaman login
    if (!isLoggedIn) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans selection:bg-brand-blue selection:text-white overflow-hidden relative">
            <div className="fixed inset-0 bg-slate-50 z-0" />

            <AdminToast />   {/* Notifikasi toast global */}

            <div className="relative z-20">
                <Sidebar />
            </div>

            <main className="flex-1 h-screen flex flex-col relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none" />

                <header className="h-20 px-8 flex items-center justify-between relative z-20 border-b border-slate-200/40 bg-white/70 backdrop-blur-md">
                    <div>
                        <h2 className="text-lg font-bold text-stone-dark tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Management Portal</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button className="w-10 h-10 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue/20 transition-all shadow-sm">
                                <Bell size={18} />
                            </button>
                            <div className="h-8 w-px bg-slate-200/60 mx-1" />
                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                                <div className="w-7 h-7 bg-gradient-to-br from-brand-gold to-amber-400 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-gold/20">
                                    A
                                </div>
                                <span className="text-xs font-bold text-slate-500 tracking-tight">System Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pb-10 scroll-smooth no-scrollbar relative z-10">
                    <AdminLoader />  {/* Overlay loading global - Moved here for perfect centering */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="min-h-full pt-6"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
