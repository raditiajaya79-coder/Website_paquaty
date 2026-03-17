/**
 * controllers/productController.js — Logika CRUD Produk
 */
const pool = require('../config/db');
const { logActivity } = require('../utils/logger'); // Import utility logging

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
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    // Catat aktivitas: Menghapus Produk
    await logActivity(req.admin.id, 'Menghapus Produk', result.rows[0].name);

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error(`[PRODUCT] ❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
};
