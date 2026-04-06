/**
 * config/db.js — Konfigurasi koneksi PostgreSQL
 * Menggunakan Pool dari library 'pg' untuk koneksi yang efisien (connection pooling).
 */
const { Pool } = require('pg'); // Library PostgreSQL untuk Node.js
require('dotenv').config(); // Memuat variabel dari file .env (Memastikan variabel tersedia)

// Opsi konfigurasi koneksi database
let dbConfig;

// Menentukan apakah menggunakan connection string (Railway legacy) atau variabel diskrit (Lokal)
if (process.env.DATABASE_PUBLIC_URL && !process.env.DB_HOST) {
  // Gunakan connection string jika tersedia dan variabel host tidak ada
  dbConfig = {
    connectionString: process.env.DATABASE_PUBLIC_URL, // URL koneksi database legacy
    ssl: {
      rejectUnauthorized: false // Diperlukan untuk koneksi ke database Railway (cloud)
    }
  };
} else {
  // Gunakan variabel diskrit untuk koneksi lokal atau fleksibilitas lebih tinggi
  dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1', // Host server database (default ke loopback)
    port: parseInt(process.env.DB_PORT) || 5432, // Port database (default standard PostgreSQL)
    user: process.env.DB_USER, // Nama pengguna database
    password: process.env.DB_PASSWORD, // Kata sandi pengguna
    database: process.env.DB_NAME, // Nama database yang dituju
    // Konfigurasi SSL secara kondisional (biasanya dinonaktifkan untuk lokal)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

// Membuat instance Pool dengan konfigurasi yang telah ditentukan
const pool = new Pool(dbConfig); // Inisialisasi pool koneksi

// Event listener: log saat koneksi berhasil dibuat ke pool
pool.on('connect', () => {
  console.log(`✅ Terhubung ke PostgreSQL (${process.env.DB_HOST ? 'Lokal: ' + process.env.DB_HOST : 'Cloud/Legacy'})`); // Log informatif
});

// Event listener: log error pada pool connection agar mudah didebug
pool.on('error', (err) => {
  console.error('❌ Error koneksi PostgreSQL:', err.message); // Melaporkan pesan kesalahan teknis
});

module.exports = pool; // Ekspor pool agar bisa dipakai di seluruh aplikasi (Singleton pattern)
