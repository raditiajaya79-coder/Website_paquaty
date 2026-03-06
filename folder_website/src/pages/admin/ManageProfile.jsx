import React, { useState, useEffect } from 'react'; // React hooks
import {
    User,
    Lock,
    Mail,
    ShieldCheck,
    Save,
    RotateCcw
} from 'lucide-react'; // Ikon
import { motion } from 'framer-motion'; // Library animasi

/**
 * ManageProfile — Pengaturan Akun & Keamanan Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageProfile = () => {
    // State profil
    const [profile, setProfile] = useState({
        username: 'admin_pakuaty',
        email: 'admin@pakuaty.com',
        fullName: 'Administrator Pakuaty',
        role: 'Super Admin'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Simulasi pengambilan data dari localStorage saat mount
    useEffect(() => {
        const adminData = localStorage.getItem('admin_user');
        if (adminData) {
            try {
                setProfile(JSON.parse(adminData));
            } catch (e) {
                console.error("Gagal parse data admin");
            }
        }
    }, []);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        alert("Fitur update profil sedang dalam pengerjaan.");
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Password konfirmasi tidak cocok!");
            return;
        }
        alert("Fitur ganti password sedang disiapkan.");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Profile Header */}
            <div className="bg-stone-dark rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-lg">
                <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-brand-gold text-4xl font-black italic">
                    {profile.fullName.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                    <p className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-1">Administrator Profile</p>
                    <h2 className="text-3xl font-black tracking-tight">{profile.fullName}</h2>
                    <p className="text-white/40 text-sm">{profile.role} • {profile.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Information Settings */}
                <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-dark mb-8 flex items-center gap-3">
                        <User size={20} className="text-brand-blue" /> Informasi Profil
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Username</label>
                            <input disabled value={profile.username} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-dark/30 font-bold cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Email</label>
                            <div className="relative">
                                <input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-3 pl-12 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-dark/20" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Nama Lengkap</label>
                            <input required value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-brand-blue/10 flex items-center justify-center gap-2">
                            <Save size={18} /> Simpan Perubahan
                        </button>
                    </form>
                </div>

                {/* Security Settings */}
                <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-dark mb-8 flex items-center gap-3">
                        <Lock size={20} className="text-brand-gold" /> Keamanan Akun
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Password Saat Ini</label>
                            <input required type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Password Baru</label>
                            <input required type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Minimal 8 karakter" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-dark/40 uppercase ml-1">Konfirmasi Password</label>
                            <input required type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Ulangi password baru" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-stone-dark text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                            <RotateCcw size={18} /> Ganti Password
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="p-6 bg-brand-cream/30 border border-brand-gold/10 rounded-2xl flex items-start gap-4">
                <ShieldCheck size={24} className="text-brand-gold shrink-0 mt-1" />
                <p className="text-xs text-stone-dark/50 leading-relaxed font-medium">
                    Keamanan akun Anda sangat penting. Pastikan untuk menggunakan kombinasi password yang kuat dan unik. Sesi login Anda akan berakhir secara otomatis setelah jangka waktu tertentu demi alasan keamanan.
                </p>
            </div>
        </div>
    );
};

export default ManageProfile;
