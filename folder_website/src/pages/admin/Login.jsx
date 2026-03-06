import React, { useState } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi
import { motion } from 'framer-motion'; // Animasi
import { Lock, User, ArrowRight, Coffee } from 'lucide-react'; // Ikon
import { api, setToken } from '../../utils/api'; // Utilitas API + manajemen token

/**
 * Halaman Login Admin dengan desain Premium & Modern.
 * Menggunakan efek pencahayaan (lighting) dan glassmorphism.
 * Login dilakukan via POST ke backend /api/auth/login.
 */
const Login = () => {
    const [email, setEmail] = useState(''); // State email
    const [password, setPassword] = useState(''); // State password
    const [loading, setLoading] = useState(false); // State loading saat proses login
    const [error, setError] = useState(''); // State pesan error
    const navigate = useNavigate(); // Hook navigasi

    /**
     * handleLogin — Mengirim kredensial ke backend untuk autentikasi
     * Jika berhasil, simpan JWT token dan redirect ke dashboard.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); // Cegah reload halaman
        setLoading(true); // Tampilkan state loading
        setError(''); // Reset pesan error

        try {
            // Kirim POST request ke backend dengan email dan password
            const data = await api.post('/auth/login', { email, password });

            // Simpan JWT token ke localStorage
            setToken(data.token);

            // Simpan flag login untuk proteksi route di AdminLayout
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect ke halaman dashboard admin
            navigate('/admin');
        } catch (err) {
            // Tampilkan pesan error dari backend atau pesan default
            setError(err.message || 'Login gagal. Periksa email dan password.');
        } finally {
            setLoading(false); // Matikan state loading
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 overflow-hidden relative">
            {/* Dekorasi Ornamen Background (Pendaran Emas) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>

            {/* Kontainer Utama Login */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo / Icon Atas */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-brand-gold/10 mb-4 border border-brand-gold/20">
                        <Coffee size={40} className="text-brand-gold" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-brand-blue">
                        Pakuaty <span className="text-brand-gold">Admin</span>
                    </h1>
                    <p className="text-stone-dark/50 mt-2 font-medium">Selamat datang kembali, silakan masuk.</p>
                </div>

                {/* Card Form */}
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-brand-blue/5 border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Pesan Error (tampil jika ada error) */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        {/* Input Email/Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-dark/70 ml-1">Username / Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-blue/40 group-focus-within:text-brand-blue transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@pakuaty.com"
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-brand-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-dark/70 ml-1">Kunci Keamanan</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-blue/40 group-focus-within:text-brand-blue transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-brand-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Lupa Password Link */}
                        <div className="text-right">
                            <a href="#" className="text-xs font-bold text-brand-blue/60 hover:text-brand-blue transition-colors">Lupa kunci keamanan?</a>
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group hover:bg-opacity-90 shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center mt-8 text-stone-dark/40 text-sm">
                    &copy; 2026 PT Bala Aditi Pakuaty. Semua Hak Dilindungi.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
