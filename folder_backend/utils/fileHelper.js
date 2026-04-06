/**
 * utils/fileHelper.js — Helper untuk manajemen file backend
 * Berfungsi untuk menghapus file dari folder /uploads secara aman.
 */
const fs = require('fs'); // Modul File System Node.js
const path = require('path'); // Modul Path Node.js untuk manipulasi alamat file

/**
 * Menghapus file gambar dari folder uploads secara aman.
 * @param {string} fileUrl - URL file yang disimpan di DB (contoh: "/uploads/image.jpg")
 */
exports.deleteFile = (fileUrl) => {
    // Pastikan parameter tidak kosong
    if (!fileUrl) return;

    try {
        // Ambil nama file dari URL (bagian terakhir setelah "/")
        // Gunakan decodeURIComponent untuk menangani karakter khusus seperti %20 (spasi)
        const fileName = decodeURIComponent(fileUrl.split('/').pop());

        // Lokasi absolut folder 'uploads' relatif terhadap file ini
        const filePath = path.join(__dirname, '../uploads', fileName);

        // Cek apakah file benar-benar ada di disk sebelum menghapus
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`[FILEHELPER] ❌ Gagal menghapus file "${fileName}":`, err.message);
                } else {
                    console.log(`[FILEHELPER] ✅ Berhasil menghapus file fisik: "${fileName}"`);
                }
            });
        } else {
            console.warn(`[FILEHELPER] ⚠️ File tidak ditemukan di server: "${fileName}" (Melewati...)`);
        }
    } catch (error) {
        console.error(`[FILEHELPER] ❌ Error saat memproses penghapusan:`, error.message);
    }
};
