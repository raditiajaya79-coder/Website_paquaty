import React, { useState } from 'react'; // React hooks untuk state
import { motion } from 'framer-motion'; // Framer motion untuk animasi
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'; // Icon set Lucide
import { useNavigate } from 'react-router-dom'; // Router navigation
import { API_BASE_URL } from '../../utils/api';

/**
 * Login Component — Halaman masuk khusus Admin
 * Menampilkan form login dengan desain premium berbasis glassmorphism.
 */
const Login = () => {
    // state untuk form input
    const [showPassword, setShowPassword] = useState(false); // Toggle visibilitas password
    const [credentials, setCredentials] = useState({ username: '', password: '' }); // State data login
    const [loading, setLoading] = useState(false); // State loading
    const [error, setError] = useState(''); // State error
    const navigate = useNavigate(); // Hook untuk pindah halaman

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan token dan info admin ke localStorage
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.admin));

                // Redirect ke dashboard
                navigate('/admin/dashboard');
            } else {
                setError(data.error || 'Login gagal. Periksa kembali kredensial Anda.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Gagal terhubung ke server. Pastikan backend aktif.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center bg-[#F1F5F9] relative overflow-hidden font-['Inter',sans-serif] p-6" style={{ minHeight: 'calc(100vh / var(--desktop-zoom, 1))' }}>
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(30,41,59,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Left Side: Branding */}
                <div className="md:w-5/12 bg-[#1E293B] p-12 flex flex-col justify-center relative overflow-hidden text-white border-r border-white/5">
                    {/* Floating Decorative Elements */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full -mr-20 -mt-20"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.1, 0.05]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -ml-20 -mb-20"
                    />

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src="/images/pure logo pakuaty.png"
                                alt="Logo Pakuaty"
                                className="w-48 h-48 object-contain mx-auto brightness-0 invert opacity-90 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                            />
                            <div className="mt-8 space-y-1">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                    className="h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"
                                />
                                <p className="text-blue-100/40 text-[9px] font-black uppercase tracking-[0.4em] pt-3">
                                    Premium Artisan Heritage
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Login Form with Aesthetics */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative bg-[#FDFDFF]">
                    {/* Subtle Background Texture - Not Plain White */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 pointer-events-none"></div>

                    <div className="relative z-10 mb-10 overflow-hidden">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h1 className="text-2xl font-black text-[#1E293B] mb-2 uppercase tracking-[0.2em] flex items-center gap-3">
                                Admin Panel
                                <span className="h-px flex-1 bg-slate-100 block"></span>
                            </h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <p className="text-[#64748B] text-[10px] font-black uppercase tracking-widest opacity-60 italic">Identity verification required</p>
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-3 py-1 rounded-lg border border-red-100"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Username */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-2.5"
                        >
                            <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.2em] ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-all" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-slate-200 focus:border-[#2563EB] focus:ring-0 rounded-2xl py-4 pl-12 pr-4 text-[#1E293B] font-bold placeholder-[#CBD5E1] transition-all text-sm shadow-sm"
                                    placeholder="admin_pakuaty"
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="space-y-2.5"
                        >
                            <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-all" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-white border border-slate-200 focus:border-[#2563EB] focus:ring-0 rounded-2xl py-4 pl-12 pr-12 text-[#1E293B] font-bold placeholder-[#CBD5E1] transition-all text-sm shadow-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white font-black py-4.5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 transition-all mt-6 uppercase tracking-[0.2em] text-xs hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Sign In System <ArrowRight className="w-5 h-5 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                </div>
            </motion.div>
        </div>
    );
};

export default Login;
