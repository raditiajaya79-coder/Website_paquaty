/**
 * controllers/contactController.js — Logika CRUD Manajemen Kontak
 * Mengelola link sosial media dan informasi kontak perusahaan.
 */
const pool = require('../config/db'); // Koneksi database PostgreSQL
const { logActivity } = require('../utils/logger'); // Import utility logging

// @desc    Ambil semua data kontak
exports.getAllContacts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY id ASC');
    
    // Normalisasi data: Pastikan tidak ada field kritikal yang null agar tidak crash di frontend
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      platform: row.platform || 'Unnamed',
      value: row.value || '',
      icon: row.icon || 'Globe',
      color: row.color || 'text-slate-400',
      show_in_header: row.show_in_header ?? true,
      show_in_footer: row.show_in_footer ?? true
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[CONTACT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data kontak.' });
  }
};

// @desc    Ambil satu data kontak berdasarkan ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params; // Mendapatkan ID dari parameter URL
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data kontak tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[CONTACT] ❌ Error by ID: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data kontak.' });
  }
};

// @desc    Buat data kontak baru
exports.createContact = async (req, res) => {
  const { platform, value, icon, color, show_in_header, show_in_footer } = req.body;
  try {
    // Menyisipkan data baru ke tabel contacts
    const result = await pool.query(
      `INSERT INTO contacts (platform, value, icon, color, show_in_header, show_in_footer)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [platform, value, icon, color, show_in_header || false, show_in_footer || false]
    );
    // Catat aktivitas: Menambah Kontak
    await logActivity(req.admin.id, 'Menambahkan Kontak', platform);

    res.status(201).json(result.rows[0]); // Mengembalikan data yang baru dibuat
  } catch (error) {
    console.error(`[CONTACT] ❌ Error create: ${error.message}`);
    res.status(500).json({ error: 'Gagal menambah data kontak.' });
  }
};

// @desc    Update data kontak berdasarkan ID
exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { platform, value, icon, color, show_in_header, show_in_footer } = req.body;
  try {
    // Memperbarui kolom spesifik berdasarkan ID
    const result = await pool.query(
      `UPDATE contacts 
       SET platform=$1, value=$2, icon=$3, color=$4, show_in_header=$5, show_in_footer=$6
       WHERE id=$7 RETURNING *`,
      [platform, value, icon, color, show_in_header, show_in_footer, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data kontak tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[CONTACT] ❌ Error update: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui data kontak.' });
  }
};

// @desc    Hapus data kontak
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  
  // Validasi ID: Pastikan ID adalah angka dan dalam batas serial PostgreSQL (4-byte integer)
  // Ini mencegah error "integer out of range" jika frontend mengirim Date.now()
  if (isNaN(id) || parseInt(id) > 2147483647) {
    return res.status(400).json({ error: 'ID tidak valid atau item belum tersimpan di database.' });
  }

  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data kontak tidak ditemukan atau sudah dihapus.' });
    }

    // Catat aktivitas: Menghapus Kontak
    await logActivity(req.admin.id, 'Menghapus Kontak', result.rows[0]?.platform || 'ID: ' + id);

    res.json({ message: 'Data kontak berhasil dihapus.' });
  } catch (error) {
    console.error(`[CONTACT] ❌ Error delete: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus data kontak dari server.' });
  }
};
