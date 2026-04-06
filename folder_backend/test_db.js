/**
 * test_db.js
 * Skrip sederhana untuk menguji koneksi ke PostgreSQL menggunakan konfigurasi terpusat.
 */
const pool = require('./config/db'); // Mengimpor pool yang sudah dikonfigurasi

console.log('⏳ Mencoba menghubungkan ke PostgreSQL...');
console.log('Konfigurasi Host:', process.env.DB_HOST || 'DATABASE_PUBLIC_URL');

// Mencoba melakukan query sederhana untuk memastikan koneksi aktif
pool.query('SELECT NOW()')
    .then(res => {
        console.log('✅ Koneksi Berhasil!');
        console.log('Waktu Server:', res.rows[0].now); // Menampilkan waktu dari database
        process.exit(0); // Keluar dengan sukses
    })
    .catch(err => {
        console.error('❌ Koneksi Gagal:', err.message); // Melaporkan kesalahan
        process.exit(1); // Keluar dengan kode error
    });
