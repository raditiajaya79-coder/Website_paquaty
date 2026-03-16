const pool = require('./config/db');
const initializeDatabase = require('./config/initDb');

async function run() {
  try {
    console.log('Running initDb...');
    await initializeDatabase();
    console.log('initDb complete.');
    
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
    console.log('Columns in products:', res.rows.map(r => r.column_name));
    
    const res2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'articles'");
    console.log('Columns in articles:', res2.rows.map(r => r.column_name));

    const res3 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'events'");
    console.log('Columns in events:', res3.rows.map(r => r.column_name));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
