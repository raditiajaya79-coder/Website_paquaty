import React from 'react';
import { RefreshCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ErrorBoundary.jsx — Pelindung Utama Sistem (Production Shield)
 * Jika sewaktu-waktu backend mengirim data array yang null/rusak, dan 
 * komponen React me-render .map() pada null tersebut (yang biasa menyebabkan
 * layar jadi putih total selamanya), Error Boundary ini akan CEPAT MENCEGAT proses
 * crash tersebut dan menampilkan UI pemulihan yang elegan.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // Dipanggil secara otomatis oleh React jika ada komponen child yang lempar error
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    // Dipanggil untuk menangkap stack trace (baik untuk dikirim ke sistem analitik)
    componentDidCatch(error, errorInfo) {
        // Di Production, kita tidak memperlihatkan error merah ke pengguna
        console.error("⚠️ [Error Boundary Caught A Crash]:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen border-t-4 border-red-500 bg-neutral-bone flex flex-col items-center justify-center p-6 sm:p-10 text-center font-['Inter',sans-serif]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md bg-white p-8 sm:p-12 rounded-[2rem] shadow-2xl border border-stone-200"
                    >
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
                            <RefreshCcw className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-stone-dark tracking-tight mb-3">
                            Layanan Terganggu
                        </h1>
                        <p className="text-sm font-medium text-stone-dark/70 mb-8 leading-relaxed">
                            Kami mohon maaf, sepertinya terjadi kesalahan sinkronisasi sementara dengan server kami. Tim kami sedang menanganinya.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-brand-blue text-white py-3.5 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all active:scale-95 shadow-md flex justify-center items-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" /> Segarkan Halaman
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-stone-100 text-stone-dark py-3.5 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-stone-200 transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Kembali ke Beranda
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        // Kalau tidak ada error, lanjutkan ngerender anak-anaknya secara normal
        return this.props.children;
    }
}

export default ErrorBoundary;
