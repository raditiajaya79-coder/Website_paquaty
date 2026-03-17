/**
 * controllers/certificateController.js — Logika CRUD Sertifikat
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging

exports.getAllCertificates = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certificates ORDER BY is_pinned DESC, id ASC');
    
    // Normalisasi data untuk mencegah error pada database lama yang kolomnya baru ditambahkan
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      is_pinned: row.is_pinned || false,
      is_active: row.is_active !== null ? row.is_active : true,
      year: row.year || ''
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[CERT] ❌ Error getAll: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data sertifikat.' });
  }
};

// @desc    Ambil satu sertifikat berdasarkan ID (untuk mode Edit)
exports.getCertificateById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil parameter ID dari URL
    // Query database untuk mencari sertifikat dengan ID yang cocok
    const result = await pool.query('SELECT * FROM certificates WHERE id = $1', [id]);
    
    // Jika tidak ada data yang ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' }); // Kirim status 404
    }
    res.json(result.rows[0]); // Kirim data sertifikat pertama dalam format JSON
  } catch (error) {
    console.error(`[CERT] ❌ Error fetching by ID: ${error.message}`); // Log error teknis
    res.status(500).json({ error: 'Gagal mengambil data sertifikat.' }); // Kirim pesan error server
  }
};

exports.createCertificate = async (req, res) => {
  const { title, title_en, sub, sub_en, description, description_en, image, issued_by, year, is_pinned, is_active } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO certificates (title, title_en, sub, sub_en, description, description_en, image, issued_by, year, is_pinned, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, title_en, sub, sub_en, description, description_en, image, issued_by, year, is_pinned || false, is_active !== undefined ? is_active : true]
    );
    // Catat aktivitas: Menambah Sertifikat
    await logActivity(req.admin.id, 'Menambahkan Sertifikat', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[CERT] ❌ Error create: ${error.message}`);
    res.status(500).json({ error: 'Gagal menambah sertifikat.' });
  }
};

exports.updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { title, title_en, sub, sub_en, description, description_en, image, issued_by, year, is_pinned, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE certificates SET title = $1, title_en = $2, sub = $3, sub_en = $4, description = $5, description_en = $6, image = $7, issued_by = $8, year = $9, is_pinned = $10, is_active = $11
       WHERE id = $12 RETURNING *`,
      [title, title_en, sub, sub_en, description, description_en, image, issued_by, year, is_pinned, is_active, id]
    );
    // Catat aktivitas: Mengubah Sertifikat
    await logActivity(req.admin.id, 'Mengubah Data Sertifikat', title);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[CERT] ❌ Error update: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui sertifikat.' });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM certificates WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
    }

    // Catat aktivitas: Menghapus Sertifikat
    await logActivity(req.admin.id, 'Menghapus Sertifikat', result.rows[0].title);

    res.json({ message: 'Sertifikat dihapus.' });
  } catch (error) {
    console.error(`[CERT] ❌ Error delete: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus sertifikat.' });
  }
};
