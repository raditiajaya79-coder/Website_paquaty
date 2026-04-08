/**
 * controllers/galleryController.js — Logika CRUD Galeri
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging
const { deleteFile } = require('../utils/fileHelper'); // Import utility penghapus file

// @desc    Ambil semua foto galeri
exports.getAllGallery = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM galleries ORDER BY id DESC');
    
    // Normalisasi data untuk galeri:
    // is_pinned: Nilai boolean default false jika null.
    // span/aspect: Nilai default string jika null agar layout tidak pecah.
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      is_pinned: row.is_pinned || false,
      span: row.span || 'md:col-span-4',
      aspect: row.aspect || 'aspect-square'
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[GALLERY] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data galeri.' });
  }
};

// @desc    Ambil satu foto berdasarkan ID
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM galleries WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[GALLERY] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil detail foto.' });
  }
};

// @desc    Tambah foto galeri baru
exports.createGallery = async (req, res) => {
  const { title, title_en, category, image, span, aspect, is_pinned } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO galleries (title, title_en, category, image, span, aspect, is_pinned)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, title_en, category, image, span, aspect, is_pinned || false]
    );
    // Catat aktivitas: Menambah Galeri
    await logActivity(req.admin.id, 'Menambahkan Foto Galeri', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[GALLERY] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menambah foto galeri.' });
  }
};

// @desc    Update foto galeri
exports.updateGallery = async (req, res) => {
  const { id } = req.params;
  const { title, title_en, category, image, span, aspect, is_pinned } = req.body;
  try {
    // Ambil data galeri lama untuk dicek gambarnya
    const oldGalleryResult = await pool.query('SELECT image FROM galleries WHERE id = $1', [id]);
    const oldGallery = oldGalleryResult.rows[0];

    const result = await pool.query(
      `UPDATE galleries SET title = $1, title_en = $2, category = $3, image = $4, span = $5, aspect = $6, is_pinned = $7
       WHERE id = $8 RETURNING *`,
      [title, title_en, category, image, span, aspect, is_pinned || false, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    // Bersihkan file lama jika gambar berubah
    if (oldGallery && oldGallery.image && oldGallery.image !== image) {
      await deleteFile(oldGallery.image);
    }

    // Catat aktivitas: Mengubah Galeri
    await logActivity(req.admin.id, 'Mengubah Foto Galeri', title);

    res.json({ message: 'Foto galeri berhasil diperbarui.', gallery: result.rows[0] });
  } catch (error) {
    console.error(`[GALLERY] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui foto galeri.' });
  }
};

// @desc    Hapus foto galeri
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM galleries WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    // --- CLEANUP FILE ---
    const deletedGallery = result.rows[0];
    if (deletedGallery.image) {
      await deleteFile(deletedGallery.image);
    }

    // Catat aktivitas: Menghapus Galeri
    await logActivity(req.admin.id, 'Menghapus Foto Galeri', deletedGallery.title);

    res.json({ message: 'Foto berhasil dihapus dari galeri.' });
  } catch (error) {
    console.error(`[GALLERY] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus foto galeri.' });
  }
};
