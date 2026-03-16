const pool = require('./config/db');

async function verifyAPI() {
  const client = await pool.connect();
  try {
    console.log('🔍 Verifying API Data...');

    // 1. Check Products
    const prodRes = await client.query("SELECT name, name_en, description_en FROM products WHERE name IN ('Original', 'Balado')");
    console.log('\n📦 Products bilingual content:');
    prodRes.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.name_en ? '✅ name_en exists' : '❌ name_en missing'}, ${row.description_en ? '✅ desc_en exists' : '❌ desc_en missing'}`);
      if (row.name_en) console.log(`  Value: "${row.name_en}"`);
    });

    // 2. Check Articles
    const artRes = await client.query("SELECT title, title_en, content_en FROM articles WHERE title_en IS NOT NULL");
    console.log('\n📰 Articles with English content:');
    artRes.rows.forEach(row => {
      console.log(`- ${row.title}: ✅ title_en exists (${row.title_en})`);
      try {
        const blocks = JSON.parse(row.content_en);
        console.log(`  ✅ content_en is valid JSON (${blocks.length} blocks)`);
      } catch (e) {
        console.log(`  ❌ content_en is NOT JSON: ${row.content_en ? 'Exists but invalid' : 'Missing'}`);
      }
    });

    console.log('\n✅ Verification script finished.');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyAPI();
