const pool = require('./config/db');

async function dropEnglishColumns() {
  const client = await pool.connect();
  try {
    console.log('🗑️ Dropping English translation columns...');

    await client.query(`
      ALTER TABLE products 
      DROP COLUMN IF EXISTS name_en,
      DROP COLUMN IF EXISTS grade_en,
      DROP COLUMN IF EXISTS category_en,
      DROP COLUMN IF EXISTS description_en;

      ALTER TABLE articles 
      DROP COLUMN IF EXISTS title_en,
      DROP COLUMN IF EXISTS excerpt_en,
      DROP COLUMN IF EXISTS content_en;

      ALTER TABLE events 
      DROP COLUMN IF EXISTS title_en,
      DROP COLUMN IF EXISTS description_en;
    `);

    console.log('✅ Columns dropped successfully!');
  } catch (err) {
    console.error('❌ Failed to drop columns:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

dropEnglishColumns();
