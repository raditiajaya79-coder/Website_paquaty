const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./config/db');

async function repair() {
  const client = await pool.connect();
  try {
    console.log('Running database repair (adding missing _en columns)...');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS grade_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS category_en VARCHAR(100),
      ADD COLUMN IF NOT EXISTS description_en TEXT;

      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(500),
      ADD COLUMN IF NOT EXISTS content_en TEXT,
      ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
      ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(500),
      ADD COLUMN IF NOT EXISTS description_en TEXT,
      ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
    `);
    // 4. Update announcements
    await client.query(`
      ALTER TABLE announcements
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS message_en TEXT,
      ADD COLUMN IF NOT EXISTS button_text_en VARCHAR(100);
    `);
    console.log('✅ Announcements table updated');

    console.log('🚀 Database repair completed successfully!');
  } catch (e) {
    console.error('❌ Repair failed:', e.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

repair();
