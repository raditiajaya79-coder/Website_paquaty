/**
 * api.js — Utilitas API dengan JWT Authentication
 * Menghubungkan frontend ke backend Express.js.
 * Menyimpan dan mengirim JWT token secara otomatis di setiap request.
 */

const API_BASE_URL = "http://localhost:5000/api"; // URL dasar backend Express

// === Manajemen Token JWT ===

/**
 * setToken — Simpan JWT token ke localStorage
 * Dipanggil setelah login berhasil.
 * @param {string} token - JWT token dari backend
 */
export function setToken(token) {
  localStorage.setItem('pakuaty_token', token); // Simpan di key khusus
}

/**
 * getToken — Ambil JWT token dari localStorage
 * @returns {string|null} Token atau null jika belum login
 */
export function getToken() {
  return localStorage.getItem('pakuaty_token'); // Baca dari localStorage
}

/**
 * removeToken — Hapus JWT token (logout)
 */
export function removeToken() {
  localStorage.removeItem('pakuaty_token'); // Hapus token
  localStorage.removeItem('isLoggedIn'); // Hapus flag login juga
}

// === Fungsi Utama API ===

/**
 * apiFetch — Fungsi utama untuk semua komunikasi dengan backend
 * Secara otomatis menambahkan JWT token ke header Authorization.
 * @param {string} endpoint - Path endpoint (misal: '/products')
 * @param {object} options - Opsi fetch (method, body, dll)
 * @returns {Promise<any>} Data JSON dari server
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`; // Gabungkan base URL + endpoint
  console.log(`[API] Fetching: ${url}`);
  const token = getToken(); // Ambil token jika ada

  // Susun headers — selalu kirim Content-Type JSON
  const headers = {
    "Content-Type": "application/json",
    ...options.headers // Merge dengan headers tambahan jika ada
  };

  // Tambahkan Authorization header jika token tersedia
  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`; // Format: "Bearer <token>"
    console.log(`[API] ✅ Token ditemukan (${token.length} chars). Mengirim Authorized Request: ${options.method || 'GET'} ${endpoint}`);
  } else {
    console.warn(`[API] ❌ Token KOSONG atau TIDAK VALID! Mengirim request tanpa Authorization header: ${options.method || 'GET'} ${endpoint}`);
  }

  try {
    // Kirim request ke backend
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined // Serialize body ke JSON
    });

    // Deteksi Token Expired atau Invalid (401 Unauthorized / 403 Forbidden)
    if (response.status === 401 || response.status === 403) {
      console.error(`[API] 🛑 Akses Ditolak (${response.status}): Token tidak valid atau kadaluwarsa.`);
      
      // Jika error terjadi di admin area (menggunakan header Auth)
      if (token) {
        console.warn("[API] Menginisialisasi logout otomatis...");
        removeToken(); // Hapus token dari storage
        // Kirim event kustom agar context/UI bisa merespons (misal redirect ke login)
        window.dispatchEvent(new Event('pakuaty_logout'));
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Sesi berakhir. Silakan login kembali.");
    }

    // Jika server mengembalikan error lain
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Parse error body
      throw new Error(errorData.error || `Server Error (${response.status})`);
    }

    return await response.json(); // Parse dan kembalikan data JSON
  } catch (error) {
    // Log error ke console untuk debugging
    console.warn(`⚠️ API Error [${endpoint}]:`, error.message);
    throw error; // Re-throw agar caller bisa handle
  }
}

// === Ekspor objek API dengan method shortcut ===
export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: "GET" }), // GET — ambil data
  post: (endpoint, body) => apiFetch(endpoint, { method: "POST", body }), // POST — tambah data
  put: (endpoint, body) => apiFetch(endpoint, { method: "PUT", body }), // PUT — update data
  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }), // DELETE — hapus data
  
  /**
   * upload — Khusus untuk pengiriman file (Multipart Form Data)
   * @param {File} file - Objek file dari input
   * @returns {Promise<any>} Response dari server berisi URL gambar
   */
  upload: async (file) => {
    const url = `${API_BASE_URL}/upload`;
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      console.log(`[API] Uploading file to: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData // Browser akan otomatis set Content-Type ke multipart/form-data + boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload Error (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error("⚠️ [API] Upload failed:", error.message);
      throw error;
    }
  }
};
