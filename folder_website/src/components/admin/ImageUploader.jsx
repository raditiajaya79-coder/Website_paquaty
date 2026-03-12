import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ImageUploader Component
 * @param {string} currentImage - URL gambar saat ini (jika ada)
 * @param {function} onUploadSuccess - Callback saat upload berhasil (mengembalikan URL baru)
 * @param {string} label - Label teks (opsional)
 */
const ImageUploader = ({ currentImage, onUploadSuccess, label = "Upload Gambar" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi dasar
        if (!file.type.startsWith('image/')) {
            setError('Hanya file gambar yang diizinkan!');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal mengunggah gambar');
            }

            const data = await response.json();
            // data.url biasanya berisi "/uploads/filename.ext"
            const fullUrl = `http://localhost:5000${data.url}`;
            onUploadSuccess(fullUrl); // Teruskan URL ke parent form
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">{label}</label>}

            <div
                className={`relative group aspect-video bg-slate-50 border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all ${error ? 'border-red-200 bg-red-50/10' : 'border-slate-200 hover:border-blue-300'}`}
            >
                {/* Preview Image */}
                {currentImage && !uploading ? (
                    <img
                        src={currentImage}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-slate-200 mb-2" />
                        )}
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            {uploading ? 'Mengunggah...' : 'Klik Pilih File'}
                        </span>
                    </div>
                )}

                {/* Overlay Hover */}
                {!uploading && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-auto"
                    >
                        <div className="bg-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Input File */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
            />

            {/* Error / Success Feedback */}
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-500 px-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{error}</span>
                </motion.div>
            )}

            {uploading && (
                <div className="flex items-center gap-2 text-blue-500 px-1 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Memproses file...</span>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
