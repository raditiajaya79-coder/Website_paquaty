/**
 * routes/event.routes.js — Route CRUD Event/Kegiatan
 * Endpoint publik: GET (semua)
 * Endpoint admin: POST, DELETE (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/events — Ambil semua event
 * Endpoint publik, yang mendatang muncul duluan
 */
router.get('/', async (req, res) => {
  try {
    // Urutkan: upcoming dulu, lalu berdasarkan tanggal
    const result = await pool.query(`SELECT * FROM events ORDER BY 
      CASE WHEN status = 'upcoming' THEN 0 ELSE 1 END, id DESC`);
    res.json(result.rows); // Kirim array event
  } catch (error) {
    console.error('Error GET events:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data event.' });
  }
});

/**
 * POST /api/events — Tambah event baru
 * Memerlukan autentikasi admin (JWT)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, image, status } = req.body;

    const result = await pool.query(
      `INSERT INTO events (title, description, date, location, image, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, date, location, image, status || 'upcoming']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error POST event:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan event.' });
  }
});

/**
 * PUT /api/events/:id — Update event
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, image, status } = req.body;

    const result = await pool.query(
      `UPDATE events SET title=$1, description=$2, date=$3, location=$4, image=$5, status=$6
       WHERE id=$7 RETURNING *`,
      [title, description, date, location, image, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error PUT event:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate event.' });
  }
});

/**
 * DELETE /api/events/:id — Hapus event
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan.' });
    }

    res.json({ message: 'Event berhasil dihapus.' });
  } catch (error) {
    console.error('Error DELETE event:', error.message);
    res.status(500).json({ error: 'Gagal menghapus event.' });
  }
});

module.exports = router; // Ekspor router
