/**
 * controllers/eventController.js — Logika CRUD Agenda & Artikel
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging

// --- ARTICLES ---

exports.getAllArticles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles ORDER BY is_pinned DESC, id DESC');
    
    // Normalisasi data untuk artikel:
    // Memastikan nilai default untuk field yang mungkin null dari database.
    // is_pinned: Jika null atau undefined, akan diubah menjadi false.
    // date: Jika null atau undefined, akan diubah menjadi string kosong.
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      is_pinned: row.is_pinned || false,
      date: row.date || ''
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[ARTICLE] ❌ Error getAllArticles: ${error.message}`); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal mengambil data artikel.' });
  }
};

// @desc    Ambil satu artikel berdasarkan ID (digunakan saat Edit)
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params; // Mengekstrak ID artikel dari parameter link
    // Mencari artikel spesifik di database PostgreSQL berdasarkan ID
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    
    // Validasi keberadaan data
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' }); // Menandakan data tidak ada
    }
    res.json(result.rows[0]); // Mengirim data mentah artikel ke frontend
  } catch (error) {
    console.error(`[ARTICLE] ❌ Error fetch by ID: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal mengambil data artikel.' }); // Tanggapan kegagalan sistem
  }
};

exports.createArticle = async (req, res) => {
  // Menerima data artikel dari body request, termasuk status 'is_pinned'.
  const { title, title_en, excerpt, excerpt_en, content, content_en, date, author, category, image, is_pinned } = req.body;
  try {
    // Menambahkan artikel baru ke database.
    // `is_pinned || false` memastikan nilai default `false` jika `is_pinned` tidak disediakan.
    const result = await pool.query(
      `INSERT INTO articles (title, title_en, excerpt, excerpt_en, content, content_en, date, author, category, image, is_pinned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, title_en, excerpt, excerpt_en, content, content_en, date, author, category, image, is_pinned || false]
    );
    
    // Catat aktivitas: Menambah Artikel
    await logActivity(req.admin.id, 'Menambahkan Artikel Baru', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[ARTICLE] ❌ Error creating article: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal menambah artikel.' });
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  // Menerima data artikel yang diperbarui dari body request, termasuk status 'is_pinned'.
  const { title, title_en, excerpt, excerpt_en, content, content_en, date, author, category, image, is_pinned } = req.body;
  try {
    // Memperbarui artikel yang ada di database berdasarkan ID.
    // Menambahkan `is_pinned` ke daftar kolom yang dapat diperbarui.
    const result = await pool.query(
      `UPDATE articles SET title=$1, title_en=$2, excerpt=$3, excerpt_en=$4, content=$5, content_en=$6, date=$7, author=$8, category=$9, image=$10, is_pinned=$11
       WHERE id=$12 RETURNING *`,
      [title, title_en, excerpt, excerpt_en, content, content_en, date, author, category, image, is_pinned, id]
    );
    
    // Catat aktivitas: Mengubah Artikel
    await logActivity(req.admin.id, 'Mengubah Data Artikel', title);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[ARTICLE] ❌ Error updating article: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal memperbarui artikel.' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    // Menghapus artikel dari database berdasarkan ID.
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [req.params.id]);
    
    // Jika tidak ada artikel yang dihapus, berarti ID tidak ditemukan.
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    // Catat aktivitas: Menghapus Artikel
    await logActivity(req.admin.id, 'Menghapus Artikel', result.rows[0].title);

    res.json({ message: 'Artikel dihapus.' });
  } catch (error) {
    console.error(`[ARTICLE] ❌ Error deleting article: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal menghapus artikel.' });
  }
};

// --- EVENTS ---

exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY is_pinned DESC, date DESC');
    
    // Normalisasi data untuk event (handling null is_pinned dan status)
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      is_pinned: row.is_pinned || false,
      status: row.status || 'Upcoming',
      date: row.date || ''
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[EVENT] ❌ Error getAllEvents: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data event.' });
  }
};

// @desc    Ambil satu event berdasarkan ID (untuk mode Edit/Review)
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil ID event dari endpoint URL
    // Menjalankan perintah SQL untuk mengambil data baris tunggal
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    
    // Jika baris hasil query kosong
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan.' }); // Mengembalikan status 404
    }
    res.json(result.rows[0]); // Mengirimkan baris data pertama dalam format JSON
  } catch (error) {
    console.error(`[EVENT] ❌ Error fetch by ID: ${error.message}`); // Pencatatan insiden error
    res.status(500).json({ error: 'Gagal mengambil data event.' }); // Pemberitahuan error ke user
  }
};

exports.createEvent = async (req, res) => {
  // Menerima data event dari body request, termasuk status 'is_pinned'.
  const { title, title_en, description, description_en, date, location, image, status, is_pinned } = req.body;
  try {
    // Menambahkan event baru ke database.
    // `is_pinned || false` memastikan nilai default `false` jika `is_pinned` tidak disediakan.
    const result = await pool.query(
      `INSERT INTO events (title, title_en, description, description_en, date, location, image, status, is_pinned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, title_en, description, description_en, date, location, image, status, is_pinned || false]
    );
    
    // Catat aktivitas: Menambah Event
    await logActivity(req.admin.id, 'Menambahkan Event Baru', title);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[EVENT] ❌ Error creating event: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal menambah event.' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  // Menerima data event yang diperbarui dari body request, termasuk status 'is_pinned'.
  const { title, title_en, description, description_en, date, location, image, status, is_pinned } = req.body;
  try {
    // Memperbarui event yang ada di database berdasarkan ID.
    // Menambahkan `is_pinned` ke daftar kolom yang dapat diperbarui.
    const result = await pool.query(
      `UPDATE events SET title=$1, title_en=$2, description=$3, description_en=$4, date=$5, location=$6, image=$7, status=$8, is_pinned=$9
       WHERE id=$10 RETURNING *`,
      [title, title_en, description, description_en, date, location, image, status, is_pinned, id]
    );
    
    // Catat aktivitas: Mengubah Event
    await logActivity(req.admin.id, 'Mengubah Data Event', title);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[EVENT] ❌ Error updating event: ${error.message}`); // Debugging backend
    res.status(500).json({ error: 'Gagal memperbarui event.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan.' });
    }

    // Catat aktivitas: Menghapus Event
    await logActivity(req.admin.id, 'Menghapus Event', result.rows[0].title);

    res.json({ message: 'Event dihapus.' });
  } catch (error) {
    console.error(`[EVENT] ❌ Error delete: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus event.' });
  }
};
