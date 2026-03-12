/**
 * controllers/authController.js — Logika autentikasi admin
 * Verifikasi kredensial dan pembuatan token JWT.
 */
const pool = require('../config/db'); // Koneksi database
const bcrypt = require('bcryptjs'); // Library hashing
const jwt = require('jsonwebtoken'); // Library token

/**
 * login — Handler untuk login admin
 * Mengambil username & password dari body, validasi, dan kirim token.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Cari admin berdasarkan username
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    // 2. Jika admin tidak ditemukan
    if (!admin) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    // 3. Verifikasi password hash
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    // 4. Pastikan JWT_SECRET tersedia
    if (!process.env.JWT_SECRET) {
      console.error('[AUTH] ❌ JWT_SECRET tidak terdefinisi di .env!');
      return res.status(500).json({ error: 'Konfigurasi server bermasalah.' });
    }

    // 5. Buat token JWT (berlaku 24 jam)
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Kirim respon sukses beserta token
    res.json({
      message: 'Login berhasil.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error(`[AUTH] ❌ Error Login: ${error.message}`);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * getCurrentAdmin — Mengambil data admin yang sedang login (payload dari token)
 */
exports.getCurrentAdmin = (req, res) => {
  res.json(req.admin); // Data admin sudah dimasukkan ke req oleh authMiddleware
};
