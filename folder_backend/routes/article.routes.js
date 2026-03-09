/**
 * routes/article.routes.js — Route CRUD Artikel
 * Endpoint publik: GET (semua & detail)
 * Endpoint admin: POST, PUT, DELETE (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/articles — Ambil semua artikel
 * Endpoint publik, urutkan berdasarkan terbaru
 */
router.get('/', async (req, res) => {
  try {
    // Query semua artikel, terbaru di atas
    const result = await pool.query('SELECT * FROM articles ORDER BY id DESC');
    res.json(result.rows); // Kirim array artikel
  } catch (error) {
    console.error('Error GET articles:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data artikel.' });
  }
});

/**
 * GET /api/articles/:id — Ambil detail satu artikel
 * Endpoint publik
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    res.json(result.rows[0]); // Kirim detail artikel
  } catch (error) {
    console.error('Error GET article detail:', error.message);
    res.status(500).json({ error: 'Gagal mengambil detail artikel.' });
  }
});

/**
 * POST /api/articles — Tambah artikel baru
 * Memerlukan autentikasi admin (JWT)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image, excerpt, date, author, category } = req.body;

    // Insert artikel baru ke database
    const result = await pool.query(
      `INSERT INTO articles (title, content, image, excerpt, date, author, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, content, image, excerpt || '', date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), author || 'Admin', category || 'General']
    );

    res.status(201).json(result.rows[0]); // Kirim artikel yang baru dibuat
  } catch (error) {
    console.error('Error POST article:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan artikel.' });
  }
});

/**
 * PUT /api/articles/:id — Update artikel
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, excerpt, date, author, category } = req.body;

    const result = await pool.query(
      `UPDATE articles SET title=$1, content=$2, image=$3, excerpt=$4, date=$5, author=$6, category=$7
       WHERE id=$8 RETURNING *`,
      [title, content, image, excerpt, date, author, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    res.json(result.rows[0]); // Kirim artikel yang diupdate
  } catch (error) {
    console.error('Error PUT article:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate artikel.' });
  }
});

/**
 * DELETE /api/articles/:id — Hapus artikel
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    res.json({ message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    console.error('Error DELETE article:', error.message);
    res.status(500).json({ error: 'Gagal menghapus artikel.' });
  }
});

module.exports = router; // Ekspor router
