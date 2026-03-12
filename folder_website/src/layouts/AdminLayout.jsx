import React from 'react'; // React library
import { Outlet } from 'react-router-dom'; // Route outlets for children pages
import Sidebar from '../components/admin/Sidebar.jsx'; // Sidebar component
import { Bell, Search, User } from 'lucide-react'; // Icon set from Lucide

/**
 * AdminLayout — Wrapper utama untuk semua halaman di dalam area Admin.
 * Menyediakan Sidebar tetap dan area konten utama dengan header.
 */
const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-slate-100 font-['Inter',sans-serif] text-[#1E293B] overflow-hidden">
            {/* Fixed Sidebar — Navigasi samping */}
            <Sidebar />

            {/* Main Content Area — pl-64 untuk kompensasi sidebar fixed */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pl-64 transition-all">
                {/* Top Header — Navigasi atas */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Cari data..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-11 pr-5 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 transition-all active:scale-95 group">
                            <Bell className="w-4.5 h-4.5 text-[#64748B] group-hover:text-[#2563EB]" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-6 w-px bg-slate-200"></div>

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
                <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
