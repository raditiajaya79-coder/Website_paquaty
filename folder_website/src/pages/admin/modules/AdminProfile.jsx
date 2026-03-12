import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    ShieldCheck,
    AtSign,
    Key,
    CheckCircle2,
    Save,
    AlertTriangle
} from 'lucide-react';

/**
 * AdminProfile Component — Pengaturan akun administrator.
 * Fokus pada keamanan: Ganti username dan password.
 */
const AdminProfile = () => {
    return (
        <div className="w-full space-y-8">
            {/* Header Profil */}
            <div>
                <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Profil & Keamanan</h1>
                <p className="text-[#64748B] mt-1 font-bold text-xs">Kelola kredensial akses Anda untuk keamanan website.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {/* Username Management Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-blue-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1E293B] tracking-tight">Data Login</h3>
                            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Ubah identitas akses admin</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Username Baru</label>
                            <div className="relative">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder="Username Baru"
                                    defaultValue="admin_pakuaty"
                                />
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] transition-all">
                            <Save className="w-4 h-4" /> Simpan Username
                        </button>
                    </div>
                </motion.div>

                {/* Password Management Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-red-500">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1E293B] tracking-tight">Keamanan Akun</h3>
                            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Perbarui kata sandi berkala</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Password Lama</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder="Ketik password saat ini"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Password Baru</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="password"
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Konfirmasi</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="password"
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">
                            <ShieldCheck className="w-4.5 h-4.5" /> Perbarui Password
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Warning / Tip Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5">
                <div className="p-4 bg-white rounded-2xl text-amber-600 shadow-sm border border-amber-100">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-[11px] font-black text-amber-900 tracking-tight uppercase">Keamanan Akun Adalah Prioritas</h4>
                    <p className="text-[10px] font-bold text-amber-800/80 uppercase tracking-widest mt-1.5 leading-relaxed">Gunakan kombinasi password yang kuat dan unik. Hindari menggunakan kata sandi yang sama di platform lain untuk meminimalisir risiko kebocoran data.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
