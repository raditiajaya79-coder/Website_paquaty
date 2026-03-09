/**
 * drop_duplicates.js — Script Pembersih
 * Menghapus tabel duplikat (Kapital) secara aman.
 */
const pool = require('./config/db');

async function clean() {
  const duplicates = ['Articles', 'Certificates', 'Contacts', 'Events', 'Galleries', 'Products'];
  
  console.log('--- PROSES PEMBERSIHAN TABEL DUPLIKAT ---\n');
  
  for (const table of duplicates) {
    try {
      // Menggunakan tanda kutip dua (") agar PostgreSQL mengenali Case Sensitive
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`✅ Berhasil menghapus tabel: "${table}"`);
    } catch (e) {
      console.log(`❌ Gagal menghapus "${table}": ${e.message}`);
    }
  }
  
  console.log('\n✨ Pembersihan selesai!');
  await pool.end();
}

clean();
