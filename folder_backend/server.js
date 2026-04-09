/**
 * server.js — Entry point aplikasi backend Pakuaty
 * Express.js server yang menghubungkan semua route dan middleware.
 * Stack: Express + PostgreSQL (Railway) + JWT Auth
 */
const express = require('express'); // Framework web utama
const cors = require('cors'); // Middleware untuk Cross-Origin Resource Sharing
const helmet = require('helmet'); // Security HTTP Headers
const rateLimit = require('express-rate-limit'); // Brute-force protection
require('dotenv').config(); // Memuat variabel dari file .env

const initializeDatabase = require('./config/initDb'); // Inisialisasi skema database

// === Import module dasar ===
// Route dan kontroler dihapus sesuai instruksi untuk membersihkan logika CRUD
const app = express(); // Inisialisasi Express app
const PORT = process.env.PORT || 5000; // Port server (dari .env atau default 5000)

// === Middleware Global ===
// 1. Helmet — Proteksi header standar industri (mencegah XSS, Clickjacking)
app.use(helmet());
// Khusus untuk gambar yang diload dari domain beda, atur kebijakan cross-origin
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// 2. CORS — Mencegah website asing menembak API diam-diam
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? '*' : function (origin, callback) {
    if (!origin || origin === allowedOrigin || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Akses Ditolak dari origin ini.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// 3. General Rate Limiter (Proteksi DDoS level dasar untuk API)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 300, // 300 request per IP (cukup longgar untuk web pengunjung reguler)
  message: { error: 'Terlalu banyak permintaan API. Coba lagi dalam 15 menit.' }
});
app.use('/api/', apiLimiter);

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

// === Global Error Handler (Pencegah Crash Fatal) ===
// Menangkap semua throw Error() yang lolos agar server Node.js tidak shutdown
app.use((err, req, res, next) => {
  console.error('\n⚠️ [Global Error Caught]:', err.message);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack); // Stack hanya pamer di Dev
  
  res.status(err.status || 500).json({
    error: 'Terjadi kesalahan sistem di server.',
    message: process.env.NODE_ENV !== 'production' ? err.message : 'Internal Server Error'
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
    // Log error dengan detail untuk membantu troubleshooting
    console.error('\n❌ Gagal menjalankan server:');
    console.error(`   Pesan: ${error.message}`);
    
    // Memberikan petunjuk spesifik jika error berkaitan dengan environment variable
    if (error.message.includes('.env')) {
      console.error('   👉 Petunjuk: Periksa file .env Anda. Gunakan .env.example sebagai referensi.\n');
    }
    
    process.exit(1); // Keluar dengan kode error jika gagal
  }
}

// Jalankan server
startServer();
