/**
 * server.js — Entry point aplikasi backend Pakuaty
 * Express.js server yang menghubungkan semua route dan middleware.
 * Stack: Express + PostgreSQL (Railway) + JWT Auth
 */
const express = require('express'); // Framework web utama
const cors = require('cors'); // Middleware untuk Cross-Origin Resource Sharing
require('dotenv').config(); // Memuat variabel dari file .env

const initializeDatabase = require('./config/initDb'); // Inisialisasi skema database

// === Import semua route modules ===
const authRoutes = require('./routes/auth.routes'); // Route autentikasi login
const productRoutes = require('./routes/product.routes'); // Route CRUD produk
const articleRoutes = require('./routes/article.routes'); // Route CRUD artikel
const galleryRoutes = require('./routes/gallery.routes'); // Route CRUD galeri
const certificateRoutes = require('./routes/certificate.routes'); // Route CRUD sertifikat
const eventRoutes = require('./routes/event.routes'); // Route CRUD event
const contactRoutes = require('./routes/contact.routes'); // Route CRUD kontak
const announcementRoutes = require('./routes/announcement.routes'); // Route Manajemen Pengumuman
const uploadRoutes = require('./routes/upload.routes'); // Route Upload Gambar

const app = express(); // Inisialisasi Express app
const PORT = process.env.PORT || 5000; // Port server (dari .env atau default 5000)

// === Middleware Global ===
app.use(cors({
  origin: '*', // Izinkan semua origin di development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

app.use(express.json()); // Parse body request sebagai JSON secara otomatis
app.use('/uploads', express.static('uploads')); // Sajikan folder uploads secara statis

// === Mount Routes ===
// Setiap route group di-mount di prefix /api/*
app.use('/api/auth', authRoutes); // /api/auth/login
app.use('/api/products', productRoutes); // /api/products (GET/POST/PUT/DELETE)
app.use('/api/articles', articleRoutes); // /api/articles (GET/POST/PUT/DELETE)
app.use('/api/galleries', galleryRoutes); // /api/galleries (GET/POST/PUT/DELETE)
app.use('/api/certificates', certificateRoutes); // /api/certificates (GET/POST/PUT/DELETE)
app.use('/api/events', eventRoutes); // /api/events (GET/POST/DELETE)
app.use('/api/contacts', contactRoutes); // /api/contacts (GET/POST/DELETE)
app.use('/api/announcements', announcementRoutes); // /api/announcements (GET/PUT)
app.use('/api/upload', uploadRoutes); // Endpoint untuk upload file

// === Route Root — Health check sederhana ===
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Pakuaty Backend API aktif!',
    version: '1.0.0',
    endpoints: [
      'GET /api/products',
      'GET /api/articles',
      'GET /api/galleries',
      'GET /api/certificates',
      'GET /api/events',
      'GET /api/contacts',
      'POST /api/auth/login'
    ]
  });
});

/**
 * startServer — Inisialisasi database, lalu jalankan server
 * Tabel dibuat secara otomatis saat server pertama kali start.
 */
async function startServer() {
  try {
    // Buat semua tabel yang diperlukan (idempotent — aman dijalankan berulang)
    await initializeDatabase();

    // Mulai listen di port yang dikonfigurasi
    app.listen(PORT, () => {
      console.log(`\n🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📦 API tersedia di http://localhost:${PORT}/api`);
      console.log(`🔑 Login admin di POST http://localhost:${PORT}/api/auth/login\n`);
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error.message);
    process.exit(1); // Keluar dengan kode error jika gagal
  }
}

// Jalankan server
startServer();
