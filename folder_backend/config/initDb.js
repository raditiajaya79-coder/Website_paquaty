/**
 * config/initDb.js — Inisialisasi skema database
 * Membuat semua tabel yang diperlukan jika belum ada.
 * Dijalankan saat server pertama kali start.
 */
const pool = require('./db'); // Koneksi database

/**
 * initializeDatabase — Membuat semua tabel secara berurutan
 * Menggunakan CREATE TABLE IF NOT EXISTS agar aman dijalankan berulang kali.
 */
async function initializeDatabase() {
  const client = await pool.connect(); // Ambil koneksi dari pool

  try {
    // === Tabel Admin — Menyimpan akun admin untuk dashboard ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,              -- ID unik auto-increment
        username VARCHAR(100) UNIQUE NOT NULL, -- Username login (unik)
        email VARCHAR(255) UNIQUE NOT NULL,  -- Email admin (unik)
        password_hash TEXT NOT NULL,         -- Hash password (bcrypt)
        full_name VARCHAR(255),             -- Nama lengkap admin
        role VARCHAR(50) DEFAULT 'admin',   -- Role (admin/super_admin)
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu pembuatan akun
      )
    `);

    // === Tabel Products — Katalog produk keripik tempe ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,              -- ID produk unik
        name VARCHAR(255) NOT NULL,         -- Nama produk (misal: "Original")
        grade VARCHAR(255),                 -- Grade/subtitle (misal: "Classic Tempe Chip")
        origin VARCHAR(255),                -- Asal produk (misal: "Kediri, East Java")
        moq VARCHAR(100),                   -- Minimum Order Quantity
        image TEXT,                         -- URL gambar utama (logo produk)
        category VARCHAR(100) DEFAULT 'Tempe Chips', -- Kategori produk
        detail_image TEXT,                  -- URL gambar detail (foto asli produk)
        tag VARCHAR(100),                   -- Label badge ("Best Seller", "Spicy", dll)
        price INTEGER DEFAULT 0,           -- Harga jual (dalam Rupiah)
        original_price INTEGER DEFAULT 0,  -- Harga asli sebelum diskon
        description TEXT,                   -- Deskripsi panjang produk
        is_bestseller BOOLEAN DEFAULT false, -- Penanda produk terlaris
        is_hero BOOLEAN DEFAULT false,      -- Penanda produk utama di beranda
        packaging_options JSONB DEFAULT '[]'::jsonb, -- Opsi kemasan dalam format JSON
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu dibuat
      )
    `);

    // === Tabel Articles — Artikel/berita/stories ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,              -- ID artikel unik
        title VARCHAR(500) NOT NULL,        -- Judul artikel
        excerpt TEXT,                       -- Ringkasan singkat
        content TEXT,                       -- Isi lengkap artikel
        date VARCHAR(100),                  -- Tanggal publikasi (format teks)
        author VARCHAR(255),                -- Penulis artikel
        category VARCHAR(100),              -- Kategori (Process, Export, dll)
        image TEXT,                         -- URL gambar sampul
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu dibuat
      )
    `);

    // === Tabel Galleries — Koleksi foto galeri ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS galleries (
        id SERIAL PRIMARY KEY,              -- ID galeri unik
        title VARCHAR(255) NOT NULL,        -- Judul/keterangan foto
        category VARCHAR(100),              -- Kategori foto (Process, Flavor, dll)
        image TEXT,                         -- URL gambar
        span VARCHAR(50),                   -- CSS span class (md:col-span-8, dll)
        aspect VARCHAR(50),                 -- CSS aspect class (aspect-square, dll)
        is_pinned BOOLEAN DEFAULT false,    -- Penanda foto yang di-pin ke atas
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu dibuat
      )
    `);

    // === Tabel Certificates — Sertifikasi & legalitas ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,              -- ID sertifikat unik
        title VARCHAR(255) NOT NULL,        -- Nama sertifikat (HACCP, Halal, dll)
        sub VARCHAR(255),                   -- Sub-judul (Food Safety, dll)
        description TEXT,                   -- Penjelasan sertifikat
        image TEXT,                         -- URL gambar sertifikat
        issued_by VARCHAR(255),             -- Lembaga penerbit
        year VARCHAR(20),                   -- Tahun terbit sertifikat
        is_pinned BOOLEAN DEFAULT false,    -- Penanda prioritas tampil
        is_active BOOLEAN DEFAULT true,     -- Toggle on/off dari dashboard (true = tampil di frontend)
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu dibuat
      )
    `);

    // Tambah kolom baru jika tabel sudah ada sebelumnya agar tidak error
    await client.query(`
      ALTER TABLE certificates 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS year VARCHAR(20)
    `);

    // === Tabel Events — Agenda & kegiatan ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,              -- ID event unik
        title VARCHAR(500) NOT NULL,        -- Nama kegiatan
        description TEXT,                   -- Deskripsi kegiatan
        date VARCHAR(100),                  -- Tanggal kegiatan
        location VARCHAR(500),              -- Lokasi kegiatan
        image TEXT,                         -- URL poster/gambar
        status VARCHAR(50) DEFAULT 'upcoming', -- Status (upcoming/completed)
        created_at TIMESTAMP DEFAULT NOW()  -- Waktu dibuat
      )
    `);

    // === Tabel Contacts — Kontak & media sosial ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,               -- ID kontak unik
        platform VARCHAR(100) NOT NULL,      -- Nama platform (Instagram, WhatsApp, dll)
        value TEXT NOT NULL,                 -- Username/link/nomor telepon
        icon VARCHAR(100),                   -- Nama icon Lucide (misal: "Phone")
        color VARCHAR(100),                  -- Class warna (misal: "text-emerald-500")
        show_in_header BOOLEAN DEFAULT true, -- Tampilkan di bagian header website
        show_in_footer BOOLEAN DEFAULT true, -- Tampilkan di bagian footer website
        created_at TIMESTAMP DEFAULT NOW()   -- Waktu dibuat
      )
    `);

    // Pastikan kolom baru ada jika tabel sudah ada sebelumnya
    await client.query(`
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS icon VARCHAR(100),
      ADD COLUMN IF NOT EXISTS color VARCHAR(100),
      ADD COLUMN IF NOT EXISTS show_in_header BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_in_footer BOOLEAN DEFAULT true
    `);

    // === Tabel Announcements — Popup pengumuman opsional ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,               -- ID unik
        title VARCHAR(255),                  -- Judul pengumuman
        message TEXT,                        -- Isi pesan pengumuman
        image TEXT,                          -- URL gambar (opsional)
        button_text VARCHAR(100),            -- Teks tombol (misal: "Lihat Detail")
        link TEXT,                           -- Link tujuan saat tombol diklik
        is_active BOOLEAN DEFAULT false,      -- Toggle aktif/nonaktif
        updated_at TIMESTAMP DEFAULT NOW()   -- Waktu pembaruan terakhir
      )
    `);

    // Pastikan ada setidaknya satu record untuk menampung pengaturan tunggal
    await client.query(`
      INSERT INTO announcements (id, title, message, is_active)
      VALUES (1, 'Selamat Datang!', 'Terima kasih telah mengunjungi Pakuaty.', false)
      ON CONFLICT (id) DO NOTHING
    `);
    // Memastikan kolom is_pinned ada pada tabel certificates (untuk kompatibilitas)
    await client.query(`
      ALTER TABLE certificates ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
    `);
    
    // === Tabel Activity Logs — Rekam jejak aktivitas admin ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,               -- ID log unik
        admin_id INTEGER REFERENCES admins(id), -- Admin yang melakukan aksi
        action VARCHAR(255) NOT NULL,        -- Deskripsi aksi (misal: "Menambah Produk")
        target_name VARCHAR(255),            -- Nama target yang dipengaruhi (misal: "Original Chips")
        created_at TIMESTAMP DEFAULT NOW()   -- Waktu kejadian
      )
    `);

    console.log('✅ Semua tabel berhasil diinisialisasi');
  } catch (error) {
    console.error('❌ Gagal inisialisasi database:', error.message);
    throw error; // Re-throw agar caller tahu ada error
  } finally {
    client.release(); // Kembalikan koneksi ke pool (wajib!)
  }
}

module.exports = initializeDatabase; // Ekspor fungsi
