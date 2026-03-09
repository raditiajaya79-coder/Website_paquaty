/**
 * middleware/auth.js — Middleware autentikasi JWT
 * Memverifikasi token JWT di header Authorization sebelum mengizinkan akses ke route admin.
 */
const jwt = require('jsonwebtoken'); // Library untuk JSON Web Token
require('dotenv').config(); // Memuat variabel environment

/**
 * authMiddleware — Memeriksa dan memvalidasi JWT dari header request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Fungsi untuk melanjutkan ke middleware/handler berikutnya
 */
function authMiddleware(req, res, next) {
  // Ambil header Authorization (format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  // Jika header tidak ada, tolak akses
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });
  }

  // Ekstrak token dari header (buang prefix "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token menggunakan JWT_SECRET dari .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data admin yang ter-decode ke req.admin agar bisa diakses di handler
    req.admin = decoded;

    // Lanjutkan ke handler berikutnya
    next();
  } catch (error) {
    // Token invalid atau expired
    return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}

module.exports = authMiddleware; // Ekspor middleware
