/**
 * middleware/upload.js — Middleware Konfigurasi Multer
 * Menangani penyimpanan file fisik yang diunggah dari device ke folder /uploads.
 */
const multer = require('multer'); // Library pengolah multipart/form-data
const path = require('path'); // Node.js path utility
const fs = require('fs'); // File system utility

// Pastikan folder uploads ada (buat jika belum)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Penyimpanan (Memory)
// Kita menggunakan memoryStorage karena file akan langsung diunggah ke Minio
// tanpa perlu disimpan sementara di disk server backend.
const storage = multer.memoryStorage();

// Filter File (Hanya izinkan gambar)
const fileFilter = (req, file, cb) => {
  // Hanya izinkan format gambar populer
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Lolos filter
  } else {
    // Beri pesan error jika format tidak sesuai
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.'), false);
  }
};

// Inisialisasi Multer dengan kapasitas maksimal 5MB
const upload = multer({
  storage: storage, // Gunakan memory storage
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batas 5MB per file
  }
});

module.exports = upload; // Ekspor middleware siap pakai
