// MainLayout.jsx — Wrapper utama untuk layout website
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

/**
 * MainLayout — Menyediakan struktur global halaman
 * Berisi Navbar di atas, konten (Outlet) di tengah, dan Footer di bawah.
 * Konten di tengah akan berubah sesuai dengan route yang aktif.
 */
const MainLayout = () => {
    return (
        // Flexbox container untuk memastikan footer tetap di bawah jika konten sedikit
        <div className="flex flex-col min-h-screen bg-white text-slate-900">
            {/* Komponen Navigasi Atas */}
            <Navbar />

            {/* 
        Main Content Area
        flex-grow: supaya memenuhi sisa ruang agar footer terdorong ke bawah
      */}
            <main className="flex-grow">
                {/* Outlet: Komponen ini akan digantikan oleh halaman (Home, About, dll) */}
                <Outlet />
            </main>

            {/* Komponen Informasi Bawah */}
            <Footer />
        </div>
    );
};

export default MainLayout;
