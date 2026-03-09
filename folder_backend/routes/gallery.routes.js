/**
 * routes/gallery.routes.js — Route CRUD Galeri
 * Endpoint publik: GET (semua)
 * Endpoint admin: POST, PUT, DELETE (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/galleries — Ambil semua foto galeri
 * Endpoint publik, foto yang di-pin muncul di atas
 */
router.get('/', async (req, res) => {
  try {
    // Urutkan: yang dipinned dulu, lalu berdasarkan ID
    const result = await pool.query('SELECT * FROM galleries ORDER BY is_pinned DESC, id ASC');

    // Mapping snake_case ke camelCase untuk frontend
    const galleries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      image: row.image,
      span: row.span,
      aspect: row.aspect,
      isPinned: row.is_pinned
    }));

    res.json(galleries); // Kirim array galeri
  } catch (error) {
    console.error('Error GET galleries:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data galeri.' });
  }
});

/**
 * POST /api/galleries — Tambah foto baru ke galeri
 * Memerlukan autentikasi admin (JWT)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, image, isPinned, category } = req.body;

    // Insert foto baru ke database
    const result = await pool.query(
      `INSERT INTO galleries (title, image, is_pinned, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, image, isPinned || false, category || 'General']
    );

    res.status(201).json(result.rows[0]); // Kirim foto yang baru ditambah
  } catch (error) {
    console.error('Error POST gallery:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan foto galeri.' });
  }
});

/**
 * PUT /api/galleries/:id — Update foto galeri (toggle pin, dll)
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, isPinned, category } = req.body;

    // Jika hanya toggle pin (tanpa update field lain)
    if (isPinned !== undefined && !title && !image) {
      const result = await pool.query(
        'UPDATE galleries SET is_pinned=$1 WHERE id=$2 RETURNING *',
        [isPinned, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Foto tidak ditemukan.' });
      return res.json(result.rows[0]);
    }

    // Update lengkap semua field
    const result = await pool.query(
      `UPDATE galleries SET title=$1, image=$2, is_pinned=$3, category=$4 WHERE id=$5 RETURNING *`,
      [title, image, isPinned || false, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error PUT gallery:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate galeri.' });
  }
});

/**
 * DELETE /api/galleries/:id — Hapus foto dari galeri
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM galleries WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    res.json({ message: 'Foto berhasil dihapus dari galeri.' });
  } catch (error) {
    console.error('Error DELETE gallery:', error.message);
    res.status(500).json({ error: 'Gagal menghapus foto.' });
  }
});

module.exports = router; // Ekspor router
