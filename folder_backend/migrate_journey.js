/**
 * migrate_journey.js — Membuat tabel journey_steps di database
 * Jalankan: node migrate_journey.js
 */
const pool = require('./config/db');

const migrate = async () => {
    try {
        // Buat tabel journey_steps jika belum ada
        await pool.query(`
            CREATE TABLE IF NOT EXISTS journey_steps (
                id SERIAL PRIMARY KEY,
                step_number INTEGER NOT NULL DEFAULT 1,
                title VARCHAR(255) NOT NULL,
                title_en VARCHAR(255) DEFAULT '',
                description TEXT DEFAULT '',
                description_en TEXT DEFAULT '',
                icon VARCHAR(50) DEFAULT 'Sprout',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Tabel journey_steps berhasil dibuat / sudah ada.');

        // Cek apakah tabel kosong, jika iya isi dengan data default
        const count = await pool.query('SELECT COUNT(*) FROM journey_steps');
        if (parseInt(count.rows[0].count) === 0) {
            console.log('📝 Tabel kosong, mengisi data default...');
            await pool.query(`
                INSERT INTO journey_steps (step_number, title, title_en, description, description_en, icon) VALUES
                (1, 'Kedelai Premium', 'Premium Soybeans', 'Kedelai non-GMO lokal untuk kualitas terbaik.', 'Locally sourced non-GMO soybeans for the freshest quality.', 'Sprout'),
                (2, 'Fermentasi Alami', 'Natural Fermentation', 'Proses fermentasi tradisional 48 jam.', 'Traditional 48-hour slow fermentation process.', 'Microscope'),
                (3, 'Bumbu Khas', 'Bold Seasoning', 'Diramu dengan campuran rempah warisan.', 'Hand-seasoned with signature heritage spice blends.', 'Package'),
                (4, 'Siap Ekspor', 'Export Ready', 'Dikemas vakum untuk kualitas ekspor internasional.', 'Vacuum-sealed to ensure international export quality.', 'Store')
            `);
            console.log('✅ 4 data default berhasil ditambahkan.');
        } else {
            console.log('ℹ️  Tabel sudah berisi data, skip seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Migrasi gagal:', error.message);
        process.exit(1);
    }
};

migrate();
