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
import { API_BASE_URL } from '../utils/api';

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
     * fetchAllData — Fungsi utama yang memuat SEMUA data API sekaligus
     * Menggunakan Promise.allSettled agar tidak gagal total jika 1 endpoint error
     * Progress bar diupdate secara bertahap sesuai jumlah endpoint yang selesai
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

        const totalEndpoints = endpoints.length; // Total endpoint untuk kalkulasi progress
        let completedCount = 0; // Counter endpoint yang sudah selesai

        // Buat array Promise untuk setiap endpoint
        const fetchPromises = endpoints.map(async (endpoint) => {
            try {
                const response = await fetch(endpoint.url); // Fetch data dari server
                if (!response.ok) throw new Error(`HTTP ${response.status}`); // Throw jika status bukan 2xx
                const data = await response.json(); // Parse JSON response

                // Update progress setiap kali 1 endpoint selesai
                completedCount++;
                const progress = Math.round((completedCount / totalEndpoints) * 100); // Hitung persentase
                setLoadingProgress(progress); // Update state progress
                setLoadingMessage(`Loading ${endpoint.label}...`); // Update pesan loading

                return { key: endpoint.key, data, success: true }; // Return data hasil fetch
            } catch (error) {
                // Endpoint gagal → tetap lanjut, return null untuk key ini
                completedCount++;
                const progress = Math.round((completedCount / totalEndpoints) * 100);
                setLoadingProgress(progress);
                console.warn(`[GlobalData] ⚠️ Gagal fetch ${endpoint.label}:`, error.message);
                return { key: endpoint.key, data: null, success: false };
            }
        });

        // Tunggu SEMUA fetch selesai (baik berhasil maupun gagal)
        const results = await Promise.all(fetchPromises);

        // Distribusikan hasil ke masing-masing state
        results.forEach(({ key, data, success }) => {
            if (!success || data === null) return; // Skip jika gagal

            // Set data ke state yang sesuai berdasarkan key
            switch (key) {
                case 'settings':      setSettings(data); break;         // Object tunggal
                case 'products':      setProducts(Array.isArray(data) ? data : []); break;
                case 'contacts':      setContacts(Array.isArray(data) ? data : []); break;
                case 'events':        setEvents(Array.isArray(data) ? data : []); break;
                case 'articles':      setArticles(Array.isArray(data) ? data : []); break;
                case 'gallery':       setGallery(Array.isArray(data) ? data : []); break;
                case 'certificates':  setCertificates(Array.isArray(data) ? data : []); break;
                case 'announcements': setAnnouncements(Array.isArray(data) ? data : []); break;
                default: break;
            }
        });

        // Tandai loading selesai setelah delay singkat untuk transisi visual
        setLoadingProgress(100);
        setLoadingMessage('Ready!');

        // Delay 400ms agar animasi progress bar sempat mencapai 100% sebelum preloader hilang
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsLoaded(true); // Flag: data sudah siap → preloader akan hilang
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
