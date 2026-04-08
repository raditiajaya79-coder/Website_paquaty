import React, { useState, useEffect } from 'react'; // React library
import { useNavigate, useParams } from 'react-router-dom'; // Navigasi router
import { motion, AnimatePresence } from 'framer-motion'; // Animasi
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
    Image as ImageIcon,
    Sparkles,
    Check,
    UploadCloud
} from 'lucide-react'; // Ikon
import ImageUploader from '../../../../components/admin/ImageUploader';
import { API_BASE_URL, api } from '../../../../utils/api';

const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-rose-500/90 border-rose-400 text-white'
            }`}
    >
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
        <span className="text-sm font-black tracking-tight">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-4">
            <X className="w-4 h-4" />
        </button>
    </motion.div>
);

/**
 * AnnouncementForm Component — Halaman khusus untuk buat/edit Pengumuman pop-up.
 */
const AnnouncementForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        title_en: '',
        message: '',
        message_en: '',
        image: '',
        button_text: '',
        button_text_en: '',
        link: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // File image pengumuman
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchAnnouncement();
        }
    }, [isEditMode, id]);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/announcements/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data pengumuman');
            const data = await response.json();

            setFormData({
                title: data.title || '',
                title_en: data.title_en || '',
                message: data.message || '',
                message_en: data.message_en || '',
                image: data.image || '',
                button_text: data.button_text || '',
                button_text_en: data.button_text_en || '',
                link: data.link || '',
                is_active: data.is_active !== undefined ? data.is_active : true
            });
        } catch (err) {
            setToast({ message: 'Error: ' + err.message, type: 'error' });
            setTimeout(() => navigate('/admin/announcements'), 2000);
        } finally {
            setLoading(false);
        }
    };

    // Magic Translate Function (Google Translate API)
    const translateText = async (text, targetLang = 'en') => {
        if (!text) return '';
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0].map(item => item[0]).join('');
        } catch (error) {
            console.error("Translation error:", error);
            return text;
        }
    };

    const handleMagicTranslate = async () => {
        if (!formData.title && !formData.message && !formData.button_text) {
            setToast({ message: 'Mohon isi teks Indonesia terlebih dahulu', type: 'error' });
            return;
        }

        setIsTranslating(true);
        try {
            const [tTitle, tDesc, tBtn] = await Promise.all([
                translateText(formData.title),
                translateText(formData.message),
                translateText(formData.button_text)
            ]);

            setFormData(prev => ({
                ...prev,
                title_en: tTitle,
                message_en: tDesc,
                button_text_en: tBtn
            }));
            setToast({ message: 'Terjemahan otomatis berhasil!', type: 'success' });
        } catch (err) {
            setToast({ message: 'Gagal menerjemahkan', type: 'error' });
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let dataToSend = { ...formData };

            // --- TAHAP 1: Upload file jika ada ---
            if (selectedFile) {
                setToast({ message: 'Mengunggah banner...', type: 'success' });
                const result = await api.upload(selectedFile);
                dataToSend.image = result.url;
            }

            // --- TAHAP 2: Simpan Data ---
            const token = localStorage.getItem('admin_token');
            const url = isEditMode
                ? `${API_BASE_URL}/announcements/${id}`
                : `${API_BASE_URL}/announcements`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                setToast({ message: isEditMode ? 'Pengumuman diperbarui!' : 'Pengumuman diterbitkan!', type: 'success' });
                setTimeout(() => navigate('/admin/announcements'), 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Terjadi kesalahan');
            }
        } catch (err) {
            setToast({ message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnimatePresence>
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            </AnimatePresence>

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
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Indonesian Section */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">Bahasa Indonesia</span>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Pop-Up (ID)</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                        placeholder="Contoh: Kami sedang Libur Lebaran"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Isi Pesan (ID)</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-5 w-4.5 h-4.5 text-[#94A3B8]" />
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-100 transition-all shadow-sm resize-none text-sm leading-relaxed"
                                        placeholder="Jelaskan rincian pengumuman Anda di sini..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Teks Tombol (ID)</label>
                                <input
                                    type="text"
                                    value={formData.button_text}
                                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 px-6 font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder="Misal: Cek Sekarang"
                                />
                            </div>
                        </div>

                        {/* English Section */}
                        <div className="bg-blue-50/30 border border-blue-100 rounded-[2.5rem] p-8 md:p-10 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={handleMagicTranslate}
                                    disabled={isTranslating}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[9px] font-black text-indigo-600 rounded-md shadow-sm hover:bg-indigo-100 hover:text-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {isTranslating ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Wand2 className="w-3.5 h-3.5" />
                                    )}
                                    {isTranslating ? 'Menerjemahkan...' : 'Magic Translate (EN)'}
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest ml-1">Popup Title (EN)</label>
                                <input
                                    type="text"
                                    value={formData.title_en}
                                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                    className="w-full bg-white border border-blue-200 rounded-xl py-4 px-6 font-bold text-blue-900 focus:ring-4 focus:ring-blue-200/20 transition-all text-sm"
                                    placeholder="Example: We are on Holiday"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest ml-1">Message Content (EN)</label>
                                <textarea
                                    rows="4"
                                    value={formData.message_en}
                                    onChange={(e) => setFormData({ ...formData, message_en: e.target.value })}
                                    className="w-full bg-white border border-blue-200 rounded-xl py-4 px-6 font-bold text-blue-900 focus:ring-4 focus:ring-blue-200/20 transition-all shadow-sm resize-none text-sm leading-relaxed"
                                    placeholder="English explanation here..."
                                ></textarea>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest ml-1">Button Text (EN)</label>
                                <input
                                    type="text"
                                    value={formData.button_text_en}
                                    onChange={(e) => setFormData({ ...formData, button_text_en: e.target.value })}
                                    className="w-full bg-white border border-blue-200 rounded-xl py-4 px-6 font-bold text-blue-900 focus:ring-4 focus:ring-blue-200/20 transition-all text-sm"
                                    placeholder="Check Now"
                                />
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-sm">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Link Tujuan</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 px-6 font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                                    placeholder="Misal: /products atau link eksternal"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <ImageUploader
                                    label="Gambar Banner (Upload)"
                                    currentImage={formData.image}
                                    onFileSelect={(file) => setSelectedFile(file)}
                                    previewClassName="h-[250px] w-full"
                                />
                                <p className="text-[10px] font-bold text-slate-400 italic ml-1 leading-relaxed">Pilih file gambar untuk ditampilkan sebagai banner pop-up.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Status */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8 shadow-sm lg:sticky lg:top-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Status Visibilitas</label>
                                <div
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer ${formData.is_active ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-70'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${formData.is_active ? 'bg-white text-emerald-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                            {formData.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Aktifkan</p>
                                            <p className="text-[10px] font-bold text-slate-500">Muncul di Website</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full relative transition-colors p-1 ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <motion.div animate={{ x: formData.is_active ? 20 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center space-y-4">
                                <div className="w-16 h-16 bg-white border border-blue-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <Megaphone className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Sistem Notifikasi</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Pop-up ini akan tampil sekali per sesi setiap pengunjung baru datang.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Area */}
                <div className="flex flex-col md:flex-row gap-5 pt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/announcements')}
                        className="flex-1 px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black text-xs text-[#64748B] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <X className="w-5 h-5" /> Batalkan
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-[2] px-10 py-5 bg-[#1e40af] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5" />
                        )}
                        {isEditMode ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementForm;
