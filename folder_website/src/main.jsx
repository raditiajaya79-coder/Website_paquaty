// Entry point utama React — inisialisasi app dan provider global
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// BrowserRouter — mengaktifkan client-side routing (URL-based navigation)
import { BrowserRouter } from 'react-router-dom';
// HelmetProvider — mengaktifkan SEO management (title, meta) per halaman
import { HelmetProvider } from 'react-helmet-async';
// Komponen App — berisi semua route definitions
import App from './App.jsx';
// Global CSS — Tailwind CSS + custom styles
import './index.css';

import { LanguageProvider } from './context/LanguageContext.jsx';
// GlobalDataProvider — Menyediakan data API yang sudah di-preload ke seluruh app
import { GlobalDataProvider } from './context/GlobalDataContext.jsx';

import ErrorBoundary from './components/ErrorBoundary.jsx';

// Mount React app ke DOM element #root di index.html
createRoot(document.getElementById('root')).render(
    // StrictMode — mendeteksi masalah potensial saat development
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <LanguageProvider>
                    <BrowserRouter>
                        {/* GlobalDataProvider — Fetch semua data di awal, simpan di context */}
                        <GlobalDataProvider>
                            <App />
                        </GlobalDataProvider>
                    </BrowserRouter>
                </LanguageProvider>
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>
);

