// App.jsx — Route definitions (mirip pages/ folder di Next.js)
// Semua halaman didefinisikan di sini sebagai routes
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout — wrapper yang menyediakan Navbar + Footer di semua halaman publik
import MainLayout from './layouts/MainLayout.jsx';
// Layout — wrapper untuk halaman admin (sidebar + proteksi akses)
import AdminLayout from './layouts/AdminLayout.jsx';

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

// Pages — halaman admin dashboard
import Login from './pages/admin/Login.jsx';
import DashboardHome from './pages/admin/DashboardHome.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageArticles from './pages/admin/ManageArticles.jsx';
import ManageGalleries from './pages/admin/ManageGalleries.jsx';
import ManageCertificates from './pages/admin/ManageCertificates.jsx';
import ManageEvents from './pages/admin/ManageEvents.jsx';
import ManageContacts from './pages/admin/ManageContacts.jsx';
import ManageProfile from './pages/admin/ManageProfile.jsx';

/**
 * App — Root component yang mengatur routing
 * Semua halaman dibungkus MainLayout agar Navbar & Footer konsisten
 * Halaman admin dibungkus AdminLayout dengan sidebar navigasi
 */
function App() {
    const location = useLocation();

    return (
        // AnimatePresence — Enables smooth cross-fade between page changes
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* 
            Route parent dengan MainLayout sebagai wrapper
            Semua child routes akan di-render di dalam MainLayout (via <Outlet />)
          */}
                <Route element={<MainLayout />}>
                    {/* Halaman utama — URL: / */}
                    <Route path="/" element={<Home />} />

                    {/* Company profile — URL: /about */}
                    <Route path="/about" element={<About />} />

                    {/* Product catalog — URL: /products */}
                    <Route path="/products" element={<Products />} />

                    {/* Detail produk — URL: /products/:id (dynamic route, mirip [id] di Next.js) */}
                    <Route path="/products/:id" element={<ProductDetail />} />

                    {/* Halaman kontak/order — URL: /contact */}
                    <Route path="/contact" element={<Contact />} />

                    {/* Halaman artikel/event — URL: /events */}
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />

                    {/* Halaman galeri — URL: /gallery */}
                    <Route path="/gallery" element={<Gallery />} />

                    {/* Halaman sertifikat — URL: /certificates */}
                    <Route path="/certificates" element={<Certificates />} />
                </Route>

                {/* 
            Route Admin — Login (tanpa layout, halaman full-screen)
          */}
                <Route path="/admin/login" element={<Login />} />

                {/* 
            Route Admin — Dashboard dengan AdminLayout wrapper
            AdminLayout menyediakan Sidebar dan proteksi JWT
          */}
                <Route path="/admin" element={<AdminLayout />}>
                    {/* Dashboard utama — URL: /admin */}
                    <Route index element={<DashboardHome />} />

                    {/* Manajemen Produk — URL: /admin/products */}
                    <Route path="products" element={<ManageProducts />} />

                    {/* Manajemen Artikel — URL: /admin/articles */}
                    <Route path="articles" element={<ManageArticles />} />

                    {/* Manajemen Galeri — URL: /admin/gallery */}
                    <Route path="gallery" element={<ManageGalleries />} />

                    {/* Manajemen Sertifikat — URL: /admin/certificates */}
                    <Route path="certificates" element={<ManageCertificates />} />

                    {/* Manajemen Event — URL: /admin/events */}
                    <Route path="events" element={<ManageEvents />} />

                    {/* Manajemen Kontak — URL: /admin/contacts */}
                    <Route path="contacts" element={<ManageContacts />} />

                    {/* Manajemen Profil — URL: /admin/profile */}
                    <Route path="profile" element={<ManageProfile />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

export default App;
