const pool = require('./config/db');
async function reset() {
  const client = await pool.connect();
  try {
    await client.query(`
      DROP TABLE IF EXISTS activity_logs CASCADE;
      DROP TABLE IF EXISTS site_settings CASCADE;
      DROP TABLE IF EXISTS announcements CASCADE;
      DROP TABLE IF EXISTS contacts CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS certificates CASCADE;
      DROP TABLE IF EXISTS galleries CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS admins CASCADE;
    `);
    console.log("Databases dropped successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
reset();
