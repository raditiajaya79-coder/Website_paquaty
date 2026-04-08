/**
 * controllers/announcementController.js — Logika Pengumuman (Popup)
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging
const { deleteFile } = require('../utils/fileHelper'); // Import utility penghapus file

// @desc    Ambil semua pengumuman
exports.getAllAnnouncements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengumuman.' });
  }
};

// @desc    Ambil pengumuman by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengumuman.' });
  }
};

// @desc    Tambah pengumuman baru
exports.createAnnouncement = async (req, res) => {
  const { title, title_en, message, message_en, image, button_text, button_text_en, link, is_active } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, title_en, message, message_en, image, button_text, button_text_en, link, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [title, title_en, message, message_en, image, button_text, button_text_en, link, is_active || false]
    );
    // Catat aktivitas: Menambah Pengumuman
    await logActivity(req.admin.id, 'Menambahkan Pengumuman', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambah pengumuman.' });
  }
};

// @desc    Update pengumuman
exports.updateAnnouncement = async (req, res) => {
  const { title, title_en, message, message_en, image, button_text, button_text_en, link, is_active } = req.body;
  try {
    // Ambil data lama untuk cek gambar
    const oldAnnResult = await pool.query('SELECT image FROM announcements WHERE id = $1', [req.params.id]);
    const oldAnn = oldAnnResult.rows[0];

    const result = await pool.query(
      `UPDATE announcements SET title=$1, title_en=$2, message=$3, message_en=$4, image=$5, button_text=$6, button_text_en=$7, link=$8, is_active=$9, updated_at=NOW()
       WHERE id = $10 RETURNING *`,
      [title, title_en, message, message_en, image, button_text, button_text_en, link, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });
    }

    // Cleanup jika gambar berubah
    if (oldAnn && oldAnn.image && oldAnn.image !== image) {
      await deleteFile(oldAnn.image);
    }

    // Catat aktivitas: Mengubah Pengumuman
    await logActivity(req.admin.id, 'Mengubah Pengumuman', title);

    res.json({ message: 'Pengumuman diperbarui.', announcement: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pengumuman.' });
  }
};

// @desc    Hapus pengumuman
exports.deleteAnnouncement = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });
    }

    // --- CLEANUP FILE ---
    const deletedAnn = result.rows[0];
    if (deletedAnn.image) {
      await deleteFile(deletedAnn.image);
    }

    // Catat aktivitas: Menghapus Pengumuman
    await logActivity(req.admin.id, 'Menghapus Pengumuman', deletedAnn.title);

    res.json({ message: 'Pengumuman dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pengumuman.' });
  }
};
