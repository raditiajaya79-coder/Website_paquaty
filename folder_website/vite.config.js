// Konfigurasi Vite — build tool utama untuk development dan production build
import { defineConfig } from 'vite';
// Plugin React — mengaktifkan JSX transform dan Fast Refresh
import react from '@vitejs/plugin-react';
// Plugin Tailwind CSS v4 — integrasi langsung ke Vite tanpa PostCSS manual
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Daftarkan plugin yang digunakan
  plugins: [
    react(),        // React JSX + Fast Refresh (hot reload tanpa kehilangan state)
    tailwindcss(),  // Tailwind CSS v4 native Vite integration
  ],
  // Konfigurasi server development
  server: {
    port: 5173,     // Port default Vite
    open: true,     // Auto-buka browser saat `npm run dev`
  },
});
