/**
 * controllers/journeyController.js — CRUD Langkah Proses Heritage
 * Mengelola step-step proses produksi yang tampil di halaman utama.
 * Maksimal 6 langkah, fleksibel bisa 2-6.
 */
const pool = require('../config/db'); // Koneksi database PostgreSQL
const { logActivity } = require('../utils/logger'); // Utility logging aktivitas

// @desc    Ambil semua journey steps (urut berdasarkan step_number)
exports.getAllJourneySteps = async (req, res) => {
  try {
    // Query semua step, diurutkan berdasarkan nomor langkah
    const result = await pool.query('SELECT * FROM journey_steps ORDER BY step_number ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(`[JOURNEY] ❌ Error getAllJourneySteps: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data journey steps.' });
  }
};

// @desc    Ambil satu journey step berdasarkan ID
exports.getJourneyStepById = async (req, res) => {
  try {
    const { id } = req.params; // ID dari parameter URL
    const result = await pool.query('SELECT * FROM journey_steps WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey step tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[JOURNEY] ❌ Error getById: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data journey step.' });
  }
};

// @desc    Buat journey step baru (maksimal 6)
exports.createJourneyStep = async (req, res) => {
  const { step_number, title, title_en, description, description_en, icon } = req.body;
  try {
    // Cek batas maksimal 6 langkah
    const countResult = await pool.query('SELECT COUNT(*) FROM journey_steps');
    if (parseInt(countResult.rows[0].count) >= 6) {
      return res.status(400).json({ error: 'Maksimal 6 langkah proses. Hapus salah satu terlebih dahulu.' });
    }

    // Insert step baru ke tabel
    const result = await pool.query(
      `INSERT INTO journey_steps (step_number, title, title_en, description, description_en, icon, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [step_number || 1, title, title_en || '', description, description_en || '', icon || 'Sprout']
    );

    // Catat aktivitas admin
    await logActivity(req.admin.id, 'Menambah Journey Step', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[JOURNEY] ❌ Error create: ${error.message}`);
    res.status(500).json({ error: 'Gagal menambah journey step.' });
  }
};

// @desc    Update journey step berdasarkan ID
exports.updateJourneyStep = async (req, res) => {
  const { id } = req.params;
  const { step_number, title, title_en, description, description_en, icon } = req.body;
  try {
    const result = await pool.query(
      `UPDATE journey_steps 
       SET step_number=$1, title=$2, title_en=$3, description=$4, description_en=$5, icon=$6
       WHERE id=$7 RETURNING *`,
      [step_number, title, title_en || '', description, description_en || '', icon || 'Sprout', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey step tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[JOURNEY] ❌ Error update: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui journey step.' });
  }
};

// @desc    Hapus journey step berdasarkan ID
exports.deleteJourneyStep = async (req, res) => {
  const { id } = req.params;

  // Validasi ID
  if (isNaN(id) || parseInt(id) > 2147483647) {
    return res.status(400).json({ error: 'ID tidak valid.' });
  }

  try {
    const result = await pool.query('DELETE FROM journey_steps WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey step tidak ditemukan atau sudah dihapus.' });
    }

    // Catat aktivitas
    await logActivity(req.admin.id, 'Menghapus Journey Step', result.rows[0]?.title || 'ID: ' + id);

    res.json({ message: 'Journey step berhasil dihapus.' });
  } catch (error) {
    console.error(`[JOURNEY] ❌ Error delete: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus journey step.' });
  }
};
