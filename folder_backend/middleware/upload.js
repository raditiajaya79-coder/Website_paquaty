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

// Konfigurasi Penyimpanan (Storage)
const storage = multer.diskStorage({
  // Tentukan folder tujuan penyimpanan
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Simpan ke folder /uploads di backend
  },
  // Tentukan format nama file agar unik dan rapi
  filename: (req, file, cb) => {
    // Format: TIMESTAMP-ORIGINALNAME (Hilangkan spasi untuk keamanan URL)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanFileName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${uniqueSuffix}-${cleanFileName}`);
  }
});

// Filter File (Hanya izinkan gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Izinkan
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.'), false); // Tolak
  }
};

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batas maksimal 5MB
  }
});

module.exports = upload; // Ekspor middleware siap pakai
