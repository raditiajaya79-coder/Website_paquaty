/**
 * controllers/settingsController.js — Logika Pengaturan Website
 */
const pool = require('../config/db');

// @desc    Ambil semua pengaturan website
exports.getSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_settings');
    // Ubah array rows menjadi object { key: value } agar mudah dipakai di frontend
    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value === 'true' ? true : (row.value === 'false' ? false : row.value);
      return acc;
    }, {});
    res.json(settings);
  } catch (error) {
    console.error(`[SETTINGS] ❌ Error getSettings: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil pengaturan.' });
  }
};

// @desc    Perbarui satu pengaturan website
exports.updateSetting = async (req, res) => {
  const { key, value } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW() RETURNING *',
      [key, String(value)]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[SETTINGS] ❌ Error updateSetting: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui pengaturan.' });
  }
};
