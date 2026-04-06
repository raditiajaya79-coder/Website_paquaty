const pool = require('./config/db');

async function fix() {
  try {
    await pool.query("UPDATE products SET image = '/logo-product-pure/01.ORIGINAL-HOLO-PNG-GRADING.webp' WHERE id = 1");
    console.log("Updated correctly");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fix();
