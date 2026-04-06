/**
 * GlobalDataContext.jsx — Central Data Store untuk SPA Preloader
 * 
 * FUNGSI UTAMA:
 * Saat website pertama kali dibuka, context ini fetch SEMUA data API sekaligus
 * menggunakan Promise.allSettled. Hasilnya disimpan di React Context agar
 * semua halaman bisa langsung mengakses data tanpa fetch ulang.
 * 
 * KEUNTUNGAN:
 * - Navigasi antar halaman INSTANT (tidak ada loading/spinner)
 * - Data hanya di-fetch 1x saat awal
 * - Jika 1 endpoint gagal, endpoint lain tetap berhasil (graceful degradation)
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, UPLOAD_BASE_URL } from '../utils/api';

// Inisialisasi context dengan nilai default kosong
const GlobalDataContext = createContext(null);

/**
 * GlobalDataProvider — Wrapper component yang menyediakan data global
 * Wrap di level paling atas (main.jsx) agar semua child bisa akses
 */
export const GlobalDataProvider = ({ children }) => {
    // ═══ STATE: Menyimpan semua data dari API ═══
    const [settings, setSettings] = useState({});         // Pengaturan global (jam operasional, video URL, dll)
    const [products, setProducts] = useState([]);         // Daftar semua produk
    const [contacts, setContacts] = useState([]);         // Daftar semua kontak (header, footer, contact page)
    const [events, setEvents] = useState([]);             // Daftar semua event/agenda
    const [articles, setArticles] = useState([]);         // Daftar semua artikel/berita
    const [gallery, setGallery] = useState([]);           // Daftar semua foto galeri
    const [certificates, setCertificates] = useState([]); // Daftar semua sertifikat
    const [announcements, setAnnouncements] = useState([]); // Daftar semua pengumuman

    // ═══ STATE: Loading Progress ═══
    const [isLoaded, setIsLoaded] = useState(false);      // Flag: apakah SEMUA data sudah dimuat
    const [loadingProgress, setLoadingProgress] = useState(0); // Persentase progress (0-100)
    const [loadingMessage, setLoadingMessage] = useState('Initializing...'); // Pesan loading saat ini

    /**
     * preloadImage — Helper untuk memuat gambar ke cache browser
     */
    const preloadImage = (url) => {
        return new Promise((resolve) => {
            if (!url) return resolve();
            
            // Tambahkan UPLOAD_BASE_URL jika URL bersifat relatif (/uploads/...)
            const fullUrl = (url.startsWith('http')) ? url : `${UPLOAD_BASE_URL}${url}`;
            
            const img = new Image();
            img.src = fullUrl;
            img.onload = () => resolve();
            img.onerror = () => {
                console.warn(`[Preload] ⚠️ Gagal memuat gambar: ${fullUrl}`);
                resolve(); // Tetap resolve agar tidak memblokir antrean
            };
        });
    };

    /**
     * fetchAllData — Fungsi utama yang memuat SEMUA data API sekaligus
     * Ditambah fase pemuatan aset gambar (Pre-loading Assets)
     */
    const fetchAllData = useCallback(async () => {
        // Daftar semua endpoint yang akan di-fetch
        const endpoints = [
            { key: 'settings',      url: `${API_BASE_URL}/settings`,      label: 'Settings' },
            { key: 'products',      url: `${API_BASE_URL}/products`,      label: 'Products' },
            { key: 'contacts',      url: `${API_BASE_URL}/contact`,       label: 'Contacts' },
            { key: 'events',        url: `${API_BASE_URL}/events`,        label: 'Events' },
            { key: 'articles',      url: `${API_BASE_URL}/articles`,      label: 'Articles' },
            { key: 'gallery',       url: `${API_BASE_URL}/gallery`,       label: 'Gallery' },
            { key: 'certificates',  url: `${API_BASE_URL}/certificates`,  label: 'Certificates' },
            { key: 'announcements', url: `${API_BASE_URL}/announcements`, label: 'Announcements' },
        ];

        const totalEndpoints = endpoints.length;
        let completedCount = 0;

        // FASE 1: Ambil Data JSON (API)
        const fetchPromises = endpoints.map(async (endpoint) => {
            try {
                const response = await fetch(endpoint.url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                completedCount++;
                const progress = Math.round((completedCount / (totalEndpoints + 1)) * 100); 
                setLoadingProgress(progress);
                setLoadingMessage('Loading...'); // Pesan sederhana

                return { key: endpoint.key, data, success: true };
            } catch (error) {
                completedCount++;
                const progress = Math.round((completedCount / (totalEndpoints + 1)) * 100);
                setLoadingProgress(progress);
                console.warn(`[GlobalData] ⚠️ Gagal fetch ${endpoint.label}:`, error.message);
                return { key: endpoint.key, data: null, success: false };
            }
        });

        const results = await Promise.all(fetchPromises);

        // Distribusikan hasil ke masing-masing state secara aman (defensive)
        let fetchedProducts = [];
        let fetchedSettings = {};
        let fetchedArticles = [];
        let fetchedGallery = [];

        results.forEach(({ key, data, success }) => {
            if (!success || data === null) return;
            switch (key) {
                case 'settings':      fetchedSettings = data; setSettings(data); break;
                case 'products':      fetchedProducts = Array.isArray(data) ? data : []; setProducts(fetchedProducts); break;
                case 'contacts':      setContacts(Array.isArray(data) ? data : []); break;
                case 'events':        setEvents(Array.isArray(data) ? data : []); break;
                case 'articles':      fetchedArticles = Array.isArray(data) ? data : []; setArticles(fetchedArticles); break;
                case 'gallery':       fetchedGallery = Array.isArray(data) ? data : []; setGallery(fetchedGallery); break;
                case 'certificates':  setCertificates(Array.isArray(data) ? data : []); break;
                case 'announcements': setAnnouncements(Array.isArray(data) ? data : []); break;
            }
        });

        // FASE 2: Pre-loading Aset Gambar Kritikal
        setLoadingMessage('Preparing...');
        
        try {
            // Kumpulkan URL gambar utama dari berbagai kategori secara aman
            const imageUrls = [
                ...(Array.isArray(fetchedProducts) ? fetchedProducts.map(p => p.image) : []),
                ...(fetchedSettings?.hero_banner_image ? [fetchedSettings.hero_banner_image] : []),
                ...(Array.isArray(fetchedArticles) ? fetchedArticles.slice(0, 3).map(a => a.image) : []),
                ...(Array.isArray(fetchedGallery) ? fetchedGallery.slice(0, 6).map(g => g.image) : []),
            ].filter(Boolean); // Filter elemen yang null/undefined

            // Pemuatan gambar hanya jika ada aset
            if (imageUrls.length > 0) {
                // Batasi jumlah yang di-preload agar tidak terlalu berat (maks 20 gambar pertama)
                const criticalImages = imageUrls.slice(0, 20);
                // Muat gambar secara paralel
                await Promise.all(criticalImages.map(url => preloadImage(url)));
            }
        } catch (err) {
            console.warn('[GlobalData] ⚠️ Gagal pre-loading aset:', err.message);
        }

        // Tandai loading selesai
        setLoadingProgress(100);
        setLoadingMessage('Ready!');

        await new Promise(resolve => setTimeout(resolve, 600));
        setIsLoaded(true);
    }, []);

    // ═══ EFFECT: Jalankan fetch saat component pertama kali mount ═══
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // ═══ VALUE: Object yang akan disediakan ke seluruh aplikasi ═══
    const contextValue = {
        // Data API
        settings,         // Pengaturan global
        products,         // Daftar produk
        contacts,         // Daftar kontak
        events,           // Daftar event
        articles,         // Daftar artikel
        gallery,          // Daftar galeri
        certificates,     // Daftar sertifikat
        announcements,    // Daftar pengumuman

        // Status loading
        isLoaded,         // Boolean: apakah data sudah siap
        loadingProgress,  // Number: 0-100
        loadingMessage,   // String: pesan status saat ini
    };

    return (
        // Provider menyediakan contextValue ke semua child components
        <GlobalDataContext.Provider value={contextValue}>
            {children}
        </GlobalDataContext.Provider>
    );
};

/**
 * useGlobalData — Custom hook untuk mengakses data global
 * Digunakan di halaman/komponen manapun yang butuh data API
 * 
 * Contoh penggunaan:
 * const { products, settings, isLoaded } = useGlobalData();
 */
export const useGlobalData = () => {
    const context = useContext(GlobalDataContext);
    // Proteksi: pastikan hook digunakan di dalam GlobalDataProvider
    if (!context) {
        throw new Error('useGlobalData harus digunakan di dalam GlobalDataProvider');
    }
    return context;
};
