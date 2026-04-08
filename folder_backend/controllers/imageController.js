/**
 * controllers/imageController.js — Controller untuk menyajikan gambar dari Minio
 * Bertindak sebagai proxy agar gambar bisa diakses via HTTPS tanpa masalah port/protokol.
 */
const { getImageStream } = require('../utils/minioHelper');
const path = require('path');

/**
 * serveImage — Stream gambar dari Minio ke client
 */
exports.serveImage = async (req, res) => {
    const { filename } = req.params;
    
    try {
        console.log(`[IMAGE-PROXY] 🔍 Meminta gambar: ${filename}`);

        // Ambil stream data dari Minio
        const dataStream = await getImageStream(filename);

        // Jika stream gagal di-output dari Minio
        dataStream.on('error', (err) => {
            console.error(`[IMAGE-PROXY] ❌ Stream Error untuk ${filename}:`, err.message);
            if (!res.headersSent) {
                res.status(500).send('Error streaming image');
            }
        });

        // Set Cache Control agar browser tidak re-fetch terus menerus (1 jam)
        res.setHeader('Cache-Control', 'public, max-age=3600');

        // Deteksi Content-Type berdasarkan ekstensi file
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        res.setHeader('Content-Type', contentType);

        // Pipa data dari Minio langsung ke respon Express
        dataStream.pipe(res);

    } catch (error) {
        console.error(`[IMAGE-PROXY] ❌ Catch Error untuk ${filename}:`, error.message);
        
        if (error.code === 'NoSuchKey' || error.message.includes('not found')) {
            return res.status(404).send('Gambar tidak ditemukan di storage.');
        }
        
        if (!res.headersSent) {
            res.status(500).send('Gagal memuat gambar.');
        }
    }
};
