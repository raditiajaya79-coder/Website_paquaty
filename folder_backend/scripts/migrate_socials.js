/**
 * scripts/migrate_socials.js — Script Migrasi Data Kontak
 * Memindahkan data hardcoded dari products.js ke Database PostgreSQL.
 */
const pool = require('../config/db');

const socials = [
  {
    platform: 'Instagram',
    value: 'https://www.instagram.com/pakuaty_tempechips/',
    icon: 'Instagram',
    color: 'text-pink-500',
    show_in_header: true,
    show_in_footer: true
  },
  {
    platform: 'Facebook',
    value: 'https://www.facebook.com/share/1L5CQdgKFZ/',
    icon: 'Facebook',
    color: 'text-blue-600',
    show_in_header: false,
    show_in_footer: true
  },
  {
    platform: 'WhatsApp Sales',
    value: '6281287990370',
    icon: 'MessageCircle',
    color: 'text-emerald-500',
    show_in_header: true,
    show_in_footer: true
  },
  {
    platform: 'Email',
    value: 'bala.aditi.pakuaty@gmail.com',
    icon: 'Mail',
    color: 'text-slate-600',
    show_in_header: false,
    show_in_footer: true
  },
  {
    platform: 'Phone Inquiry',
    value: '+62 812-8799-0370',
    icon: 'Phone',
    color: 'text-blue-500',
    show_in_header: false,
    show_in_footer: true
  }
];

async function migrate() {
  console.log('🚀 Memulai migrasi data kontak...');
  
  try {
    for (const item of socials) {
      // Cek apakah platform sudah ada
      const check = await pool.query('SELECT id FROM contacts WHERE platform = $1', [item.platform]);
      
      if (check.rows.length === 0) {
        await pool.query(
          `INSERT INTO contacts (platform, value, icon, color, show_in_header, show_in_footer)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [item.platform, item.value, item.icon, item.color, item.show_in_header, item.show_in_footer]
        );
        console.log(`✅ Berhasil menambahkan: ${item.platform}`);
      } else {
        console.log(`ℹ️ Skip: ${item.platform} sudah ada di database.`);
      }
    }
    console.log('✨ Migrasi selesai!');
  } catch (error) {
    console.error('❌ Error migrasi:', error.message);
  } finally {
    process.exit();
  }
}

migrate();
