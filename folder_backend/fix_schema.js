/**
 * fix_schema.js — Script Perbaikan Skema
 * Menambahkan kolom yang kurang di tabel produk.
 */
const pool = require('./config/db');

async function fix() {
  console.log('--- PERBAIKAN SKEMA DATABASE ---\n');
  
  try {
    // Tambah kolom category ke tabel products jika belum ada
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Tempe Chips'
    `);
    console.log('✅ Kolom "category" berhasil ditambahkan ke tabel "products"');
  } catch (e) {
    console.log('❌ Gagal memperbaiki skema:', e.message);
  }
  
  await pool.end();
}

fix();
