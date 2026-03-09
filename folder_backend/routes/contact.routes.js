/**
 * routes/contact.routes.js — Route CRUD Kontak & Media Sosial
 * Endpoint publik: GET (semua)
 * Endpoint admin: POST, DELETE (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/contacts — Ambil semua kontak/medsos
 * Endpoint publik
 */
router.get('/', async (req, res) => {
  try {
    // Ambil semua kontak, urutkan berdasarkan ID
    const result = await pool.query('SELECT * FROM contacts ORDER BY id ASC');
    res.json(result.rows); // Kirim array kontak
  } catch (error) {
    console.error('Error GET contacts:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data kontak.' });
  }
});

/**
 * POST /api/contacts — Tambah kontak/medsos baru
 * Memerlukan autentikasi admin (JWT)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { platform, value, location } = req.body;

    // Validasi: pastikan platform dan value dikirim
    if (!platform || !value) {
      return res.status(400).json({ error: 'Platform dan value wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO contacts (platform, value, location)
       VALUES ($1, $2, $3) RETURNING *`,
      [platform, value, location || 'both']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error POST contact:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan kontak.' });
  }
});

/**
 * PUT /api/contacts/:id — Update kontak/medsos
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, value, location } = req.body;

    const result = await pool.query(
      `UPDATE contacts SET platform=$1, value=$2, location=$3 WHERE id=$4 RETURNING *`,
      [platform, value, location || 'both', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kontak tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error PUT contact:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate kontak.' });
  }
});

/**
 * DELETE /api/contacts/:id — Hapus kontak/medsos
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kontak tidak ditemukan.' });
    }

    res.json({ message: 'Kontak berhasil dihapus.' });
  } catch (error) {
    console.error('Error DELETE contact:', error.message);
    res.status(500).json({ error: 'Gagal menghapus kontak.' });
  }
});

module.exports = router; // Ekspor router
