import React, { useState, useRef } from 'react'; // React hooks untuk state dan referensi DOM
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react'; // Ikon UI
import { motion } from 'framer-motion'; // Animasi
import { getImageUrl } from '../../utils/api'; // Helper untuk resolusi URL gambar

/**
 * ImageUploader Component (Manual Mode)
 * Komponen ini TIDAK melakukan upload otomatis.
 * Ia hanya menampilkan preview lokal dan meneruskan objek File ke parent.
 * Upload sebenarnya dilakukan oleh form induk saat tombol "Simpan" diklik.
 *
 * @param {string} currentImage - URL gambar saat ini dari database (mode edit)
 * @param {function} onFileSelect - Callback yang dipanggil saat file dipilih (menerima objek File)
 * @param {string} label - Label untuk input (default: "Upload Gambar")
 * @param {string} previewClassName - Custom Tailwind classes untuk box preview
 */
const ImageUploader = ({ currentImage, onFileSelect, label = "Upload Gambar", previewClassName = "min-h-[200px] max-h-[320px] aspect-video w-full" }) => {
    // State untuk menyimpan URL preview lokal (blob URL, bukan URL server)
    const [localPreview, setLocalPreview] = useState(null);
    // State untuk menampilkan pesan error validasi
    const [error, setError] = useState(null);
    // Referensi ke elemen <input type="file"> yang tersembunyi
    const fileInputRef = useRef(null);

    /**
     * handleFileChange — Dipanggil saat user memilih file dari dialog.
     * Membuat preview lokal dan meneruskan file ke parent form.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Ambil file pertama dari input
        if (!file) return; // Abaikan jika tidak ada file

        // Validasi: hanya izinkan file gambar
        if (!file.type.startsWith('image/')) {
            setError('Hanya file gambar yang diizinkan!');
            return;
        }

        setError(null); // Reset error jika valid

        // Buat URL sementara dari file lokal untuk ditampilkan sebagai preview
        // URL ini hanya berlaku di browser ini dan tidak dikirim ke server
        const previewUrl = URL.createObjectURL(file);
        setLocalPreview(previewUrl); // Simpan untuk ditampilkan di <img>

        // Teruskan objek File mentah ke form induk (GalleryForm, ProductForm, dll.)
        // Form induk yang akan melakukan upload saat tombol Simpan diklik
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    // Tentukan gambar mana yang ditampilkan:
    // 1. Jika ada preview lokal (user baru memilih file), tampilkan itu
    // 2. Jika ada currentImage dari database (mode edit), tampilkan itu
    // 3. Jika keduanya kosong, tampilkan placeholder
    const displayImage = localPreview || (currentImage ? getImageUrl(currentImage) : null);

    return (
        <div className="space-y-4">
            {/* Label field */}
            {label && <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">{label}</label>}

            {/* Area klik untuk memilih file */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group bg-slate-50 border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all cursor-pointer pointer-events-auto ${error ? 'border-red-200 bg-red-50/10' : 'border-slate-200 hover:border-blue-300'} ${previewClassName}`}
            >
                {/* Preview Image — Tampilkan gambar jika tersedia */}
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback ke logo jika gambar gagal dimuat
                            if (e.target.src !== '/images/pure logo pakuaty.png') {
                                e.target.src = '/images/pure logo pakuaty.png';
                                e.target.className += ' opacity-20 grayscale';
                            }
                        }}
                    />
                ) : (
                    /* Placeholder — Ditampilkan jika belum ada gambar */
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-200 mb-2" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            Klik Pilih File
                        </span>
                    </div>
                )}

                {/* Overlay Hover — Efek visual saat mouse mengarah ke area upload */}
                <div
                    className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                >
                    <div className="bg-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                    </div>
                </div>
            </div>

            {/* Hidden Input File — Input asli yang disembunyikan, dipicu melalui ref */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Error Feedback — Ditampilkan jika validasi gagal */}
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-500 px-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{error}</span>
                </motion.div>
            )}

            {/* Info — Memberitahu user bahwa file belum diupload */}
            {localPreview && (
                <div className="flex items-center gap-2 text-emerald-600 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest">✓ File siap — akan diupload saat Simpan</span>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
