// App.jsx — Route definitions (mirip pages/ folder di Next.js)
// Semua halaman didefinisikan di sini sebagai routes
import React, { lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

// Layout — wrapper yang menyediakan Navbar + Footer di semua halaman publik
import MainLayout from './layouts/MainLayout.jsx';

// Pages — setiap halaman website publik
import Home from './pages/Home.jsx';
const About = lazy(() => import('./pages/About.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Production = lazy(() => import('./pages/Production.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const EventDetail = lazy(() => import('./pages/EventDetail.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));

// Admin Pages — Area khusus pengelolaan konten
const Login = lazy(() => import('./pages/admin/Login.jsx'));
import AdminLayout from './layouts/AdminLayout.jsx';
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));

// Detailed Admin Modules
const ManageProducts = lazy(() => import('./pages/admin/modules/ManageProducts.jsx'));
const ManageGallery = lazy(() => import('./pages/admin/modules/ManageGallery.jsx'));
const ManageCertificates = lazy(() => import('./pages/admin/modules/ManageCertificates.jsx'));
const ManageEvents = lazy(() => import('./pages/admin/modules/ManageEvents.jsx'));
const ManageProduction = lazy(() => import('./pages/admin/modules/ManageProduction.jsx'));
const ManageContact = lazy(() => import('./pages/admin/modules/ManageContact.jsx'));
const ManageAnnouncements = lazy(() => import('./pages/admin/modules/ManageAnnouncements.jsx'));
const ManageSettings = lazy(() => import('./pages/admin/modules/ManageSettings.jsx'));
const ManageFounder = lazy(() => import('./pages/admin/modules/ManageFounder.jsx'));
const ManageHeroVideo = lazy(() => import('./pages/admin/modules/ManageHeroVideo.jsx'));

const AdminProfile = lazy(() => import('./pages/admin/modules/AdminProfile.jsx'));

// Form Pages [NEW]
const ProductForm = lazy(() => import('./pages/admin/modules/forms/ProductForm.jsx'));
const EventForm = lazy(() => import('./pages/admin/modules/forms/EventForm.jsx'));
const AnnouncementForm = lazy(() => import('./pages/admin/modules/forms/AnnouncementForm.jsx'));
const GalleryForm = lazy(() => import('./pages/admin/modules/forms/GalleryForm.jsx'));
const CertificateForm = lazy(() => import('./pages/admin/modules/forms/CertificateForm.jsx'));

/**
 * App — Root component yang mengatur routing
 * Semua halaman dibungkus MainLayout agar Navbar & Footer konsisten
 */
function App() {
    // location — Lokasi URL saat ini untuk animasi transisi
    const location = useLocation();

    return (
        <>
            <ScrollToTop />
            {/* AnimatePresence — Memungkinkan animasi transisi halaman */}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
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

                    {/* Halaman tambahan */}
                    <Route path="/production" element={<Production />} />
                </Route>

                {/* 
                    AREA ADMIN — Tanpa Navbar/Footer Website Utama
                    Menggunakan AdminLayout khusus dashboard
                */}
                <Route path="/admin/login" element={<Login />} />

                {/* AREA YANG DILINDUNGI (Wajib Login) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* Jika mengunjungi /admin, otomatis ke dashboard */}
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        {/* Module Produk */}
                        <Route path="products" element={<ManageProducts />} />
                        <Route path="products/add" element={<ProductForm />} />
                        <Route path="products/edit/:id" element={<ProductForm />} />

                        {/* Module Agenda */}
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="events/add" element={<EventForm />} />
                        <Route path="events/edit/:id" element={<EventForm />} />

                        <Route path="production" element={<ManageProduction />} />

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
                        <Route path="settings" element={<ManageSettings />} />
                        <Route path="founder" element={<ManageFounder />} />
                        <Route path="hero-video" element={<ManageHeroVideo />} />

                        <Route path="profile" element={<AdminProfile />} />
                    </Route>
                </Route>

            </Routes>
        </AnimatePresence>
        </>
    );
}

export default App;
