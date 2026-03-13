/**
 * controllers/dashboardController.js — Logika Perhitungan Statistik Dashboard
 * Mengambil jumlah data riil dari berbagai tabel database.
 */
const pool = require('../config/db');

// @desc    Ambil statistik ringkasan dashboard
exports.getStats = async (req, res) => {
  try {
    // Jalankan semua query secara paralel untuk performa maksimal
    const [products, galleries, events, certificates, logs] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM galleries'),
      pool.query('SELECT COUNT(*) FROM events'),
      pool.query('SELECT COUNT(*) FROM certificates'),
      pool.query(`
        SELECT l.*, a.full_name as admin_name 
        FROM activity_logs l
        JOIN admins a ON l.admin_id = a.id
        ORDER BY l.created_at DESC
        LIMIT 50
      `)
    ]);

    // Kembalikan objek data yang bersih ke frontend
    res.json({
      totalProducts: parseInt(products.rows[0].count),
      totalGalleries: parseInt(galleries.rows[0].count),
      totalEvents: parseInt(events.rows[0].count),
      totalCertificates: parseInt(certificates.rows[0].count),
      activityLogs: logs.rows // Daftar aktivitas terbaru
    });
  } catch (error) {
    console.error(`[DASHBOARD] ❌ Stats Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memuat statistik dashboard.' });
  }
};

/**
 * deleteLog — Menghapus satu log aktivitas berdasarkan ID.
 * @route DELETE /api/dashboard/logs/:id
 */
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL
    const result = await pool.query('DELETE FROM activity_logs WHERE id = $1', [id]); // Hapus dari database
    // Cek apakah ada baris yang terhapus
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Log tidak ditemukan.' });
    }
    res.json({ message: 'Log berhasil dihapus.' });
  } catch (error) {
    console.error(`[DASHBOARD] ❌ Delete Log Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus log.' });
  }
};

/**
 * deleteAllLogs — Menghapus SEMUA log aktivitas dari database.
 * @route DELETE /api/dashboard/logs
 */
exports.deleteAllLogs = async (req, res) => {
  try {
    await pool.query('DELETE FROM activity_logs'); // Hapus semua baris
    res.json({ message: 'Semua log berhasil dihapus.' });
  } catch (error) {
    console.error(`[DASHBOARD] ❌ Delete All Logs Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus semua log.' });
  }
};
