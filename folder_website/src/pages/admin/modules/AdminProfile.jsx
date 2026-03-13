import React, { useState, useEffect } from 'react'; // React hooks
import { motion } from 'framer-motion'; // Animasi
import {
    User,
    Lock,
    ShieldCheck,
    AtSign,
    Key,
    Save,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    XCircle
} from 'lucide-react'; // Ikon
import Toast from '../../../components/admin/Toast'; // Notifikasi feedback

/**
 * AdminProfile Component — Pengaturan akun administrator.
 * Fokus pada keamanan: Ganti username dan password.
 * Sekarang terhubung ke API backend (PUT /api/auth/username, PUT /api/auth/password).
 */
const AdminProfile = () => {
    // State username section
    const [newUsername, setNewUsername] = useState(''); // Input username baru
    const [savingUsername, setSavingUsername] = useState(false); // Loading state simpan username

    // State password section
    const [currentPassword, setCurrentPassword] = useState(''); // Input password lama
    const [newPassword, setNewPassword] = useState(''); // Input password baru
    const [confirmPassword, setConfirmPassword] = useState(''); // Input konfirmasi password
    const [savingPassword, setSavingPassword] = useState(false); // Loading state simpan password

    // Toast feedback
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Ambil username saat ini dari localStorage untuk ditampilkan sebagai placeholder
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

    /**
     * handleUpdateUsername — Kirim username baru ke backend.
     * Validasi lokal: minimal 3 karakter.
     */
    const handleUpdateUsername = async (e) => {
        e.preventDefault(); // Cegah reload halaman
        if (!newUsername.trim() || newUsername.trim().length < 3) {
            setToast({ show: true, message: 'Username minimal 3 karakter.', type: 'error' });
            return;
        }

        setSavingUsername(true); // Aktifkan loading
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('http://localhost:5000/api/auth/username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername.trim() })
            });
            const data = await res.json(); // Parse response

            if (res.ok) {
                // Update localStorage agar konsisten
                const updatedUser = { ...adminUser, username: newUsername.trim() };
                localStorage.setItem('admin_user', JSON.stringify(updatedUser));
                setToast({ show: true, message: 'Username berhasil diperbarui!', type: 'success' });
                setNewUsername(''); // Reset input
            } else {
                setToast({ show: true, message: data.error || 'Gagal memperbarui username.', type: 'error' });
            }
        } catch {
            setToast({ show: true, message: 'Gagal terhubung ke server.', type: 'error' });
        } finally {
            setSavingUsername(false); // Matikan loading
        }
    };

    /**
     * handleUpdatePassword — Kirim password lama + password baru ke backend.
     * Validasi lokal: semua field terisi, password baru minimal 6 karakter, konfirmasi cocok.
     */
    const handleUpdatePassword = async (e) => {
        e.preventDefault(); // Cegah reload halaman

        // Validasi: semua field harus terisi
        if (!currentPassword || !newPassword || !confirmPassword) {
            setToast({ show: true, message: 'Semua field password wajib diisi.', type: 'error' });
            return;
        }
        // Validasi: password baru minimal 6 karakter
        if (newPassword.length < 6) {
            setToast({ show: true, message: 'Password baru minimal 6 karakter.', type: 'error' });
            return;
        }
        // Validasi: konfirmasi harus sama
        if (newPassword !== confirmPassword) {
            setToast({ show: true, message: 'Konfirmasi password tidak cocok.', type: 'error' });
            return;
        }

        setSavingPassword(true); // Aktifkan loading
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json(); // Parse response

            if (res.ok) {
                setToast({ show: true, message: 'Password berhasil diperbarui!', type: 'success' });
                // Reset semua field password
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setToast({ show: true, message: data.error || 'Gagal memperbarui password.', type: 'error' });
            }
        } catch {
            setToast({ show: true, message: 'Gagal terhubung ke server.', type: 'error' });
        } finally {
            setSavingPassword(false); // Matikan loading
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* Header Profil */}
            <div>
                <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Profil & Keamanan</h1>
                <p className="text-[#64748B] mt-1 font-bold text-xs">Kelola kredensial akses Anda untuk keamanan website.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {/* Username Management Section */}
                <motion.form
                    onSubmit={handleUpdateUsername}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    {/* Section header dengan ikon */}
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
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder={adminUser.username || 'Username baru'}
                                />
                            </div>
                        </div>
                        {/* Tombol simpan — disabled saat loading */}
                        <button
                            type="submit"
                            disabled={savingUsername}
                            className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] transition-all disabled:opacity-60"
                        >
                            {savingUsername ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {savingUsername ? 'Menyimpan...' : 'Simpan Username'}
                        </button>
                    </div>
                </motion.form>

                {/* Password Management Section */}
                <motion.form
                    onSubmit={handleUpdatePassword}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    {/* Section header dengan ikon */}
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
                        {/* Input password lama */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Password Lama</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder="Ketik password saat ini"
                                />
                            </div>
                        </div>
                        {/* Input password baru dan konfirmasi — grid 2 kolom di desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Password Baru</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                        placeholder="Min 6 karakter"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Konfirmasi</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Tombol simpan — disabled saat loading */}
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="w-full flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all disabled:opacity-60"
                        >
                            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            {savingPassword ? 'Memperbarui...' : 'Perbarui Password'}
                        </button>
                    </div>
                </motion.form>
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

            {/* Toast notification */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default AdminProfile;
