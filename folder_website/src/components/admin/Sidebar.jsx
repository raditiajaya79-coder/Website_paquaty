import React, { useState, useEffect } from 'react'; // React hooks
import { Link, useLocation } from 'react-router-dom'; // Utilitas navigasi
import {
    LayoutDashboard,
    Package,
    FileText,
    Image,
    Award,
    Calendar,
    Link as LinkIcon,
    User,
    LogOut
} from 'lucide-react'; // Mengimpor ikon-ikon modern
import { motion } from 'framer-motion'; // Library untuk animasi

/**
 * Komponen Sidebar untuk dashboard admin.
 * Menampilkan menu navigasi utama dengan desain bersih dan fungsional.
 */
const Sidebar = () => {
    const location = useLocation(); // Mendapatkan jalur URL saat ini

    // State untuk menyimpan data profil admin
    const [profile, setProfile] = useState({
        fullName: 'Administrator',
        role: 'Super Admin'
    });

    // Memuat data profil dari localStorage saat mount
    useEffect(() => {
        const adminData = localStorage.getItem('admin_user');
        if (adminData) {
            try {
                setProfile(JSON.parse(adminData));
            } catch (e) {
                console.error("Gagal memuat profil di Sidebar");
            }
        }
    }, []);

    // Daftar menu navigasi
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Produk', icon: Package, path: '/admin/products' },
        { name: 'Artikel', icon: FileText, path: '/admin/articles' },
        { name: 'Galeri', icon: Image, path: '/admin/gallery' },
        { name: 'Sertifikat', icon: Award, path: '/admin/certificates' },
        { name: 'Event', icon: Calendar, path: '/admin/events' },
        { name: 'Kontak', icon: LinkIcon, path: '/admin/contacts' },
        { name: 'Profil', icon: User, path: '/admin/profile' },
    ];

    return (
        <aside className="w-72 bg-white border-r border-stone-100 flex flex-col h-screen sticky top-0 overflow-hidden shadow-sm">
            {/* Branding Section */}
            <div className="p-8 border-b border-stone-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                        P
                    </div>
                    <div>
                        <h1 className="text-brand-blue font-extrabold text-lg leading-none">
                            Pakuaty <span className="text-brand-gold">Admin</span>
                        </h1>
                        <p className="text-[10px] text-stone-dark/40 mt-1.5 font-bold uppercase tracking-widest">Sistem Manajemen</p>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="p-6 bg-brand-cream/30 mx-4 my-6 rounded-2xl border border-brand-gold/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-brand-gold/10 text-brand-gold shadow-sm">
                        <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-stone-dark text-sm font-bold truncate leading-none mb-1">{profile.fullName || 'Administrator'}</p>
                        <p className="text-stone-dark/40 text-[10px] font-bold uppercase tracking-wider">{profile.role || 'Super Admin'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm ${isActive
                                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/10 transform translate-x-1'
                                : 'text-stone-dark/60 hover:bg-stone-50 hover:text-stone-dark'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6 border-t border-stone-50">
                <button
                    onClick={() => {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('pakuaty_token');
                        window.location.href = '/admin/login';
                    }}
                    className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
                >
                    <LogOut size={20} />
                    <span>Keluar Sistem</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
