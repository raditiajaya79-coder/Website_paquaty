/**
 * routes/announcement.routes.js — Route Manajemen Pengumuman (Popup)
 * Endpoint publik: GET
 * Endpoint admin: PUT (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/announcements — Ambil pengaturan pengumuman (hanya ID 1)
 * Endpoint publik
 */
router.get('/', async (req, res) => {
  try {
    // Selalu ambil record pertama (ID 1)
    const result = await pool.query('SELECT * FROM announcements WHERE id = 1');
    
    // Jika data tidak ada (kasus ekstrem), kirim objek kosong atau default
    if (result.rows.length === 0) {
      return res.json({ is_active: false });
    }
    
    res.json(result.rows[0]); // Kirim data pengumuman
  } catch (error) {
    console.error('Error GET announcement:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data pengumuman.' });
  }
});

/**
 * PUT /api/announcements — Update pengaturan pengumuman
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/', auth, async (req, res) => {
  try {
    const { title, message, image, button_text, link, is_active } = req.body;

    // Update record ID 1 (karena pengaturan popup bersifat tunggal/global)
    const result = await pool.query(
      `UPDATE announcements 
       SET title=$1, message=$2, image=$3, button_text=$4, link=$5, is_active=$6, updated_at=NOW()
       WHERE id=1 RETURNING *`,
      [title, message, image, button_text, link, is_active]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data pengumuman tidak ditemukan.' });
    }

    res.json(result.rows[0]); // Kirim data yang telah diperbarui
  } catch (error) {
    console.error('Error PUT announcement:', error.message);
    res.status(500).json({ error: 'Gagal menyimpan pengumuman.' });
  }
});

module.exports = router; // Ekspor router
