/**
 * utils/logger.js — Utility Pencatatan Aktivitas Admin
 * Digunakan oleh controller untuk mencatat setiap aksi CRUD ke database.
 */
const pool = require('../config/db');

/**
 * logActivity — Menyimpan log baru ke tabel activity_logs
 * @param {number} adminId - ID admin yang melakukan aksi (dari req.user.id)
 * @param {string} action - Deskripsi aksi yang dilakukan (misal: "Mengubah Produk")
 * @param {string} targetName - Nama item yang dipengaruhi (misal: nama produk/judul event)
 */
const logActivity = async (adminId, action, targetName) => {
  try {
    if (!adminId) return; // Skip jika tidak ada ID admin (safety check)
    
    await pool.query(
      'INSERT INTO activity_logs (admin_id, action, target_name) VALUES ($1, $2, $3)',
      [adminId, action, targetName]
    );
  } catch (error) {
    // Kita tidak ingin crash utama hanya karena logging gagal, jadi cukup log ke console
    console.error(`[LOGGER] ❌ Gagal mencatat aktivitas: ${error.message}`);
  }
};

module.exports = { logActivity };
