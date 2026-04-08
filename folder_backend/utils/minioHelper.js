/**
 * utils/minioHelper.js — Utility untuk operasi Minio
 * Menangani upload dan delete file di bucket Minio.
 */
const minioClient = require('../config/minio');
const path = require('path');
require('dotenv').config();

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'pakuaty-image';

/**
 * Mengunggah file buffer ke Minio
 * @param {Object} file - Objek file dari multer (req.file)
 * @returns {Promise<string>} - URL Proxy untuk mengakses gambar
 */
exports.uploadToMinio = async (file) => {
  // 1. Buat nama file unik
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const cleanFileName = file.originalname.replace(/\s+/g, '-').toLowerCase();
  const fileName = `${uniqueSuffix}-${cleanFileName}`;

  // 2. Metadata file
  const metaData = {
    'Content-Type': file.mimetype
  };

  // 3. Upload ke Minio
  await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, metaData);

  // 4. Kembalikan URL Proxy (Internal Backend)
  // Menggunakan APP_URL dari .env agar konsisten (selalu Production URL di Database)
  const baseUrl = process.env.APP_URL || 'https://api-pakuaty.kediritechnopark.com';
  return `${baseUrl}/api/view-image/${fileName}`;
};

/**
 * Mendapatkan aliran data (stream) objek dari Minio
 * @param {string} fileName - Nama file di bucket
 * @returns {Promise<Stream>} - Stream data dari Minio
 */
exports.getImageStream = async (fileName) => {
  return await minioClient.getObject(BUCKET_NAME, fileName);
};

/**
 * Menghapus file dari Minio berdasarkan URL atau Nama File
 * @param {string} fileUrlOrName - URL lengkap atau nama file
 */
exports.deleteFromMinio = async (fileUrlOrName) => {
  try {
    if (!fileUrlOrName) return;

    // Ambil nama file dari URL (jika berupa URL)
    const fileName = fileUrlOrName.split('/').pop();

    // Hapus dari Minio
    await minioClient.removeObject(BUCKET_NAME, fileName);
    console.log(`[MINIO] ✅ Berhasil menghapus objek: ${fileName}`);
  } catch (error) {
    console.error(`[MINIO] ❌ Gagal menghapus objek: ${error.message}`);
  }
};
