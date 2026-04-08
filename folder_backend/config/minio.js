/**
 * config/minio.js — Konfigurasi Client Minio
 * Menghubungkan Backend dengan server Minio S3-Compatible.
 */
const Minio = require('minio'); // Library Minio untuk Node.js
require('dotenv').config(); // Load variabel dari .env

// Inisialisasi Minio Client dengan kredensial dari environment variables
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost', // Alamat server Minio
  port: parseInt(process.env.MINIO_PORT) || 9000, // Port server Minio
  useSSL: process.env.MINIO_USE_SSL === 'true', // Gunakan HTTPS jika true
  accessKey: process.env.MINIO_ACCESS_KEY, // Kunci akses
  secretKey: process.env.MINIO_SECRET_KEY // Kunci rahasia
});

// Ekspor client agar bisa digunakan di bagian lain (seperti middleware/util)
module.exports = minioClient;
