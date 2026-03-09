/**
 * routes/auth.routes.js — Route autentikasi admin
 * Menangani login admin dan menghasilkan JWT token.
 */
const express = require('express'); // Framework web
const bcrypt = require('bcryptjs'); // Library hashing password
const jwt = require('jsonwebtoken'); // Library JWT
const pool = require('../config/db'); // Koneksi database
const router = express.Router(); // Router Express

/**
 * POST /api/auth/login — Login admin
 * Menerima email dan password, memverifikasi terhadap database,
 * lalu mengembalikan JWT token jika berhasil.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Ambil kredensial dari body request

    // Validasi: pastikan email dan password dikirim
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    // Cari admin berdasarkan email di database
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    // Jika email tidak ditemukan
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const admin = result.rows[0]; // Data admin dari database

    // Bandingkan password yang diinput dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    // Jika password tidak cocok
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Buat JWT token dengan masa berlaku 24 jam
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '24h' } // Masa berlaku
    );

    // Kirim response sukses dengan token dan info admin
    res.json({
      message: 'Login berhasil',
      token, // JWT token untuk autentikasi selanjutnya
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error login:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

module.exports = router; // Ekspor router
