/**
 * check_tables.js — Script Diagnostik
 * Menghitung jumlah baris di tabel lowercase vs Kapital.
 */
const pool = require('./config/db');

async function check() {
  const tables = ['articles', 'certificates', 'contacts', 'events', 'galleries', 'products'];
  
  console.log('--- DIAGNOSTIK TABEL DUPLIKAT ---\n');
  
  for (const table of tables) {
    try {
      const lowerRes = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const upperRes = await pool.query(`SELECT COUNT(*) FROM "${table.charAt(0).toUpperCase() + table.slice(1)}"`);
      
      console.log(`Tabel: ${table}`);
      console.log(`  - Lowercase (${table}): ${lowerRes.rows[0].count} data`);
      console.log(`  - Kapital ("${table.charAt(0).toUpperCase() + table.slice(1)}"): ${upperRes.rows[0].count} data`);
      console.log('');
    } catch (e) {
      console.log(`Tabel ${table}: Error - ${e.message}`);
    }
  }
  
  await pool.end();
}

check();
