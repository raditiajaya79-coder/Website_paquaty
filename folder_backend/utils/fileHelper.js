/**
 * utils/fileHelper.js — Helper untuk manajemen file backend
 * Berfungsi untuk menghapus file dari folder /uploads secara aman.
 */
const fs = require('fs'); // Modul File System Node.js
const path = require('path'); // Modul Path Node.js untuk manipulasi alamat file

const { deleteFromMinio } = require('./minioHelper'); // Import helper Minio

/**
 * Menghapus file gambar secara aman (Mendukung lokal dan Minio).
 * @param {string} fileUrl - URL file yang disimpan di DB
 */
exports.deleteFile = async (fileUrl) => {
    // Pastikan parameter tidak kosong
    if (!fileUrl) return;

    try {
        // --- LOGIKA MINIO ---
        // Jika URL diawali dengan http/https, kita asumsikan ini adalah file Minio
        if (fileUrl.startsWith('http')) {
            await deleteFromMinio(fileUrl);
            return;
        }

        // --- LOGIKA LOKAL (Backward Compatibility) ---
        // Ambil nama file dari URL (bagian terakhir setelah "/")
        const fileName = decodeURIComponent(fileUrl.split('/').pop());

        // Lokasi absolut folder 'uploads' relatif terhadap file ini
        const filePath = path.join(__dirname, '../uploads', fileName);

        // Cek apakah file benar-benar ada di disk sebelum menghapus
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`[FILEHELPER] ❌ Gagal menghapus file lokal "${fileName}":`, err.message);
                } else {
                    console.log(`[FILEHELPER] ✅ Berhasil menghapus file fisik: "${fileName}"`);
                }
            });
        }
    } catch (error) {
        console.error(`[FILEHELPER] ❌ Error saat memproses penghapusan:`, error.message);
    }
};
