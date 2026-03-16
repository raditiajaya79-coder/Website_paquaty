/**
 * config/db.js — Konfigurasi koneksi PostgreSQL
 * Menggunakan Pool dari library 'pg' untuk koneksi yang efisien (connection pooling).
 */
const { Pool } = require('pg'); // Library PostgreSQL untuk Node.js
require('dotenv').config(); // Memuat variabel dari file .env

// Validasi environment variable sebelum inisialisasi pool
if (!process.env.DATABASE_PUBLIC_URL) {
  // Melempar error instruktif jika konfigurasi database tidak ditemukan
  throw new Error('❌ DATABASE_PUBLIC_URL tidak ditemukan di file .env. Pastikan file .env sudah ada di folder_backend.');
}

// Membuat instance Pool dengan connection string dari environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL, // URL koneksi database Railway
  ssl: {
    rejectUnauthorized: false // Diperlukan untuk koneksi ke database Railway (cloud)
  }
});

// Event listener: log saat koneksi berhasil dibuat
pool.on('connect', () => {
  console.log('✅ Terhubung ke PostgreSQL (Railway)');
});

// Event listener: log error pada pool connection
pool.on('error', (err) => {
  console.error('❌ Error koneksi PostgreSQL:', err.message);
});

module.exports = pool; // Ekspor pool agar bisa dipakai di seluruh aplikasi
