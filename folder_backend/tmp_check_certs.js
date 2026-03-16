const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

async function checkCerts() {
  try {
    const res = await pool.query('SELECT id, title, is_active, is_pinned FROM certificates ORDER BY id ASC');
    console.log('--- CERTIFICATES ---');
    console.table(res.rows);
    
    const duplicates = res.rows.filter((item, index) => 
      res.rows.findIndex(i => i.id === item.id) !== index
    );
    
    if (duplicates.length > 0) {
      console.log('!!! DUPLICATE IDS FOUND !!!');
      console.table(duplicates);
    } else {
      console.log('No duplicate IDs found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkCerts();
