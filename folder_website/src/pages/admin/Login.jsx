import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Coffee } from 'lucide-react';
import { api, setToken } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

/**
 * Login — Halaman Login Admin.
 * Desain compact & premium dengan glassmorphism card.
 */
const Login = () => {
    const [email, setEmail] = useState(''); // State email
    const [password, setPassword] = useState(''); // State password
    const [loading, setLoading] = useState(false); // Loading saat proses login
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn, showToast } = useAdmin();

    // Redirect jika sudah login
    useEffect(() => { if (isLoggedIn) navigate('/admin', { replace: true }); }, [isLoggedIn, navigate]);

    /** handleLogin — Kirim kredensial ke backend untuk autentikasi */
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.post('/auth/login', { email, password }); // POST login
            setToken(data.token); // Simpan JWT
            localStorage.setItem('isLoggedIn', 'true'); // Flag login
            setIsLoggedIn(true); // Update global state
            showToast("Selamat datang kembali!", "success");
            const from = location.state?.from?.pathname || "/admin"; // Redirect target
            navigate(from, { replace: true });
        } catch (err) {
            showToast(err.message || 'Login gagal. Periksa kredensial Anda.', 'error');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Dekorasi Ornamen Background */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-gold/8 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-brand-blue/5 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4"></div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-sm relative z-10">
                {/* Branding — Logo Resmi Pakuaty */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <img
                        src="/images/pure logo pakuaty.png"
                        alt="Pakuaty Logo"
                        className="h-14 w-auto object-contain mb-2"
                    />
                    <div className="h-0.5 w-12 bg-brand-gold/20 rounded-full" />
                </div>

                {/* Login Card — glassmorphism */}
                <div className="bg-white/80 backdrop-blur-xl p-7 rounded-2xl shadow-xl shadow-brand-blue/5 border border-white/80">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-0.5">Username / Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-blue transition-colors"><User size={16} /></div>
                                <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pakuaty.com" disabled={loading} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-blue/40 focus:border-brand-blue/30 transition-all text-sm font-medium disabled:opacity-50" />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-0.5">Kunci Keamanan</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-blue transition-colors"><Lock size={16} /></div>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-blue/40 focus:border-brand-blue/30 transition-all text-sm font-medium disabled:opacity-50" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 group hover:bg-stone-dark shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98] disabled:opacity-70">
                            <span>{loading ? 'Memverifikasi...' : 'Masuk Ke Dashboard'}</span>
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-300 text-[10px] font-semibold uppercase tracking-widest">&copy; 2026 PT Bala Aditi Pakuaty</p>
            </motion.div>
        </div>
    );
};

export default Login;
