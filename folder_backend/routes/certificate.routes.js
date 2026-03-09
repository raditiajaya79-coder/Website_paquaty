/**
 * routes/certificate.routes.js — Route CRUD Sertifikat
 * Endpoint publik: GET (semua)
 * Endpoint admin: POST, PUT, DELETE (memerlukan JWT)
 * 
 * Fitur: is_active toggle — kontrol tampil/sembunyikan sertifikat dari dashboard
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/certificates — Ambil semua sertifikat
 * Endpoint publik, yang dipinned muncul di atas
 * Response menyertakan field isActive untuk kontrol visibility
 */
router.get('/', async (req, res) => {
  try {
    // Urutkan: pinned dulu, lalu berdasarkan ID
    const result = await pool.query('SELECT * FROM certificates ORDER BY is_pinned DESC, id ASC');

    // Mapping snake_case ke camelCase (termasuk isActive)
    const certificates = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      sub: row.sub,
      description: row.description,
      image: row.image,
      issuedBy: row.issued_by,
      isPinned: row.is_pinned,
      isActive: row.is_active !== false // Default true jika kolom belum ada
    }));

    res.json(certificates); // Kirim array sertifikat
  } catch (error) {
    console.error('Error GET certificates:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data sertifikat.' });
  }
});

/**
 * POST /api/certificates — Tambah sertifikat baru
 * Memerlukan autentikasi admin (JWT)
 * isActive default true (baru ditambah = langsung tampil)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, image, issuedBy, isPinned, sub, description, isActive } = req.body;

    const result = await pool.query(
      `INSERT INTO certificates (title, image, issued_by, is_pinned, sub, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, image, issuedBy || '', isPinned || false, sub || '', description || '', isActive !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error POST certificate:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan sertifikat.' });
  }
});

/**
 * PUT /api/certificates/toggle-all — Toggle on/off SEMUA sertifikat sekaligus
 * Memerlukan autentikasi admin (JWT)
 * Body: { isActive: true/false }
 * 
 * PENTING: route ini HARUS didefinisikan SEBELUM /:id
 * agar Express tidak menganggap 'toggle-all' sebagai parameter :id
 */
router.put('/toggle-all', auth, async (req, res) => {
  try {
    const { isActive } = req.body; // Status baru untuk semua sertifikat

    // Update semua row sekaligus
    await pool.query('UPDATE certificates SET is_active = $1', [!!isActive]);

    res.json({ message: `Semua sertifikat berhasil di-${isActive ? 'aktifkan' : 'nonaktifkan'}.` });
  } catch (error) {
    console.error('Error PUT toggle-all certificates:', error.message);
    res.status(500).json({ error: 'Gagal mengubah status semua sertifikat.' });
  }
});

/**
 * PUT /api/certificates/:id — Update sertifikat (termasuk toggle pin & toggle active)
 * Memerlukan autentikasi admin (JWT)
 * Support 3 mode:
 * 1. Toggle isActive saja (hanya kirim isActive)
 * 2. Toggle isPinned saja (hanya kirim isPinned, pattern lama)
 * 3. Update lengkap (kirim semua field)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, issuedBy, isPinned, sub, description, isActive } = req.body;

    // Mode 1: Toggle isActive saja
    if (isActive !== undefined && !title && !image && isPinned === undefined) {
      const result = await pool.query(
        'UPDATE certificates SET is_active=$1 WHERE id=$2 RETURNING *',
        [isActive, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
      return res.json(result.rows[0]);
    }

    // Mode 2: Toggle isPinned saja (pattern lama, tetap dipertahankan)
    if (isPinned !== undefined && !title && !image && isActive === undefined) {
      const result = await pool.query(
        'UPDATE certificates SET is_pinned=$1 WHERE id=$2 RETURNING *',
        [isPinned, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
      return res.json(result.rows[0]);
    }

    // Mode 3: Update lengkap (semua field)
    const result = await pool.query(
      `UPDATE certificates SET title=$1, image=$2, issued_by=$3, is_pinned=$4, sub=$5, description=$6, is_active=$7
       WHERE id=$8 RETURNING *`,
      [title, image, issuedBy, isPinned || false, sub, description, isActive !== false, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error PUT certificate:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate sertifikat.' });
  }
});


/**
 * DELETE /api/certificates/:id — Hapus sertifikat
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM certificates WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
    }

    res.json({ message: 'Sertifikat berhasil dihapus.' });
  } catch (error) {
    console.error('Error DELETE certificate:', error.message);
    res.status(500).json({ error: 'Gagal menghapus sertifikat.' });
  }
});

module.exports = router; // Ekspor router
