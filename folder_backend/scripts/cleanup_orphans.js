/**
 * scripts/cleanup_orphans.js — Script Pembersih File Yatim (v2 - Resilient)
 * Menghapus file di folder 'uploads' yang sudah tidak direferensikan lagi di database.
 */
const fs = require('fs'); // Modul File System Node.js
const path = require('path'); // Modul Path Node.js
const pool = require('../config/db'); // Koneksi database utama

// --- KONFIGURASI ---
// Jika true, script hanya akan mencatatkan file yang akan dihapus tanpa benar-benar menghapusnya.
// Ubah menjadi false jika sudah yakin ingin mengeksekusi penghapusan permanen.
const DRY_RUN = false; 

// Folder goal kita (uploads)
const UPLOAD_DIR = path.join(__dirname, '../uploads');

/**
 * Normalisasi path file: Mengambil nama file saja dari URL database.
 * Decode URI digunakan agar cocok dengan nama file fisik di disk.
 */
const getFileName = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
        return decodeURIComponent(url.split('/').pop());
    } catch (e) {
        return url.split('/').pop();
    }
};

async function cleanup() {
    console.log(`\n--- [CLEANUP ORPHANS] Memulai Pemindaian Resilien... ---`);
    console.log(`[DRY_RUN]: ${DRY_RUN ? 'AKTIF (TIDAK MENGHAPUS)' : 'NONAKTIF (AKAN MENGHAPUS PERMANEN)'}\n`);

    let client;
    try {
        // Ambil satu koneksi khusus agar tidak terkena ECONNRESET di tengah jalan (Railway-safe)
        client = await pool.connect();
        console.log(`✅ Koneksi database berhasil dibuka.\n`);

        // --- 1. AMBIL SEMUA REFERENSI FILE DARI DATABASE ---
        console.log(`[1/3] Mengumpulkan nama file aktif dari database...`);
        const activeFiles = new Set();

        const queries = [
            { table: 'products', columns: ['image', 'detail_image'] },
            { table: 'articles', columns: ['image'] },
            { table: 'events', columns: ['image'] },
            { table: 'galleries', columns: ['image'] },
            { table: 'certificates', columns: ['image'] },
            { table: 'announcements', columns: ['image'] }
        ];

        for (const q of queries) {
            try {
                // Cek apakah tabel ada (untuk menghindari crash)
                const tableCheck = await client.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = $1
                    );
                `, [q.table]);

                if (!tableCheck.rows[0].exists) {
                    console.log(`  ⚠️  Tabel '${q.table}' tidak ditemukan, melewati...`);
                    continue;
                }

                const result = await client.query(`SELECT ${q.columns.join(', ')} FROM ${q.table}`);
                result.rows.forEach(row => {
                    q.columns.forEach(col => {
                        const fileName = getFileName(row[col]);
                        if (fileName && fileName.trim() !== '') {
                            activeFiles.add(fileName);
                        }
                    });
                });
                console.log(`  ✅ Tabel '${q.table}': Selesai dipindai.`);
            } catch (err) {
                console.error(`  ❌ Error memindai tabel '${q.table}':`, err.message);
            }
        }

        console.log(`\nTotal file unik di database: ${activeFiles.size}`);

        // --- 2. PINDAI FOLDER UPLOADS ---
        console.log(`\n[2/3] Membaca folder 'uploads'...`);
        if (!fs.existsSync(UPLOAD_DIR)) {
            console.log(`❌ Folder 'uploads' tidak ditemukan.`);
            return;
        }

        const physicalFiles = fs.readdirSync(UPLOAD_DIR);
        console.log(`Total file fisik di server: ${physicalFiles.length}`);

        // --- 3. BANDINGKAN DAN HAPUS ---
        console.log(`\n[3/3] Eksekusi pembersihan...`);
        let deletedCount = 0;
        let skippedCount = 0;

        for (const file of physicalFiles) {
            // Abaikan file .gitkeep atau folder (jika ada)
            if (file === '.gitkeep' || fs.lstatSync(path.join(UPLOAD_DIR, file)).isDirectory()) {
                continue;
            }

            if (activeFiles.has(file)) {
                skippedCount++;
                continue;
            }

            const filePath = path.join(UPLOAD_DIR, file);
            if (DRY_RUN) {
                console.log(`[SIMULASI] Menghapus: ${file}`);
            } else {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`[HAPUS] : ${file}`);
                } catch (err) {
                    console.error(`[ERROR] Gagal hapus ${file}:`, err.message);
                }
            }
            deletedCount++;
        }

        console.log(`\n--- HASIL AKHIR ---`);
        console.log(`  - File Aktif (Dipertahankan): ${skippedCount}`);
        console.log(`  - File Sampah (${DRY_RUN ? 'Bisa Dihapus' : 'Terhapus'}): ${deletedCount}`);

    } catch (error) {
        console.error(`\n[FATAL ERROR] Gagal menjalankan cleanup:`, error.message);
    } finally {
        if (client) {
            client.release(); // Kembalikan koneksi ke pool
            console.log(`\nKoneksi database dilepaskan.`);
        }
        await pool.end(); // Tutup pool
        console.log(`Pool koneksi ditutup. Selesai.`);
    }
}

cleanup();
