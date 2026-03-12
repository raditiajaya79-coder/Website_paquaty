import React, { useState, useEffect } from 'react'; // React library
import { useNavigate, useParams } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Megaphone,
    CheckCircle2,
    X,
    AlertCircle,
    Eye,
    EyeOff,
    Clock,
    ArrowLeft,
    Type,
    AlignLeft,
    Image as ImageIcon
} from 'lucide-react'; // Ikon

/**
 * AnnouncementForm Component — Halaman khusus untuk buat/edit Pengumuman pop-up.
 * Menggunakan layout lebar (w-full) sesuai permintaan user untuk pengalaman "persegi panjang menyamping".
 */
const AnnouncementForm = () => {
    const navigate = useNavigate(); // Hook untuk navigasi
    const { id } = useParams(); // ID jika dalam mode edit
    const isEditMode = Boolean(id); // Menentukan mode tambah atau edit

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        image: '',
        button_text: '',
        link: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    // Simulasi pengambilan data jika mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchAnnouncement();
        }
    }, [isEditMode, id]);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data pengumuman');
            const rawData = await response.json();

            // Sanitasi data: Pastikan data adalah object untuk mencegah crash saat akses properti
            const data = rawData && typeof rawData === 'object' ? rawData : {};

            setFormData({
                title: data.title || '',
                message: data.message || '',
                image: data.image || '',
                button_text: data.button_text || '',
                link: data.link || '',
                is_active: data.is_active !== undefined ? data.is_active : true
            });
            setLoading(false);
        } catch (err) {
            alert('Error: ' + err.message);
            navigate('/admin/announcements');
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const url = isEditMode
                ? `http://localhost:5000/api/announcements/${id}`
                : 'http://localhost:5000/api/announcements';
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
                alert(isEditMode ? 'Pengumuman berhasil diperbarui' : 'Pengumuman berhasil ditambahkan');
                navigate('/admin/announcements');
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
                        onClick={() => navigate('/admin/announcements')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {isEditMode ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                        </h1>
                        <p className="text-[#64748B] mt-1 font-bold text-xs">Informasikan berita penting secara instan melalui pop-up website.</p>
                    </div>
                </div>
                {/* Header Status Indicator */}
                <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest">Sistem Notifikasi Pop-Up</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-8">

                {/* Section 1: Pengaturan Pesan */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Info Utama (2 Kolom) */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Pop-Up</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        required
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Contoh: Kami sedang Libur Lebaran"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Isi Pesan Singkat</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-5 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <textarea
                                        rows="4"
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm resize-none text-sm leading-relaxed"
                                        placeholder="Jelaskan rincian pengumuman Anda di sini agar pelanggan paham..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Teks Tombol</label>
                                    <input
                                        type="text"
                                        name="button_text"
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Misal: Cek Sekarang"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Link Tujuan</label>
                                    <input
                                        type="text"
                                        name="link"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Misal: /products atau link eksternal"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Gambar Banner / Promo (Path)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                            placeholder="/images/promo.webp"
                                        />
                                        <p className="text-[10px] font-bold text-slate-400 italic ml-1 font-serif">Input path file (misal: /images/promo.jpg) untuk menampilkan gambar di pop-up.</p>
                                    </div>

                                    <div className="relative group aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-slate-200 mb-2" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Preview Pop-Up</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pengaturan Side (1 Kolom) */}
                    <div className="space-y-6">

                        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-inner">
                            {/* Toggle Aktif */}
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Visibilitas Pop-Up</label>
                                <div
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${formData.is_active ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 grayscale opacity-70'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {formData.is_active ? <Eye className="w-5 h-5 text-emerald-600" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                                        <span className="text-sm font-black text-[#1E293B] tracking-tight uppercase">Tampilkan di Web</span>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <motion.div animate={{ x: formData.is_active ? 22 : 2 }} className="absolute top-1.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Icon Preview Decoration */}
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center gap-2.5">
                                <div className={`p-4 rounded-2xl border shadow-lg ${formData.is_active ? 'bg-white border-blue-100 text-[#2563EB]' : 'bg-slate-100 border-slate-200 text-[#94A3B8]'}`}>
                                    <Megaphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-[#1E293B] uppercase tracking-widest">Icon Pop-up</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col md:flex-row gap-5 pt-6 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/announcements')}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-xl font-black text-xs text-[#64748B] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <X className="w-5 h-5" /> Batalkan & Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-8 py-4 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <CheckCircle2 className="w-5 h-5" />
                        )}
                        {isEditMode ? 'Simpan Pembaruan' : 'Terbitkan Pengumuman'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementForm;
