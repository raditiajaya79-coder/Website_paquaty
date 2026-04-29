/**
 * controllers/knowledgeController.js — Endpoint Knowledge Base untuk Chatbot AI
 * 
 * Menyediakan satu endpoint publik yang mengagregasi seluruh data relevan
 * dari database (produk, artikel, event, sertifikat, info perusahaan)
 * ke dalam satu respons JSON terstruktur.
 * 
 * Tujuan: n8n (atau sistem AI lain) cukup memanggil GET /api/knowledge
 * untuk mendapatkan seluruh pengetahuan terbaru yang perlu diketahui chatbot.
 */
const pool = require('../config/db'); // Koneksi database PostgreSQL

/**
 * getKnowledge — Mengambil semua data yang relevan untuk chatbot AI
 * @route   GET /api/knowledge
 * @access  Public (tanpa auth, agar n8n bisa memanggil tanpa token)
 * 
 * Strategi: Menjalankan semua query secara paralel (Promise.all)
 * untuk meminimalkan waktu respons.
 */
exports.getKnowledge = async (req, res) => {
  try {
    // Jalankan semua query database secara paralel untuk efisiensi
    const [
      productsResult,   // Seluruh katalog produk aktif
      articlesResult,   // Artikel/berita terbaru
      eventsResult,     // Event/agenda terbaru
      certificatesResult, // Sertifikasi legalitas aktif
      settingsResult,    // Pengaturan website (info kontak, dll)
      galleriesResult,   // Foto-foto galeri
      contactsResult,    // Daftar kontak (IG, WA, dll) dari tabel khusus
      announcementsResult // Pengumuman/Popup yang sedang aktif
    ] = await Promise.all([
      // Query produk: ambil kolom yang relevan untuk chatbot
      pool.query(`
        SELECT id, name, name_en, grade, grade_en, 
               price, original_price, origin, origin_en,
               category, category_en, description, description_en,
               packaging_options, tag, is_bestseller
        FROM products 
        ORDER BY id ASC
      `),
      // Query artikel: ambil 20 artikel terbaru saja
      pool.query(`
        SELECT id, title, title_en, category, date, author, 
               excerpt, excerpt_en
        FROM articles 
        ORDER BY date DESC 
        LIMIT 20
      `),
      // Query event: ambil 20 event terbaru saja
      pool.query(`
        SELECT id, title, title_en, date, location, 
               status, description, description_en
        FROM events 
        ORDER BY date DESC 
        LIMIT 20
      `),
      // Query sertifikat: hanya yang aktif ditampilkan
      pool.query(`
        SELECT id, title, title_en, issued_by, sub, sub_en,
               description, description_en, year, is_active
        FROM certificates 
        WHERE is_active = true
        ORDER BY year DESC
      `),
      // Query pengaturan website (statis)
      pool.query(`SELECT key, value FROM site_settings`),
      
      // Query galeri: ambil 30 foto terbaru
      pool.query(`
        SELECT id, title, title_en, category, image 
        FROM galleries 
        ORDER BY created_at DESC 
        LIMIT 30
      `),
      
      // Query kontak: list semua sosmed & kontak
      pool.query(`
        SELECT platform, value 
        FROM contacts 
        ORDER BY id ASC
      `),
      
      // Query pengumuman: ambil yang is_active = true
      pool.query(`
        SELECT title, title_en, message, message_en, button_text, link 
        FROM announcements 
        WHERE is_active = true 
        LIMIT 1
      `)
    ]);

    // Normalisasi packaging_options dari string JSON ke array
    const products = productsResult.rows.map(p => ({
      ...p,
      packaging_options: typeof p.packaging_options === 'string'
        ? JSON.parse(p.packaging_options)
        : (p.packaging_options || [])
    }));

    // Konversi settings (site_settings) ke object
    const settings = {};
    settingsResult.rows.forEach(row => {
      settings[row.key] = row.value;
    });

    // Susun respons JSON terstruktur
    const knowledgeBase = {
      generated_at: new Date().toISOString(),
      source: 'Pakuaty Backend API',

      company: {
        name: 'PT. Bala Aditi Pakuaty',
        tagline: 'Crunch the Culture',
        location: 'Jl. Veteran No.15 B, Kota Kediri 64114, Jawa Timur, Indonesia',
        contacts_list: contactsResult.rows, // Daftar lengkap IG, WA, FB, dll
        settings: settings // Jam buka, dll
      },

      products: products,
      certificates: certificatesResult.rows,
      articles: articlesResult.rows,
      events: eventsResult.rows,
      gallery: galleriesResult.rows,
      active_announcement: announcementsResult.rows[0] || null,

      summary: {
        total_products: products.length,
        total_articles: articlesResult.rows.length,
        total_galleries: galleriesResult.rows.length,
        bestsellers: products.filter(p => p.is_bestseller).map(p => p.name)
      }
    };

    // Kirim respons JSON ke n8n / chatbot
    res.json(knowledgeBase);

  } catch (error) {
    // Log error dan kirim respons error yang informatif
    console.error(`[KNOWLEDGE] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data knowledge base.', detail: error.message });
  }
};
