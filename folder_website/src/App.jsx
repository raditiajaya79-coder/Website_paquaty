// App.jsx — Route definitions (mirip pages/ folder di Next.js)
// Semua halaman didefinisikan di sini sebagai routes
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

// Layout — wrapper yang menyediakan Navbar + Footer di semua halaman publik
import MainLayout from './layouts/MainLayout.jsx';

// Pages — setiap halaman website publik
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Contact from './pages/Contact.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Certificates from './pages/Certificates.jsx';

// Admin Pages — Area khusus pengelolaan konten
import Login from './pages/admin/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';

// Detailed Admin Modules
import ManageProducts from './pages/admin/modules/ManageProducts.jsx';
import ManageGallery from './pages/admin/modules/ManageGallery.jsx';
import ManageCertificates from './pages/admin/modules/ManageCertificates.jsx';
import ManageEvents from './pages/admin/modules/ManageEvents.jsx';
import ManageContact from './pages/admin/modules/ManageContact.jsx';
import ManageAnnouncements from './pages/admin/modules/ManageAnnouncements.jsx';
import AdminProfile from './pages/admin/modules/AdminProfile.jsx';

// Form Pages [NEW]
import ProductForm from './pages/admin/modules/forms/ProductForm.jsx';
import EventForm from './pages/admin/modules/forms/EventForm.jsx';
import AnnouncementForm from './pages/admin/modules/forms/AnnouncementForm.jsx';
import GalleryForm from './pages/admin/modules/forms/GalleryForm.jsx';
import CertificateForm from './pages/admin/modules/forms/CertificateForm.jsx';

/**
 * App — Root component yang mengatur routing
 * Semua halaman dibungkus MainLayout agar Navbar & Footer konsisten
 */
function App() {
    // location — Lokasi URL saat ini untuk animasi transisi
    const location = useLocation();

    return (
        // AnimatePresence — Memungkinkan animasi transisi halaman
        <AnimatePresence mode="wait">
            <Routes location={location}>
                {/* 
            Route parent dengan MainLayout sebagai wrapper
            Semua child routes akan di-render di dalam MainLayout (via <Outlet />)
          */}
                <Route element={<MainLayout />}>
                    {/* Halaman utama — URL: / */}
                    <Route path="/" element={<Home />} />

                    {/* Profil perusahaan — URL: /about */}
                    <Route path="/about" element={<About />} />

                    {/* Katalog produk — URL: /products */}
                    <Route path="/products" element={<Products />} />

                    {/* Detail produk — URL: /products/:id */}
                    <Route path="/products/:id" element={<ProductDetail />} />

                    {/* Halaman kontak/order — URL: /contact */}
                    <Route path="/contact" element={<Contact />} />

                    {/* Halaman artikel/event — URL: /events */}
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/article/:id" element={<EventDetail />} />
                    <Route path="/events/event/:id" element={<EventDetail />} />

                    {/* Halaman galeri — URL: /gallery */}
                    <Route path="/gallery" element={<Gallery />} />

                    {/* Halaman sertifikat — URL: /certificates */}
                    <Route path="/certificates" element={<Certificates />} />
                </Route>

                {/* 
                    AREA ADMIN — Tanpa Navbar/Footer Website Utama
                    Menggunakan AdminLayout khusus dashboard
                */}
                <Route path="/admin/login" element={<Login />} />

                {/* Redirect /admin langsung ke dashboard agar tidak blank */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                {/* AREA YANG DILINDUNGI (Wajib Login) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        {/* Module Produk */}
                        <Route path="products" element={<ManageProducts />} />
                        <Route path="products/add" element={<ProductForm />} />
                        <Route path="products/edit/:id" element={<ProductForm />} />

                        {/* Module Agenda */}
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="events/add" element={<EventForm />} />
                        <Route path="events/edit/:id" element={<EventForm />} />

                        {/* Module Pengumuman */}
                        <Route path="announcements" element={<ManageAnnouncements />} />
                        <Route path="announcements/add" element={<AnnouncementForm />} />
                        <Route path="announcements/edit/:id" element={<AnnouncementForm />} />

                        {/* Module Galeri */}
                        <Route path="gallery" element={<ManageGallery />} />
                        <Route path="gallery/add" element={<GalleryForm />} />
                        <Route path="gallery/edit/:id" element={<GalleryForm />} />

                        {/* Module Sertifikat */}
                        <Route path="certificates" element={<ManageCertificates />} />
                        <Route path="certificates/add" element={<CertificateForm />} />
                        <Route path="certificates/edit/:id" element={<CertificateForm />} />

                        <Route path="contact" element={<ManageContact />} />
                        <Route path="profile" element={<AdminProfile />} />
                    </Route>
                </Route>

            </Routes>
        </AnimatePresence>
    );
}

export default App;
