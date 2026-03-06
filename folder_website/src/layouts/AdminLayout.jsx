import { Outlet, useNavigate } from 'react-router-dom'; // Komponen navigasi
import { useEffect } from 'react'; // React effect hook
import Sidebar from '../components/admin/Sidebar'; // Mengimpor sidebar
import { motion } from 'framer-motion'; // Library animasi

/**
 * Layout utama untuk halaman-halaman admin.
 * Menyediakan Sidebar dan proteksi akses (Authorization Guard).
 */
const AdminLayout = () => {
    const navigate = useNavigate();

    // Proteksi Rute: Cek apakah user sudah masuk (isLoggedIn)
    useEffect(() => {
        const authFlag = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('pakuaty_token');

        console.log("[ADMIN] Proteksi Rute: is_logged_in =", authFlag, "| token =", token ? "Tersedia (Length: " + token.length + ")" : "KOSONG!");

        if (!authFlag || !token) {
            console.warn("[ADMIN] Akses ditolak: Data login tidak lengkap. Mengalihkan ke login...");
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('pakuaty_token');
            navigate('/admin/login'); // Redirect ke login jika tidak ada akses
        }
    }, [navigate]);

    return (
        <div className="flex bg-stone-50 min-h-screen font-sans selection:bg-brand-blue selection:text-white">
            {/* Soft UI Sidebar Layout */}
            <Sidebar />

            {/* Main Command Center Area */}
            <main className="flex-1 h-screen flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth no-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.99, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.99, y: -15 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            <Outlet />
                        </motion.div>

                        {/* Original Footer */}
                        <footer className="mt-20 pb-10 text-center text-stone-dark/30 text-xs">
                            <p>&copy; 2026 PT Bala Aditi Pakuaty. Semua Hak Dilindungi.</p>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
