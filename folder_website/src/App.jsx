// App.jsx — Route definitions (mirip pages/ folder di Next.js)
// Semua halaman didefinisikan di sini sebagai routes
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout — wrapper yang menyediakan Navbar + Footer di semua halaman
import MainLayout from './layouts/MainLayout.jsx';

// Pages — setiap halaman website
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Contact from './pages/Contact.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Certificates from './pages/Certificates.jsx';

/**
 * App — Root component yang mengatur routing
 * Semua halaman dibungkus MainLayout agar Navbar & Footer konsisten
 * Struktur route ini set ara konseptual mirip folder pages/ di Next.js
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
            </Routes>
        </AnimatePresence>
    );
}

export default App;
