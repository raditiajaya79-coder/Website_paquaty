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
        LIMIT 5
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
