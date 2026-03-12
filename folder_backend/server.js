/**
 * server.js — Entry point aplikasi backend Pakuaty
 * Express.js server yang menghubungkan semua route dan middleware.
 * Stack: Express + PostgreSQL (Railway) + JWT Auth
 */
const express = require('express'); // Framework web utama
const cors = require('cors'); // Middleware untuk Cross-Origin Resource Sharing
require('dotenv').config(); // Memuat variabel dari file .env

const initializeDatabase = require('./config/initDb'); // Inisialisasi skema database

// === Import module dasar ===
// Route dan kontroler dihapus sesuai instruksi untuk membersihkan logika CRUD
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

// === Routes ===
const apiRoutes = require('./routes/api'); // Import router API
app.use('/api', apiRoutes); // Pasang router di path /api

// === Route Root — Health check sederhana ===
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Pakuaty Backend aktif',
    version: '1.2.0',
    status: 'Operational',
    note: 'CRUD Endpoints are now fully functional and connected to PostgreSQL.'
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
