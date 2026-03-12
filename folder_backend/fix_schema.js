/**
 * folder_backend/fix_schema.js — Penguat Skema Database
 * Menambahkan constraint UNIQUE pada kolom kunci agar tidak terjadi duplikasi lagi.
 */
const pool = require('./config/db');

async function fixSchema() {
  const client = await pool.connect();
  
  const constraints = [
    { table: 'products', column: 'name', name: 'unique_product_name' },
    { table: 'articles', column: 'title', name: 'unique_article_title' },
    { table: 'galleries', column: 'image', name: 'unique_gallery_image' },
    { table: 'certificates', column: 'title', name: 'unique_cert_title' },
    { table: 'events', column: 'title', name: 'unique_event_title' },
    { table: 'announcements', column: 'id', name: 'unique_announcement_id' } // announcements usually only has id 1
  ];

  console.log('--- PROSES PENGUATAN SKEMA (UNIQUE CONSTRAINTS) ---\n');

  try {
    for (const c of constraints) {
      try {
        await client.query(`ALTER TABLE ${c.table} ADD CONSTRAINT ${c.name} UNIQUE (${c.column})`);
        console.log(`✅ ${c.table}: Berhasil menambahkan constraint UNIQUE pada kolom "${c.column}".`);
      } catch (e) {
        if (e.code === '42710') { // duplicate_object
          console.log(`ℹ️  ${c.table}: Constraint "${c.name}" sudah ada.`);
        } else {
          console.log(`❌ ${c.table}: Gagal - ${e.message}`);
        }
      }
    }
    console.log('\n✨ Skema berhasil diperkuat!');
  } catch (err) {
    console.error('❌ Terjadi kesalahan:', err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

fixSchema();
