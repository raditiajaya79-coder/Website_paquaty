// MainLayout.jsx — Wrapper utama untuk layout website
import React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AnnouncementPopup from '../components/AnnouncementPopup.jsx';
import FloatingChatbot from '../components/FloatingChatbot.jsx';
// Preloader — Layar loading yang tampil saat data belum siap
import Preloader from '../components/Preloader.jsx';
// Hook untuk cek status loading global
import { useGlobalData } from '../context/GlobalDataContext.jsx';

/**
 * MainLayout — Menyediakan struktur global halaman
 * Berisi Navbar di atas, konten (Outlet) di tengah, dan Footer di bawah.
 * Konten di tengah akan berubah sesuai dengan route yang aktif.
 * 
 * PERUBAHAN SPA:
 * - Preloader ditampilkan saat isLoaded === false
 * - Setelah semua data dimuat, konten website muncul
 */
const MainLayout = () => {
    // Ambil status loading dari GlobalDataContext
    const { isLoaded } = useGlobalData();
    const location = useLocation();
    const currentOutlet = useOutlet();

    return (
        <>
            {/* Preloader — Tampil di paling atas saat data belum dimuat */}
            <Preloader />

            {/* Konten website — Hanya render jika data sudah siap */}
            {isLoaded && (
                // Flexbox container untuk memastikan footer tetap di bawah jika konten sedikit
                <motion.div
                    className="flex flex-col min-h-screen bg-neutral-bone text-stone-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Popup Pengumuman (Opsional & Sekali per sesi) */}
                    <AnnouncementPopup />

                    {/* Komponen Navigasi Atas */}
                    <Navbar />

                    {/* 
                Main Content Area with Premium Transitions
              */}
                    <main className="flex-grow">
                        {/* Perbaikan Kestabilan Layout (Fix Blank Page)
                            Dihapusnya framer-motion AnimatePresence di area root sini 
                            agar tidak konflik dengan AnimatePresence internal halaman (seperti Home/Products). */}
                        <div className="w-full h-full animate-in fade-in duration-500">
                            <Outlet />
                        </div>
                    </main>

                    {/* Komponen Informasi Bawah */}
                    <Footer />

                    {/* Widget Chatbot Mengambang (Pojok Kanan Bawah) siap dihubungkan dengan server n8n */}
                    <FloatingChatbot />
                </motion.div>
            )}
        </>
    );
};

export default MainLayout;

