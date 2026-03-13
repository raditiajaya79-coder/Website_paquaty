/**
 * routes/api.js — Router Utama API Pakuaty
 * Menghubungkan endpoint URL dengan fungsi di controller.
 */
const express = require('express');
const router = express.Router();

// Middleware
const auth = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const eventController = require('../controllers/eventController');
const galleryController = require('../controllers/galleryController');
const certificateController = require('../controllers/certificateController');
const announcementController = require('../controllers/announcementController');
const contactController = require('../controllers/contactController');
const dashboardController = require('../controllers/dashboardController'); // Import controller statistik
const upload = require('../middleware/upload'); // Import middleware upload

// --- DASHBOARD ROUTES ---
// Endpoint untuk mengambil ringkasan angka di dashboard (Admin Only)
router.get('/dashboard/stats', auth, dashboardController.getStats);
// Endpoint untuk menghapus semua log aktivitas (Admin Only)
router.delete('/dashboard/logs', auth, dashboardController.deleteAllLogs);
// Endpoint untuk menghapus satu log aktivitas berdasarkan ID (Admin Only)
router.delete('/dashboard/logs/:id', auth, dashboardController.deleteLog);

// --- UPLOAD ROUTES ---
// Endpoint khusus untuk menerima file dari device
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }
    // Balas dengan URL publik file yang bisa diakses dari frontend
    // Format: /uploads/nama-file.ext
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengunggah file: ' + error.message });
  }
});

// --- AUTH ROUTES ---
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getCurrentAdmin);
// Endpoint update kredensial admin (Admin Only)
router.put('/auth/username', auth, authController.updateUsername);
router.put('/auth/password', auth, authController.updatePassword);

// --- PRODUCT ROUTES ---
router.get('/products', productController.getAllProducts); // Publik
router.get('/products/:id', productController.getProductById); // Publik
router.post('/products', auth, productController.createProduct); // Admin Only
router.put('/products/:id', auth, productController.updateProduct); // Admin Only
router.delete('/products/:id', auth, productController.deleteProduct); // Admin Only

// --- ARTICLE ROUTES ---
router.get('/articles', eventController.getAllArticles); // Publik
router.get('/articles/:id', eventController.getArticleById); // Publik (Mendukung Edit)
router.post('/articles', auth, eventController.createArticle); // Admin Only
router.put('/articles/:id', auth, eventController.updateArticle); // Admin Only
router.delete('/articles/:id', auth, eventController.deleteArticle); // Admin Only

// --- EVENT ROUTES ---
router.get('/events', eventController.getAllEvents); // Publik
router.get('/events/:id', eventController.getEventById); // Publik (Mendukung Edit)
router.post('/events', auth, eventController.createEvent); // Admin Only
router.put('/events/:id', auth, eventController.updateEvent); // Admin Only
router.delete('/events/:id', auth, eventController.deleteEvent); // Admin Only

// --- GALLERY ROUTES ---
router.get('/gallery', galleryController.getAllGallery); // Publik
router.get('/gallery/:id', galleryController.getGalleryById); // Publik
router.post('/gallery', auth, galleryController.createGallery); // Admin Only
router.put('/gallery/:id', auth, galleryController.updateGallery); // Admin Only
router.delete('/gallery/:id', auth, galleryController.deleteGallery); // Admin Only

// --- CERTIFICATE ROUTES ---
router.get('/certificates', certificateController.getAllCertificates); // Publik
router.get('/certificates/:id', certificateController.getCertificateById); // Publik (Mendukung Edit)
router.post('/certificates', auth, certificateController.createCertificate); // Admin Only
router.put('/certificates/:id', auth, certificateController.updateCertificate); // Admin Only
router.delete('/certificates/:id', auth, certificateController.deleteCertificate); // Admin Only

// --- CONTACT ROUTES ---
router.get('/contact', contactController.getAllContacts); // Publik
router.get('/contact/:id', contactController.getContactById); // Publik
router.post('/contact', auth, contactController.createContact); // Admin Only
router.put('/contact/:id', auth, contactController.updateContact); // Admin Only
router.delete('/contact/:id', auth, contactController.deleteContact); // Admin Only

// --- ANNOUNCEMENT ROUTES ---
router.get('/announcements', announcementController.getAllAnnouncements); // Publik/Admin
router.get('/announcements/:id', announcementController.getAnnouncementById); // Publik/Admin
router.put('/announcements/:id', auth, announcementController.updateAnnouncement); // Admin Only
router.post('/announcements', auth, announcementController.createAnnouncement); // Admin Only
router.delete('/announcements/:id', auth, announcementController.deleteAnnouncement); // Admin Only

module.exports = router;
