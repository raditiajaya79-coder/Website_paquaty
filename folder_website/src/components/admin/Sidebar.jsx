import React, { useState, useEffect } from 'react'; // React library & hooks
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Navigation links for routing
import ConfirmModal from './ConfirmModal';
import {
    LayoutDashboard,
    Package,
    Image,
    Award,
    Calendar,
    Contact,
    Megaphone,
    UserCircle,
    Camera,
    MonitorPlay,

    LogOut,
    ChevronRight,
    X
} from 'lucide-react'; // Icon set from Lucide

/**
 * Sidebar — Komponen navigasi vertikal untuk Admin Dashboard.
 * Berisi 8 menu utama sesuai permintaan (Dashboard, Product, Galeri, Sertifikate, Event, Kontak, Pengumuman, Profil).
 * Mendukung mode Desktop (fixed) dan Mobile (drawer).
 */
const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Otomatis tutup sidebar saat pindah halaman di mobile
    useEffect(() => {
        if (onClose) onClose();
    }, [location.pathname]);

    // Fungsi Logout
    const handleLogout = () => {
        // Hapus data dari localStorage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');

        // Redirect ke login
        navigate('/admin/login');
    };
    // list menu navigasi
    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Product', icon: Package, path: '/admin/products' },
        { label: 'Galeri', icon: Image, path: '/admin/gallery' },
        { label: 'Sertifikat', icon: Award, path: '/admin/certificates' },
        { label: 'Event', icon: Calendar, path: '/admin/events' },
        { label: 'Kontak', icon: Contact, path: '/admin/contact' },
        { label: 'Pengumuman', icon: Megaphone, path: '/admin/announcements' },
        { label: 'Foto Founder', icon: Camera, path: '/admin/founder' },
        { label: 'Video Beranda', icon: MonitorPlay, path: '/admin/hero-video' },

        { label: 'Pengaturan', icon: LayoutDashboard, path: '/admin/settings' },
        { label: 'Profil', icon: UserCircle, path: '/admin/profile' },
    ];

    return (
        <aside 
            className={`
                fixed top-0 w-64 bg-white border-r border-slate-100 flex flex-col z-50 shadow-xl shadow-slate-900/5 transition-all duration-300 ease-in-out
                ${isOpen ? 'left-0' : '-left-64 lg:left-0'}
            `}
            style={{ height: 'calc(100vh / var(--desktop-zoom, 1))' }}
        >
            {/* Branding Area — Logo dan nama perusahaan */}
            <div className="py-4 px-6 border-b border-slate-100 flex flex-col items-center justify-center text-center relative">
                {/* Close Button — Mobile Only */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute right-3 top-3 p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100"
                >
                    <X className="w-4 h-4" />
                </button>

                <img
                    src="/images/pure logo pakuaty.png"
                    alt="Logo Pakuaty"
                    className="w-20 lg:w-24 h-auto object-contain mb-1.5"
                />
                <h2 className="text-[#64748B] text-[9.5px] font-black uppercase tracking-[0.3em] leading-none opacity-80">Admin Panel</h2>
            </div>

            {/* Navigation Menu — Daftar link navigasi */}
            <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 no-scrollbar">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                                : 'text-[#64748B] hover:bg-white hover:text-[#2563EB]'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#2563EB]'}`} /> {/* Ikon menu */}
                                    <span className="font-semibold text-sm tracking-tight">{item.label}</span> {/* Label menu */}
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? '' : 'text-gray-300 group-hover:text-[#2563EB]/50'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Area — Tombol logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
                >
                    <LogOut className="w-5 h-5" /> {/* Ikon Logout */}
                    <span>Keluar Sistem</span>
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin keluar dari sistem admin Pakuaty?"
                confirmText="Ya, Keluar"
                cancelText="Batal"
            />
        </aside>
    );
};

export default Sidebar;
