/**
 * folder_backend/dedup.js — Pembersih Duplikat Baris
 * Menghapus bari-baris yang memiliki data duplikat berdasarkan kolom kunci.
 */
const pool = require('./config/db');

async function deduplicate() {
  const client = await pool.connect();
  
  const tables = [
    { name: 'products', key: 'name' },
    { name: 'articles', key: 'title' },
    { name: 'galleries', key: 'image' },
    { name: 'certificates', key: 'title' },
    { name: 'events', key: 'title' }
  ];

  console.log('--- PROSES DEDUPLIKASI BARIS ---\n');

  try {
    for (const table of tables) {
      const query = `
        DELETE FROM ${table.name}
        WHERE id IN (
          SELECT id
          FROM (
            SELECT id,
            ROW_NUMBER() OVER (partition BY ${table.key} ORDER BY id) AS rnum
            FROM ${table.name}
          ) t
          WHERE t.rnum > 1
        );
      `;
      const res = await client.query(query);
      console.log(`✅ ${table.name}: Berhasil menghapus ${res.rowCount} baris duplikat.`);
    }
    console.log('\n✨ Deduplikasi selesai!');
  } catch (err) {
    console.error('❌ Gagal deduplikasi:', err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

deduplicate();
