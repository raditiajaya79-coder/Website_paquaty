/**
 * controllers/productController.js — Logika CRUD Produk
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging
const { deleteFile } = require('../utils/fileHelper'); // Import utility penghapus file

// @desc    Ambil semua produk
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    
    // Normalisasi data produk:
    // Memastikan packaging_options selalu berupa array/object valid (tidak null).
    // Memastikan flags boolean (bestseller/hero) tidak null.
    const sanitizedRows = result.rows.map(row => ({
      ...row,
      is_bestseller: row.is_bestseller || false,
      is_hero: row.is_hero || false,
      packaging_options: typeof row.packaging_options === 'string' 
        ? JSON.parse(row.packaging_options) 
        : (row.packaging_options || [])
    }));

    res.json(sanitizedRows);
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil data produk.' });
  }
};

// @desc    Ambil satu produk berdasarkan ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal mengambil detail produk.' });
  }
};

// @desc    Tambah produk baru
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  const { 
    name, name_en, grade, grade_en, origin, origin_en, moq, image, category, category_en,
    detail_image, tag, price, original_price, 
    description, description_en, is_bestseller, is_hero, packaging_options 
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products (
        name, name_en, grade, grade_en, origin, origin_en, moq, image, category, category_en,
        detail_image, tag, price, original_price, 
        description, description_en, is_bestseller, is_hero, packaging_options
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
      RETURNING *`,
      [
        name, name_en, grade, grade_en, origin, origin_en, moq, image, category, category_en,
        detail_image, tag, price, original_price, 
        description, description_en, is_bestseller, is_hero, 
        typeof packaging_options === 'string' ? packaging_options : JSON.stringify(packaging_options)
      ]
    );

    // Catat aktivitas: Menambah Produk
    await logActivity(req.admin.id, 'Menambahkan Produk Baru', name);

    res.status(201).json({ message: 'Produk berhasil ditambahkan.', product: result.rows[0] });
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menambah produk.' });
  }
};

// @desc    Update produk
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { 
    name, name_en, grade, grade_en, origin, origin_en, moq, image, category, category_en,
    detail_image, tag, price, original_price, 
    description, description_en, is_bestseller, is_hero, packaging_options 
  } = req.body;

  try {
    // --- LOGIKA CLEANUP FILE (UPDATE) ---
    // Sebelum melakukan update, kita ambil data produk lama dari database.
    // Tujuannya adalah untuk membandingkan apakah gambar berubah.
    const oldProductResult = await pool.query('SELECT image, detail_image FROM products WHERE id = $1', [id]);
    const oldProduct = oldProductResult.rows[0]; // Simpan data lama

    // Update data produk ke database PostgreSQL
    const result = await pool.query(
      `UPDATE products SET 
        name = $1, name_en = $2, grade = $3, grade_en = $4, origin = $5, origin_en = $6, moq = $7, image = $8, 
        category = $9, category_en = $10, detail_image = $11, tag = $12, price = $13, 
        original_price = $14, description = $15, description_en = $16, 
        is_bestseller = $17, is_hero = $18, packaging_options = $19
       WHERE id = $20 RETURNING *`,
      [
        name, name_en, grade, grade_en, origin, origin_en, moq, image, category, category_en,
        detail_image, tag, price, original_price, 
        description, description_en, is_bestseller, is_hero, 
        typeof packaging_options === 'string' ? packaging_options : JSON.stringify(packaging_options),
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    // Jika update database berhasil, kita bersihkan file lama jika gambarnya berubah:
    // Hapus gambar utama jika diganti
    if (oldProduct && oldProduct.image && oldProduct.image !== image) {
      await deleteFile(oldProduct.image); // Panggil helper penghapus
    }
    // Hapus detail gambar jika diganti
    if (oldProduct && oldProduct.detail_image && oldProduct.detail_image !== detail_image) {
      await deleteFile(oldProduct.detail_image); // Panggil helper penghapus
    }

    // Catat aktivitas: Mengubah Produk
    await logActivity(req.admin.id, 'Mengubah Data Produk', name);

    res.json({ message: 'Produk berhasil diperbarui.', product: result.rows[0] });
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
};

// @desc    Hapus produk
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Jalankan penghapusan data dari database dan ambil data yang dihapus (RETURNING *)
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    // --- LOGIKA CLEANUP FILE (DELETE) ---
    // Karena baris database sudah terhapus, kita hapus juga file fisiknya
    const deletedProduct = result.rows[0];
    if (deletedProduct.image) await deleteFile(deletedProduct.image); // Hapus gambar utama
    if (deletedProduct.detail_image) await deleteFile(deletedProduct.detail_image); // Hapus detail gambar

    // Catat aktivitas: Menghapus Produk
    await logActivity(req.admin.id, 'Menghapus Produk', deletedProduct.name);

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
};
