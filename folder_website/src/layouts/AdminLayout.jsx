import React, { useState } from 'react'; // React library with useState
import { Outlet } from 'react-router-dom'; // Route outlets for children pages
import Sidebar from '../components/admin/Sidebar.jsx'; // Sidebar component
import { Bell, Search, User, Menu, X } from 'lucide-react'; // Icon set from Lucide

/**
 * AdminLayout — Wrapper utama untuk semua halaman di dalam area Admin.
 * Menyediakan Sidebar tetap (desktop) dan drawer (mobile).
 */
const AdminLayout = () => {
    // State untuk mengontrol sidebar di mode mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /**
     * Toggle Sidebar — Membuka/tutup sidebar di mobile
     */
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex bg-slate-100 font-['Inter',sans-serif] text-[#1E293B] overflow-hidden relative" style={{ height: 'calc(100vh / var(--desktop-zoom, 1))' }}>
            {/* Fixed Sidebar — Desktop: Fixed, Mobile: Drawer */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Overlay untuk mobile saat sidebar terbuka */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area — Padding-left berubah sesuai layar */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64 transition-all duration-300">
                {/* Top Header — Navigasi atas */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 w-1/3">
                        {/* Hamburger Menu — Hanya muncul di layar kecil (< lg) */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 active:scale-95 transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="relative w-full max-w-sm hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Cari data..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-11 pr-5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-5">
                        {/* Search icon for mobile header if needed, but for now kept minimal */}
                        <button className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-400">
                            <Search className="w-4.5 h-4.5" />
                        </button>

                        <button className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 transition-all active:scale-95 group">
                            <Bell className="w-4.5 h-4.5 text-[#64748B] group-hover:text-[#2563EB]" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        {/* User Profile — Teks di Kiri, Ikon di Kanan sesuai Screenshot */}
                        <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1 rounded-xl transition-all">
                            <div className="text-right hidden sm:block">
                                <p className="text-[13px] font-black text-[#1E293B] leading-none mb-1">Super Admin</p>
                                <p className="text-[8.5px] font-black text-[#94A3B8] uppercase tracking-[0.2em] opacity-80">Management</p>
                            </div>
                            <div className="w-8.5 h-8.5 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all text-white">
                                <User className="w-4.5 h-4.5" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content — Halaman yang me-render kartu-kartu internal */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 custom-scrollbar bg-slate-50/50">
                    <div className="max-w-[1600px] mx-auto min-h-[50vh] relative">
                        <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
                            <Outlet />
                        </React.Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
