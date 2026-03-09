/**
 * routes/upload.routes.js — Route untuk Upload Gambar
 * Menangani penyimpanan file fisik ke folder server.
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth'); // Proteksi admin
const router = express.Router();

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Penyimpanan Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Folder tujuan
  },
  filename: function (req, file, cb) {
    // Penamaan file: timestamp + nama original (untuk menghindari duplikasi)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

/**
 * POST /api/upload — Endpoint Upload Single Image
 * Mengembalikan URL lengkap gambar yang bisa diakses publik.
 */
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }

    // Path yang akan disimpan di database (misal: /uploads/namafile.jpg)
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({ 
      message: 'Upload berhasil',
      url: fileUrl 
    });
  } catch (error) {
    console.error('Error Upload:', error.message);
    res.status(500).json({ error: 'Gagal mengunggah file.' });
  }
});

module.exports = router;
