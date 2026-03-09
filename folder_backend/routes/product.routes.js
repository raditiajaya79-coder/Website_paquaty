/**
 * routes/product.routes.js — Route CRUD Produk
 * Endpoint publik: GET (semua & detail)
 * Endpoint admin: POST, PUT, DELETE (memerlukan JWT)
 */
const express = require('express'); // Framework web
const pool = require('../config/db'); // Koneksi database
const auth = require('../middleware/auth'); // Middleware JWT
const router = express.Router(); // Router Express

/**
 * GET /api/products — Ambil semua produk
 * Endpoint publik (tidak perlu login)
 */
router.get('/', async (req, res) => {
  try {
    // Query semua produk, urutkan berdasarkan ID
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');

    // Mapping: ubah snake_case dari database ke camelCase untuk frontend
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      grade: row.grade,
      origin: row.origin,
      moq: row.moq,
      image: row.image,
      detailImage: row.detail_image,
      tag: row.tag,
      price: row.price,
      originalPrice: row.original_price,
      description: row.description,
      isBestseller: row.is_bestseller,
      isHero: row.is_hero,
      packagingOptions: row.packaging_options,
      packaging: row.packaging_options?.[0]?.label || '', // Ambil label kemasan pertama untuk admin
      discountPrice: row.original_price // Harga coret = harga asli
    }));

    res.json(products); // Kirim array produk
  } catch (error) {
    console.error('Error GET products:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data produk.' });
  }
});

/**
 * GET /api/products/:id — Ambil detail satu produk
 * Endpoint publik
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL parameter

    // Query produk berdasarkan ID
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    // Jika produk tidak ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    const row = result.rows[0]; // Data produk dari database

    // Mapping ke format camelCase
    res.json({
      id: row.id,
      name: row.name,
      grade: row.grade,
      origin: row.origin,
      moq: row.moq,
      image: row.image,
      detailImage: row.detail_image,
      tag: row.tag,
      price: row.price,
      originalPrice: row.original_price,
      description: row.description,
      isBestseller: row.is_bestseller,
      isHero: row.is_hero,
      packagingOptions: row.packaging_options
    });
  } catch (error) {
    console.error('Error GET product detail:', error.message);
    res.status(500).json({ error: 'Gagal mengambil detail produk.' });
  }
});

/**
 * POST /api/products — Tambah produk baru
 * Memerlukan autentikasi admin (JWT)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { 
      name, description, price, originalPrice, 
      image, category, grade, tag, origin, moq, 
      packagingOptions, isBestseller, isHero 
    } = req.body;

    // Insert produk baru ke database
    const result = await pool.query(
      `INSERT INTO products (
        name, description, price, original_price, image, 
        category, grade, tag, origin, moq, 
        packaging_options, is_bestseller, is_hero
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        name, description, price, originalPrice || price, image,
        category || 'Tempe Chips', grade || 'Export Quality', tag || '', 
        origin || 'Malang, Indonesia', moq || '1000 Units',
        JSON.stringify(packagingOptions || []), isBestseller || false, isHero || false
      ]
    );

    res.status(201).json(result.rows[0]); // Kirim produk yang baru dibuat
  } catch (error) {
    console.error('Error POST product:', error.message);
    res.status(500).json({ error: 'Gagal menambahkan produk.' });
  }
});

/**
 * PUT /api/products/:id — Update produk yang ada
 * Memerlukan autentikasi admin (JWT)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params; // ID produk yang akan diupdate
    const { 
      name, description, price, originalPrice, 
      image, category, grade, tag, origin, moq, 
      packagingOptions, isBestseller, isHero 
    } = req.body;

    // Update produk di database
    const result = await pool.query(
      `UPDATE products SET 
        name=$1, description=$2, price=$3, original_price=$4, image=$5, 
        category=$6, grade=$7, tag=$8, origin=$9, moq=$10,
        packaging_options=$11, is_bestseller=$12, is_hero=$13 
       WHERE id=$14 RETURNING *`,
      [
        name, description, price, originalPrice || price, image,
        category, grade, tag, origin, moq,
        JSON.stringify(packagingOptions || []), isBestseller || false, isHero || false, 
        id
      ]
    );

    // Jika produk tidak ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    res.json(result.rows[0]); // Kirim produk yang diupdate
  } catch (error) {
    console.error('Error PUT product:', error.message);
    res.status(500).json({ error: 'Gagal mengupdate produk.' });
  }
});

/**
 * DELETE /api/products/:id — Hapus produk
 * Memerlukan autentikasi admin (JWT)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params; // ID produk yang akan dihapus

    // Hapus produk dari database
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    // Jika produk tidak ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Error DELETE product:', error.message);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
});

module.exports = router; // Ekspor router
