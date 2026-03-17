import React, { useState, useEffect } from 'react'; // React library
import { useNavigate, useParams } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Image as ImageIcon,
    CheckCircle2,
    X,
    Calendar,
    Tag,
    ArrowLeft,
    Type,
    UploadCloud
} from 'lucide-react'; // Ikon
import Toast from '../../../../components/admin/Toast'; // Komponen Toast
import ImageUploader from '../../../../components/admin/ImageUploader';
import { API_BASE_URL } from '../../../../utils/api';
import { translateText } from '../../../../utils/translate';
import { Wand2, Loader2 } from 'lucide-react';

/**
 * GalleryForm Component — Halaman khusus untuk upload/edit foto Galeri.
 * Menggunakan layout lebar (w-full) untuk memaksimalkan ruang preview gambar.
 */
const GalleryForm = () => {
    const navigate = useNavigate(); // Hook untuk navigasi
    const { id } = useParams(); // ID foto jika dalam mode edit
    const isEditMode = Boolean(id); // Menentukan mode tambah atau edit

    const [formData, setFormData] = useState({
        title: '',
        title_en: '',
        category: 'Produksi',
        image: '',
        span: 'md:col-span-4',
        aspect: 'aspect-square',
        is_pinned: false
    });
    const [isTranslating, setIsTranslating] = useState(false);
    const [loading, setLoading] = useState(false); // State untuk loading indicator
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // State untuk notifikasi feedback

    // Fungsi untuk mengambil data galeri (dokumentasi) dari API
    const fetchGalleryData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data dokumentasi'); // Perbaikan pesan error
            const rawData = await response.json(); // Ambil data mentah

            // Sanitasi data: Pastikan data adalah object yang valid sebelum digunakan
            // Ini mencegah error jika API mengembalikan null, undefined, atau tipe data lain yang tidak diharapkan
            const data = rawData && typeof rawData === 'object' ? rawData : {};

            setFormData({
                title: data.title || '',
                title_en: data.title_en || '',
                category: data.category || 'Produksi',
                image: data.image || '',
                span: data.span || 'md:col-span-4',
                aspect: data.aspect || 'aspect-square',
                is_pinned: data.is_pinned || false
            });
            setLoading(false);
        } catch (err) {
            setToast({ show: true, message: 'Terjadi kesalahan: ' + err.message, type: 'error' }); // Tampilkan error via toast
            setTimeout(() => navigate('/admin/gallery'), 2000); // Redirect setelah jeda
        }
    };

    // Simulasi pengambilan data jika mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchGalleryData();
        }
    }, [isEditMode, id]);

    const handleTranslate = async () => {
        if (!formData.title) {
            setToast({ show: true, message: 'Harap isi judul dalam Bahasa Indonesia.', type: 'error' });
            return;
        }
        setIsTranslating(true);
        try {
            const translatedTitle = await translateText(formData.title);
            setFormData(prev => ({ ...prev, title_en: translatedTitle }));
            setToast({ show: true, message: 'Berhasil diterjemahkan!', type: 'success' });
        } catch (err) {
            setToast({ show: true, message: 'Gagal menerjemahkan.', type: 'error' });
        } finally {
            setIsTranslating(false);
        }
    };

    // simplified to text input
    const handleImageChange = (e) => { };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const url = isEditMode
                ? `${API_BASE_URL}/gallery/${id}`
                : `${API_BASE_URL}/gallery`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: isEditMode ? 'Dokumentasi berhasil diperbarui!' : 'Dokumentasi berhasil ditambahkan!',
                    type: 'success'
                }); // Notifikasi sukses yang cantik
                setTimeout(() => navigate('/admin/gallery'), 1500); // Kembali ke list setelah jeda
            } else {
                const errorData = await response.json();
                setToast({ show: true, message: 'Gagal menyimpan: ' + (errorData.error || 'Terjadi kesalahan sistem'), type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Kesalahan jaringan: ' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Form */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/gallery')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {isEditMode ? 'Edit Dokumentasi' : 'Upload Foto Galeri'}
                        </h1>
                        <p className="text-[#64748B] mt-1 font-bold text-xs">Dokumentasikan setiap momen penting kegiatan perusahaan.</p>
                    </div>
                </div>
                {/* Header Status Indicator */}
                <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest">Modul Galeri Publik</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Section 1: Detail & Metadata */}
                    <div className="space-y-6">

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Dokumentasi (ID)</label>
                                    <button
                                        type="button"
                                        onClick={handleTranslate}
                                        disabled={isTranslating}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-brand-gold hover:text-brand-gold/80 transition-colors disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        Magic Translate
                                    </button>
                                </div>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        required
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Misal: Kunjungan UMKM Daerah..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Documentation Title (EN)</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        required
                                        name="title_en"
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full bg-blue-50/20 border border-blue-100 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Example: Local SME Visit..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Kategori</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-8 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm appearance-none cursor-pointer text-sm"
                                        >
                                            <option>Produksi</option>
                                            <option>Kegiatan</option>
                                            <option>Event</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <ImageUploader
                                        label="Foto Dokumentasi"
                                        currentImage={formData.image}
                                        onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Grid Span (Layout)</label>
                                    <select
                                        name="span"
                                        value={formData.span}
                                        onChange={(e) => setFormData({ ...formData, span: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    >
                                        <option value="md:col-span-4">Kecil (1/3)</option>
                                        <option value="md:col-span-6">Sedang (1/2)</option>
                                        <option value="md:col-span-8">Lebar (2/3)</option>
                                        <option value="md:col-span-12">Penuh (1/1)</option>
                                    </select>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Aspect Ratio</label>
                                    <select
                                        name="aspect"
                                        value={formData.aspect}
                                        onChange={(e) => setFormData({ ...formData, aspect: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    >
                                        <option value="aspect-square">Square (1:1)</option>
                                        <option value="aspect-video">Landscape (16:9)</option>
                                        <option value="aspect-[4/5]">Portrait (4:5)</option>
                                        <option value="aspect-[2/1]">Wide (2:1)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_pinned}
                                        onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Pin ke Atas</span>
                                    <span className="text-[10px] font-bold text-[#64748B]">Tampilkan foto ini di baris pertama galeri.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Media Feedback */}
                    <div className="space-y-4">
                        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 className="w-8 h-8 text-blue-500 mb-3" />
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-relaxed">
                                Gambar yang diunggah akan otomatis dioptimasi untuk <br /> performa website terbaik.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col md:flex-row gap-5 pt-6 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/gallery')}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-xl font-black text-xs text-[#64748B] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <X className="w-5 h-5" /> Batalkan & Kembali
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        {isEditMode ? 'Simpan Perubahan' : 'Upload Sekarang'}
                    </button>
                </div>
            </form >

            {/* Toast Feedback — Menggantikan sistem alert browser yang kaku */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div >
    );
};

export default GalleryForm;
