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
import ImageUploader from '../../../../components/admin/ImageUploader'; // Import uploader baru

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
        category: 'Produksi',
        image: ''
    });
    const [loading, setLoading] = useState(false);

    // Fungsi untuk mengambil data galeri (dokumentasi) dari API
    const fetchGalleryData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/gallery/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data dokumentasi'); // Perbaikan pesan error
            const rawData = await response.json(); // Ambil data mentah

            // Sanitasi data: Pastikan data adalah object yang valid sebelum digunakan
            // Ini mencegah error jika API mengembalikan null, undefined, atau tipe data lain yang tidak diharapkan
            const data = rawData && typeof rawData === 'object' ? rawData : {};

            setFormData({
                title: data.title || '',
                category: data.category || 'Event Utama', // Perbaikan default category
                image: data.image || ''
            });
            setLoading(false);
        } catch (err) {
            alert('Error: ' + err.message);
            navigate('/admin/gallery');
        }
    };

    // Simulasi pengambilan data jika mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchGalleryData();
        }
    }, [isEditMode, id]);

    // simplified to text input
    const handleImageChange = (e) => { };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const url = isEditMode
                ? `http://localhost:5000/api/gallery/${id}`
                : 'http://localhost:5000/api/gallery';
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
                alert(isEditMode ? 'Dokumentasi berhasil diperbarui' : 'Dokumentasi berhasil ditambahkan');
                navigate('/admin/gallery');
            } else {
                const errorData = await response.json();
                alert('Gagal menyimpan: ' + (errorData.error || 'Terjadi kesalahan'));
            }
        } catch (err) {
            alert('Error: ' + err.message);
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
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Dokumentasi</label>
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
                                        label="Foto Dokumentasi (Upload)"
                                        currentImage={formData.image}
                                        onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                    />
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
        </div >
    );
};

export default GalleryForm;
