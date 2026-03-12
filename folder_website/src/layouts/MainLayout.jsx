// MainLayout.jsx — Wrapper utama untuk layout website
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AnnouncementPopup from '../components/AnnouncementPopup.jsx';

/**
 * MainLayout — Menyediakan struktur global halaman
 * Berisi Navbar di atas, konten (Outlet) di tengah, dan Footer di bawah.
 * Konten di tengah akan berubah sesuai dengan route yang aktif.
 */
const MainLayout = () => {
    return (
        // Flexbox container untuk memastikan footer tetap di bawah jika konten sedikit
        <div className="flex flex-col min-h-screen bg-neutral-bone text-stone-dark">
            {/* Popup Pengumuman (Opsional & Sekali per sesi) */}
            <AnnouncementPopup />

            {/* Komponen Navigasi Atas */}
            <Navbar />

            {/* 
        Main Content Area with Premium Transitions
      */}
            <main className="flex-grow">
                <motion.div
                    key={window.location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Komponen Informasi Bawah */}
            <Footer />
        </div>
    );
};

export default MainLayout;
