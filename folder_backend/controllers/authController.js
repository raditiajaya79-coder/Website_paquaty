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
 * getCurrentAdmin — Mengambil data admin terbaru dari database (berdasarkan ID di token)
 * Berguna untuk memastikan dashboard mendapatkan data terbaru (username/fullname) 
 * meskipun data di token belum diperbarui.
 */
exports.getCurrentAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id; // Ambil ID dari token JWT

    // Ambil data admin terbaru dari database (Kecuali password_hash)
    const result = await pool.query(
      'SELECT id, username, full_name, role, created_at FROM admins WHERE id = $1',
      [adminId]
    );

    // Jika admin tidak ditemukan (misal: akun dihapus saat sesi aktif)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data admin tidak ditemukan.' });
    }

    // Mengirim data admin terbaru ke frontend
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[AUTH] ❌ Get Current Admin Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memuat profil admin.' });
  }
};

/**
 * updateUsername — Mengubah username admin yang sedang login.
 * @route PUT /api/auth/username
 * Validasi: username baru tidak boleh kosong dan tidak boleh duplikat.
 */
exports.updateUsername = async (req, res) => {
  const { username } = req.body; // Ambil username baru dari body
  const adminId = req.admin.id; // ID admin dari token JWT

  try {
    // Validasi: username tidak boleh kosong
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username minimal 3 karakter.' });
    }

    // Cek apakah username sudah dipakai admin lain
    const exists = await pool.query(
      'SELECT id FROM admins WHERE username = $1 AND id != $2',
      [username.trim(), adminId]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Username sudah digunakan.' });
    }

    // Update username di database
    await pool.query('UPDATE admins SET username = $1 WHERE id = $2', [username.trim(), adminId]);

    res.json({ message: 'Username berhasil diperbarui.' });
  } catch (error) {
    console.error(`[AUTH] ❌ Update Username Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui username.' });
  }
};

/**
 * updatePassword — Mengubah password admin yang sedang login.
 * @route PUT /api/auth/password
 * Validasi: password lama harus cocok, password baru minimal 6 karakter.
 */
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body; // Ambil password lama dan baru
  const adminId = req.admin.id; // ID admin dari token JWT

  try {
    // Validasi: pastikan semua field terisi
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Semua field password wajib diisi.' });
    }

    // Validasi: panjang password baru
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
    }

    // Ambil password hash saat ini dari database
    const result = await pool.query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin tidak ditemukan.' });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password lama tidak cocok.' });
    }

    // Hash password baru dan simpan ke database
    const salt = await bcrypt.genSalt(10); // Generate salt 10 rounds
    const newHash = await bcrypt.hash(newPassword, salt); // Hash password baru
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [newHash, adminId]);

    res.json({ message: 'Password berhasil diperbarui.' });
  } catch (error) {
    console.error(`[AUTH] ❌ Update Password Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui password.' });
  }
};
