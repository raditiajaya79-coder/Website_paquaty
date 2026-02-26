// SEO Helper — default meta tags dan helper function
// Fungsi ini meniru behavior next/head atau generateMetadata di Next.js

/**
 * Konfigurasi SEO default untuk seluruh website
 * Digunakan sebagai fallback jika halaman tidak menentukan meta tag sendiri
 */
export const DEFAULT_SEO = {
  siteName: 'Pakuaty',                                          // Nama website/brand
  titleTemplate: '%s | Pakuaty',                                // Template title: "Nama Halaman | Pakuaty"
  defaultTitle: 'Pakuaty — Company Profile',                    // Title default jika tidak diset
  description: 'Pakuaty — Profil perusahaan dan katalog produk terlengkap', // Meta description default
};

/**
 * generatePageTitle — membuat title halaman sesuai template
 * @param {string} pageTitle - Judul spesifik halaman (misal: "Tentang Kami")
 * @returns {string} - Title lengkap (misal: "Tentang Kami | Pakuaty")
 * 
 * Kenapa perlu fungsi ini?
 * - Konsistensi format title di semua halaman
 * - SEO: Google menampilkan title di search results, format konsisten = branding kuat
 */
export function generatePageTitle(pageTitle) {
  // Jika tidak ada pageTitle, gunakan default
  if (!pageTitle) return DEFAULT_SEO.defaultTitle;
  // Replace %s di template dengan pageTitle
  return DEFAULT_SEO.titleTemplate.replace('%s', pageTitle);
}
