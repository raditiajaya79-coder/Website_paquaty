import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ShieldCheck, Save, RotateCcw, Clock, Globe, Key, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ManageProfile — Pengaturan Akun & Keamanan Admin.
 * Layout full-width: profile header + 2-column forms + sidebar session info.
 */
const ManageProfile = () => {
    // State profil admin
    const [profile, setProfile] = useState({ username: 'admin_pakuaty', email: 'admin@pakuaty.com', fullName: 'Administrator Pakuaty', role: 'Super Admin' });
    // State ganti password
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    /** Ambil data admin dari localStorage saat mount */
    useEffect(() => {
        const adminData = localStorage.getItem('admin_user'); // Cek data admin di storage
        if (adminData) {
            try { setProfile(JSON.parse(adminData)); } // Parse ke objek
            catch (e) { console.error("Gagal parse data admin"); }
        }
    }, []);

    /** handleProfileUpdate — Submit perubahan profil */
    const handleProfileUpdate = (e) => { e.preventDefault(); alert("Fitur update profil sedang dalam pengerjaan."); };

    /** handlePasswordChange — Submit perubahan password */
    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) { alert("Password konfirmasi tidak cocok!"); return; }
        alert("Fitur ganti password sedang disiapkan.");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    };

    return (
        <div className="space-y-4 pb-10">
            {/* Profile Hero Header — full width */}
            <div className="bg-stone-dark rounded-2xl md:rounded-xl p-4 md:p-5 text-white flex flex-col md:flex-row items-center gap-4 md:gap-5 shadow-lg relative overflow-hidden">
                {/* Dekorasi blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full text-center md:text-left">
                    {/* Avatar */}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 text-brand-gold text-xl md:text-2xl font-bold italic shrink-0">
                        {profile.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <p className="text-brand-gold text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Administrator Profile</p>
                        <h2 className="text-lg md:text-xl font-bold tracking-tight leading-none">{profile.fullName}</h2>
                        <p className="text-white/40 text-[10px] md:text-xs mt-1.5 md:mt-1 font-medium italic">{profile.role} • {profile.email}</p>
                    </div>
                    {/* Quick stats — hanya desktop */}
                    <div className="hidden md:flex gap-4">
                        <div className="text-center px-4 border-r border-white/10">
                            <p className="text-xs text-white/30 uppercase tracking-wider">Role</p>
                            <p className="text-sm font-bold text-brand-gold mt-0.5">Super Admin</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs text-white/30 uppercase tracking-wider">Status</p>
                            <div className="flex items-center gap-1.5 mt-0.5 justify-center">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                <p className="text-sm font-bold text-emerald-400">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main: 3 kolom — profil info | keamanan | session/tips */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Informasi Profil (5/12) */}
                <div className="lg:col-span-5 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-xs md:text-base font-black text-stone-dark uppercase tracking-widest mb-4 md:mb-5 flex items-center gap-2"><User size={16} className="text-brand-blue" /> Informasi Profil</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <input disabled value={profile.username} className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg text-slate-400 font-bold cursor-not-allowed text-xs md:text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 md:py-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg outline-none focus:ring-1 focus:ring-brand-blue/20 text-xs md:text-sm font-bold" />
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <input required value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg outline-none focus:ring-1 focus:ring-brand-blue/20 text-xs md:text-sm font-bold" />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-brand-blue text-white rounded-xl md:rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-brand-blue/10 flex items-center justify-center gap-2 active:scale-[0.98]"><Save size={14} /> Simpan Perubahan</button>
                    </form>
                </div>

                {/* Keamanan Akun (4/12) */}
                <div className="lg:col-span-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-xs md:text-base font-black text-stone-dark uppercase tracking-widest mb-4 md:mb-5 flex items-center gap-2"><Lock size={16} className="text-brand-gold" /> Keamanan Akun</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password Saat Ini</label>
                            <input required type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/20 text-xs md:text-sm font-bold" placeholder="••••••••" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                            <input required type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/20 text-xs md:text-sm font-bold" placeholder="Minimal 8 karakter" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                            <input required type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/20 text-xs md:text-sm font-bold" placeholder="Ulangi password baru" />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-stone-dark text-white rounded-xl md:rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"><RotateCcw size={14} /> Ganti Password</button>
                    </form>
                </div>

                {/* Sidebar Info — Session & Tips (3/12) */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Session Info */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Activity size={13} /> Info Sesi</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Clock size={12} /> Login Terakhir</span>
                                <span className="text-xs font-semibold text-stone-dark">Hari Ini</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Globe size={12} /> Browser</span>
                                <span className="text-xs font-semibold text-stone-dark">Chrome</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Key size={12} /> Token</span>
                                <span className="text-xs font-semibold text-emerald-600">Valid</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Tips */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="flex items-start gap-2.5">
                            <ShieldCheck size={16} className="text-brand-gold shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-stone-dark">Tips Keamanan</p>
                                <ul className="space-y-1.5">
                                    <li className="text-[11px] text-slate-500 leading-relaxed">• Gunakan kombinasi huruf, angka, dan simbol</li>
                                    <li className="text-[11px] text-slate-500 leading-relaxed">• Minimal 8 karakter untuk password</li>
                                    <li className="text-[11px] text-slate-500 leading-relaxed">• Sesi login akan berakhir otomatis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProfile;
