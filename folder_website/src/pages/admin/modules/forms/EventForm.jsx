import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Calendar,
    FileText,
    CheckCircle2,
    X,
    Pin,
    Image as ImageIcon,
    ArrowLeft,
    Tag,
    Type,
    Loader2
} from 'lucide-react'; // Ikon
import Toast from '../../../../components/admin/Toast'; // Komponen Toast
import ImageUploader from '../../../../components/admin/ImageUploader'; // Import uploader baru

/**
 * EventForm Component — Halaman khusus untuk buat/edit Agenda & Artikel.
 * Menggantikan sistem modal untuk memberikan ruang editor yang lebih luas.
 */
const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const locationStr = useLocation();
    const queryParams = new URLSearchParams(locationStr.search);
    const initialType = queryParams.get('type') || 'Article';

    const [formData, setFormData] = useState({
        title: '',
        type: initialType,
        date: new Date().toISOString().split('T')[0],
        category: 'Wawasan',
        content: '', // Konten artikel / Deskripsi event
        is_pinned: false,
        author: 'Admin Pakuaty', // Untuk Artikel
        location: '', // Untuk Event
        status: 'Upcoming', // Untuk Event
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // State untuk notifikasi feedback

    // Simulasi pengambilan data jika mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchContentData();
        }
    }, [isEditMode, id]);

    // Fungsi mengambil data detail (saat mode Edit)
    const fetchContentData = async () => {
        try {
            setLoading(true);
            const endpoint = initialType === 'Article' ? 'articles' : 'events';
            const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data');
            const rawData = await response.json();

            // Sanitasi data: Pastikan data adalah object sebelum di-spread
            const data = rawData && typeof rawData === 'object' ? rawData : {};

            setFormData({
                title: data.title || '',
                type: initialType,
                date: data.date ? (new Date(data.date).toString() !== 'Invalid Date' ? new Date(data.date).toISOString().split('T')[0] : '') : '',
                category: data.category || 'Wawasan',
                content: data.content || data.description || '', // Mapping content/description agar seragam di frontend
                author: data.author || 'Admin Pakuaty',
                location: data.location || '',
                status: data.status || 'Upcoming',
                is_pinned: data.is_pinned || false,
                image: data.image || ''
            });
            setLoading(false);
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
            setTimeout(() => navigate('/admin/events'), 2000);
        }
    };

    // Handle Submit — Mengirim data ke API (POST/PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token'); // Token auth admin
            const endpoint = formData.type === 'Article' ? 'articles' : 'events';
            const url = isEditMode
                ? `http://localhost:5000/api/${endpoint}/${id}` // URL Edit
                : `http://localhost:5000/api/${endpoint}`; // URL Create
            const method = isEditMode ? 'PUT' : 'POST';

            // Siapkan payload sesuai schema backend (Konversi content ke field yang sesuai)
            const payload = { ...formData };
            if (formData.type === 'Event') {
                payload.description = formData.content; // Backend Event menggunakan field 'description'
            } else {
                // Backend Artikel menggunakan 'content' dan 'excerpt'
                payload.excerpt = formData.content.substring(0, 150) + '...'; // Potong otomatis untuk ringkasan
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload) // Kirim payload data
            });

            if (response.ok) {
                // Notifikasi Sukses
                setToast({
                    show: true,
                    message: `${formData.type === 'Article' ? 'Artikel' : 'Event'} berhasil ${isEditMode ? 'diperbarui' : 'diterbitkan'}!`,
                    type: 'success'
                });
                // Kembali ke list setelah jeda
                setTimeout(() => navigate('/admin/events'), 1500);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menyimpan data ke server');
            }
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
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
                        onClick={() => navigate('/admin/events')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {isEditMode ? 'Edit Agenda' : 'Buat Agenda Baru'}
                        </h1>
                        <p className="text-[#64748B] mt-1 font-bold text-xs">Publikasikan informasi terbaru untuk pelanggan setia.</p>
                    </div>
                </div>
                {/* Header Status Indicator */}
                <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest">Modul Agenda & Artikel</span>
                </div>
            </div>

            {/* Main Form Entry — Flat Layout tanpa Card Wrapper */}
            <form onSubmit={handleSubmit} className="space-y-6 pb-8">


                {/* Section 1: Konfigurasi Dasar */}
                <div className="space-y-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Jenis Konten</label>
                            <div className="flex gap-4 p-2.5 bg-white border border-slate-100 rounded-2xl w-fit">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'Article' })}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'Article' ? 'bg-[#2563EB] text-white shadow-lg' : 'text-[#64748B] hover:bg-slate-50'}`}
                                >
                                    <FileText className="w-5 h-5" /> Artikel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'Event' })}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'Event' ? 'bg-[#2563EB] text-white shadow-lg' : 'text-[#64748B] hover:bg-slate-50'}`}
                                >
                                    <Calendar className="w-5 h-5" /> Event
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-72">
                            <div
                                onClick={() => setFormData({ ...formData, is_pinned: !formData.is_pinned })}
                                className={`flex items-center justify-between p-4.5 rounded-2xl border-2 cursor-pointer transition-all ${formData.is_pinned ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 opacity-60'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                                        <Pin className={`w-4 h-4 ${formData.is_pinned ? 'text-[#2563EB] fill-[#2563EB]' : 'text-slate-300'}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Sematkan</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_pinned ? 'bg-[#2563EB]' : 'bg-slate-200'}`}>
                                    <motion.div animate={{ x: formData.is_pinned ? 22 : 2 }} className="absolute top-1.5 w-3 h-3 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2.5">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Utama</label>
                            <input
                                type="text"
                                required
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                placeholder="Masukkan judul agenda..."
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Tanggal Pelaksanaan / Rilis</label>
                            <input
                                type="date"
                                required
                                name="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">{formData.type === 'Article' ? 'Penulis' : 'Lokasi Event'}</label>
                            <input
                                type="text"
                                required
                                name={formData.type === 'Article' ? 'author' : 'location'}
                                value={formData.type === 'Article' ? formData.author : formData.location}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                placeholder={formData.type === 'Article' ? 'Nama Penulis' : 'Masukkan Lokasi'}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Kategori Konten</label>
                            <input
                                type="text"
                                required
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                placeholder="Misal: Berita Internal"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Editor Isi Konten (Flat) */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Isi Konten & Narasi</label>
                    <textarea
                        rows="8"
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm resize-none text-sm leading-relaxed"
                        placeholder="Tulis isi artikel atau detail event di sini..."
                    ></textarea>
                </div>

                {/* Section: Image Upload from Device */}
                <div className="space-y-4">
                    <ImageUploader
                        label="Gambar Cover / Banner (Upload)"
                        currentImage={formData.image}
                        onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                    />
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Rekomendasi: Gunakan gambar landscape dengan resolusi minimal 1280x720px untuk hasil terbaik.
                        </p>
                    </div>
                </div>



                {/* Submit Buttons */}
                <div className="flex flex-col md:flex-row gap-5 pt-6 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/events')}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-xl font-black text-xs text-[#64748B] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <X className="w-5 h-5" /> Batal & Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-8 py-4 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <CheckCircle2 className="w-5 h-5" />
                        )}
                        {isEditMode ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                    </button>
                </div>
            </form>

            {/* Toast Feedback */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div >
    );
};

export default EventForm;
