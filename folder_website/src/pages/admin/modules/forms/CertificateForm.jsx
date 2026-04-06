import React, { useState, useEffect } from 'react'; // React library
import { useNavigate, useParams } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Award,
    CheckCircle2,
    X,
    Calendar,
    ArrowLeft,
    Type,
    Building2,
    FileText,
    UploadCloud,
    Eye,
    EyeOff
} from 'lucide-react'; // Ikon
import Toast from '../../../../components/admin/Toast'; // Komponen Toast
import ImageUploader from '../../../../components/admin/ImageUploader'; // Import uploader baru
import { API_BASE_URL } from '../../../../utils/api';
import { translateText } from '../../../../utils/translate';
import { Wand2, Loader2 } from 'lucide-react';

/**
 * CertificateForm Component — Halaman khusus untuk buat/edit Sertifikat legalitas.
 * Menggunakan layout lebar (w-full) sesuai arahan user agar tidak terasa sempit.
 */
const CertificateForm = () => {
    const navigate = useNavigate(); // Hook untuk navigasi
    const { id } = useParams(); // ID jika dalam mode edit
    const isEditMode = Boolean(id); // Menentukan mode tambah atau edit

    // State untuk form data
    const [formData, setFormData] = useState({
        title: '',
        title_en: '',
        issued_by: '',
        sub: '',
        sub_en: '',
        description: '',
        description_en: '',
        year: new Date().getFullYear().toString(),
        is_pinned: 0,
        is_active: 1,
        image: ''
    });
    const [isTranslating, setIsTranslating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // State untuk notifikasi feedback

    // Simulasi pengambilan data jika mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchCertificateData() // Menggunakan fungsi pengambilan data yang diperbarui
        }
    }, [isEditMode, id]);

    /**
     * @function fetchCertificateData
     * @description Mengambil data sertifikat dari API.
     * Melakukan sanitasi data yang diterima untuk memastikan keamanan dan validitas tipe data.
     */
    const fetchCertificateData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/certificates/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data sertifikat');
            const rawData = await response.json();

            // Sanitasi data: Pastikan data adalah object yang valid
            const data = rawData && typeof rawData === 'object' ? rawData : {};

            setFormData({
                title: data.title || '',
                title_en: data.title_en || '',
                issued_by: data.issued_by || '',
                sub: data.sub || '',
                sub_en: data.sub_en || '',
                description: data.description || '',
                description_en: data.description_en || '',
                year: data.year || '',
                image: data.image || '',
                is_pinned: (data.is_pinned === 1 || data.is_pinned === true) ? 1 : 0,
                is_active: (data.is_active === 1 || data.is_active === true || data.is_active === undefined) ? 1 : 0
            });
            setLoading(false);
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
            setTimeout(() => navigate('/admin/certificates'), 2000); // Redirect setelah 2 detik
        }
    };

    const handleTranslate = async () => {
        if (!formData.title && !formData.sub && !formData.description) {
            setToast({ show: true, message: 'Harap isi data Indonesia terlebih dahulu.', type: 'error' });
            return;
        }
        setIsTranslating(true);
        try {
            const [tTitle, tSub, tDesc] = await Promise.all([
                translateText(formData.title),
                translateText(formData.sub),
                translateText(formData.description)
            ]);
            setFormData(prev => ({
                ...prev,
                title_en: tTitle,
                sub_en: tSub,
                description_en: tDesc
            }));
            setToast({ show: true, message: 'Berhasil diterjemahkan!', type: 'success' });
        } catch (err) {
            setToast({ show: true, message: 'Gagal menerjemahkan.', type: 'error' });
        } finally {
            setIsTranslating(false);
        }
    };

    // simplified to text input
    const handleFileChange = (e) => { };

    // Handle Submit — Mengirim data ke backend (POST untuk baru, PUT untuk update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token'); // Ambil token auth
            const url = isEditMode
                ? `${API_BASE_URL}/certificates/${id}` // Endpoint update
                : `${API_BASE_URL}/certificates`; // Endpoint create
            const method = isEditMode ? 'PUT' : 'POST'; // Tentukan metode HTTP

            const submissionData = {
                ...formData,
                is_active: formData.is_active ? 1 : 0,
                is_pinned: formData.is_pinned ? 1 : 0
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submissionData) // Kirim payload JSON
            });

            if (response.ok) {
                // Notifikasi sukses
                setToast({
                    show: true,
                    message: isEditMode ? 'Sertifikat diperbarui!' : 'Sertifikat diterbitkan!',
                    type: 'success'
                });
                // Kembali ke list setelah jeda singkat agar toast terlihat
                setTimeout(() => navigate('/admin/certificates'), 1500);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Terjadi kesalahan sistem');
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
                        onClick={() => navigate('/admin/certificates')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {isEditMode ? 'Edit Sertifikasi' : 'Input Sertifikat Baru'}
                        </h1>
                        <p className="text-[#64748B] mt-1 font-bold text-xs">Lengkapi data legalitas perusahaan untuk membangun kepercayaan pelanggan.</p>
                    </div>
                </div>
                {/* Header Status Indicator */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest">Arsip Sertifikat Resmi</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Section 1: Identitas Sertifikat */}
                    <div className="space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Nama Sertifikat</label>
                                    <button
                                        type="button"
                                        onClick={handleTranslate}
                                        disabled={isTranslating}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[9px] font-black text-indigo-600 rounded-md shadow-sm hover:bg-indigo-100 hover:text-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                                        {isTranslating ? 'Translating...' : 'Magic Auto-Translate (EN)'}
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
                                        placeholder="Misal: Sertifikat Halal MUI"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Penerbit / Instansi</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                        <input
                                            type="text"
                                            required
                                            name="issued_by"
                                            value={formData.issued_by}
                                            onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                            placeholder="Nama Instansi"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Sub-Kategori (ID)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                        <input
                                            type="text"
                                            required
                                            name="sub"
                                            value={formData.sub}
                                            onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                            placeholder="Misal: Food Safety"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Title (EN)</label>
                                    <input
                                        type="text"
                                        name="title_en"
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full bg-blue-50/20 border border-blue-100 rounded-xl py-3 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Certificate Title (EN)"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Sub-Category (EN)</label>
                                    <input
                                        type="text"
                                        name="sub_en"
                                        value={formData.sub_en}
                                        onChange={(e) => setFormData({ ...formData, sub_en: e.target.value })}
                                        className="w-full bg-blue-50/20 border border-blue-100 rounded-xl py-3 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="Sub-Category (EN)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Deskripsi (ID)</label>
                                <textarea
                                    rows="3"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm resize-none"
                                    placeholder="Jelaskan detail sertifikat..."
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Description (EN)</label>
                                <textarea
                                    rows="3"
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                    className="w-full bg-blue-50/20 border border-blue-100 rounded-xl py-3 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm resize-none"
                                    placeholder="Describe the certificate details in English..."
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Tahun Terbit</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <input
                                        type="number"
                                        required
                                        name="year"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                        placeholder="2024"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visibility Toggle */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest ml-1">Visibilitas</label>
                            <div
                                onClick={() => setFormData({ ...formData, is_active: formData.is_active ? 0 : 1 })}
                                className={`flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer ${formData.is_active ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {formData.is_active ? <Eye className="w-5 h-5 text-emerald-600" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                                    <span className="text-sm font-black text-[#1E293B] tracking-tight">Tampilkan di Halaman About</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <motion.div animate={{ x: formData.is_active ? 22 : 2 }} className="absolute top-1.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Pinned Toggle */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 text-center lg:text-left block">Highlight (Pin)</label>
                            <div
                                onClick={() => setFormData({ ...formData, is_pinned: formData.is_pinned ? 0 : 1 })}
                                className={`flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer ${formData.is_pinned ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Award className={`w-5 h-5 ${formData.is_pinned ? 'text-amber-600' : 'text-slate-400'}`} />
                                    <span className="text-sm font-black text-[#1E293B] tracking-tight">Pin ke Bagian Atas</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.is_pinned ? 'bg-amber-500' : 'bg-slate-300'}`}>
                                    <motion.div animate={{ x: formData.is_pinned ? 22 : 2 }} className="absolute top-1.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Image Upload from Device */}
                    <div className="space-y-4">
                        <ImageUploader
                            label="Dokumen Sertifikat (Semua Format)"
                            currentImage={formData.image}
                            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                        />
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-center">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                                Pastikan gambar terlihat jelas untuk keperluan verifikasi legalitas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col md:flex-row gap-5 pt-6 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/certificates')}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-xl font-black text-xs text-[#64748B] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <X className="w-5 h-5" /> Batal & Kembali
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
                        {isEditMode ? 'Simpan Validasi' : 'Tambahkan Legalitas'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateForm;
