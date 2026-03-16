const pool = require('./config/db');

async function migrateTranslations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Migrating sample English translations...');

    // 1. Update Products
    console.log('📦 Updating products...');
    await client.query(`
      UPDATE products 
      SET 
        name_en = 'Original Tempe Chips',
        grade_en = 'Classic Artisan Grade',
        category_en = 'Traditional Snacks',
        description_en = 'Experience the authentic taste of Indonesian culture with our Original Tempe Chips. Crispy, savory, and perfectly fermented for 48 hours.'
      WHERE name = 'Original';
    `);

    await client.query(`
      UPDATE products 
      SET 
        name_en = 'Spicy Balado Tempe Chips',
        grade_en = 'Premium Spicy Grade',
        category_en = 'Gourmet Snacks',
        description_en = 'A perfect blend of traditional tempe and bold spicy Balado seasoning. The ultimate snack for spice lovers.'
      WHERE name = 'Balado';
    `);

    // 2. Update Articles (Events)
    console.log('📰 Updating articles...');
    await client.query(`
      UPDATE articles 
      SET 
        title_en = 'Traditional Fermentation: The Secret to Crunchy Tempe',
        excerpt_en = 'Discover the 48-hour fermentation secret behind our heritage recipe.',
        content_en = '[{"type":"text","value":"Our fermentation process is a labor of love that spans generations. We start with carefully selected non-GMO soybeans..."},{"type":"text","value":"This patient approach is what differentiates Pakuaty. While industrial methods try to speed up this process, we believe that true flavor and the perfect crunch can only be achieved by respecting natures timeline."}]'
      WHERE title LIKE '%Fermentation%';
    `);

    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateTranslations();
