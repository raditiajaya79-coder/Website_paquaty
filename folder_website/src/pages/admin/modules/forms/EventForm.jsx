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
    Loader2,
    ChevronRight,
    Trash2,
    Wand2
} from 'lucide-react'; // Ikon
import Toast from '../../../../components/admin/Toast';
import ImageUploader from '../../../../components/admin/ImageUploader';
import { translateText } from '../../../../utils/translate';

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
        title_en: '',
        type: initialType,
        date: new Date().toISOString().split('T')[0],
        category: 'Wawasan',
        content: [{ type: 'text', value: '' }],
        content_en: [{ type: 'text', value: '' }],
        is_pinned: false,
        author: 'Admin Pakuaty', // Untuk Artikel
        location: '', // Untuk Event
        status: 'Upcoming', // Untuk Event
        image: ''
    });
    const [isTranslating, setIsTranslating] = useState(false);
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

            // Parse content field into blocks array
            let parsedContent = [{ type: 'text', value: '' }];
            let parsedContentEn = [{ type: 'text', value: '' }];
            
            const sourceContent = data.content || data.description || '';
            const sourceContentEn = data.content_en || data.description_en || '';

            try {
                const maybeArray = JSON.parse(sourceContent);
                if (Array.isArray(maybeArray)) parsedContent = maybeArray;
                else parsedContent = [{ type: 'text', value: sourceContent }];
            } catch (e) {
                parsedContent = [{ type: 'text', value: sourceContent }];
            }

            try {
                const maybeArrayEn = JSON.parse(sourceContentEn);
                if (Array.isArray(maybeArrayEn)) parsedContentEn = maybeArrayEn;
                else parsedContentEn = [{ type: 'text', value: sourceContentEn }];
            } catch (e) {
                parsedContentEn = [{ type: 'text', value: sourceContentEn }];
            }

            setFormData({
                title: data.title || '',
                title_en: data.title_en || '',
                type: initialType,
                date: data.date ? (new Date(data.date).toString() !== 'Invalid Date' ? new Date(data.date).toISOString().split('T')[0] : '') : '',
                category: data.category || 'Wawasan',
                content: parsedContent,
                content_en: parsedContentEn,
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

    // Helper functions for dynamic content blocks
    const addBlock = (type) => {
        setFormData(prev => ({
            ...prev,
            content: [...(Array.isArray(prev.content) ? prev.content : []), { type, value: '' }],
            content_en: [...(Array.isArray(prev.content_en) ? prev.content_en : []), { type, value: '' }]
        }));
    };

    const updateBlock = (index, value, isEn = false) => {
        setFormData(prev => {
            const field = isEn ? 'content_en' : 'content';
            const updatedContent = [...prev[field]];
            updatedContent[index] = { ...updatedContent[index], value };
            return { ...prev, [field]: updatedContent };
        });
    };

    const removeBlock = (index) => {
        setFormData(prev => {
            const updatedContent = [...prev.content];
            const updatedContentEn = [...prev.content_en];
            updatedContent.splice(index, 1);
            updatedContentEn.splice(index, 1);
            return { ...prev, content: updatedContent, content_en: updatedContentEn };
        });
    };

    const moveBlock = (index, direction) => {
        setFormData(prev => {
            const updatedContent = [...prev.content];
            const updatedContentEn = [...prev.content_en];
            if (index + direction >= 0 && index + direction < updatedContent.length) {
                // Move ID
                const temp = updatedContent[index];
                updatedContent[index] = updatedContent[index + direction];
                updatedContent[index + direction] = temp;
                // Move EN
                const tempEn = updatedContentEn[index];
                updatedContentEn[index] = updatedContentEn[index + direction];
                updatedContentEn[index + direction] = tempEn;
            }
            return { ...prev, content: updatedContent, content_en: updatedContentEn };
        });
    };

    // Handle Auto Translation for Events/Articles
    const handleTranslate = async () => {
        if (!formData.title && formData.content.every(b => !b.value)) {
            setToast({ show: true, message: 'Harap isi judul atau konten terlebih dahulu.', type: 'error' });
            return;
        }

        setIsTranslating(true);
        try {
            // Translate title
            const title_en = await translateText(formData.title);

            // Translate content blocks
            const translatedBlocks = await Promise.all(
                formData.content.map(async (block) => {
                    if (block.type === 'text' && block.value.trim()) {
                        const translatedValue = await translateText(block.value);
                        return { ...block, value: translatedValue };
                    }
                    return { ...block }; // Return image block as-is
                })
            );

            setFormData(prev => ({
                ...prev,
                title_en,
                content_en: translatedBlocks
            }));

            setToast({ show: true, message: 'Penerjemahan otomatis berhasil!', type: 'success' });
        } catch (error) {
            console.error('Auto-translation failed:', error);
            setToast({ show: true, message: 'Gagal menerjemahkan secara otomatis.', type: 'error' });
        } finally {
            setIsTranslating(false);
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

            // Serialize content blocks to JSON string
            const serializedContent = JSON.stringify(formData.content);
            const serializedContentEn = JSON.stringify(formData.content_en);

            if (formData.type === 'Event') {
                payload.description = serializedContent;
                payload.description_en = serializedContentEn;
            } else {
                payload.content = serializedContent;
                payload.content_en = serializedContentEn;
                // Generate excerpt from the first text block
                const firstTextBlock = formData.content.find(b => b.type === 'text');
                const excerptSource = firstTextBlock ? firstTextBlock.value : '';
                payload.excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

                const firstTextBlockEn = formData.content_en.find(b => b.type === 'text');
                const excerptSourceEn = firstTextBlockEn ? firstTextBlockEn.value : '';
                payload.excerpt_en = excerptSourceEn.substring(0, 150) + (excerptSourceEn.length > 150 ? '...' : '');
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
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Judul Utama (ID)</label>
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
                                <label className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest ml-1 italic">Main Title (EN)</label>
                                <input
                                    type="text"
                                    name="title_en"
                                    value={formData.title_en}
                                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                    className="w-full bg-blue-50/30 border border-blue-100 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm text-sm"
                                    placeholder="Enter event title in English..."
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
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

                    {/* Section: Image Upload untuk Cover/Banner Utama */}
                    <div className="flex flex-col md:flex-row gap-6 mt-8 pt-8 border-t border-slate-100">
                        <div className="w-full md:w-1/2 lg:w-1/3 shrink-0">
                            <ImageUploader
                                label="Gambar Cover / Banner Utama"
                                currentImage={formData.image}
                                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-left flex-1 flex flex-col justify-center">
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-relaxed">
                                <strong className="text-slate-700 text-sm">Info Gambar Cover</strong><br /><br />
                                Gambar ini akan muncul sebagai <span className="text-blue-600">Thumbnail</span> (gambar kecil) di halaman daftar Artikel/Event, dan juga akan diletakkan sebagai <span className="text-blue-600">Banner Hero</span> berukuran besar paling atas ketika pengunjung mengeklik dan membaca detail halaman ini.
                                <br /><br />
                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">Rekomendasi: Landscape (1280x720px)</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Editor Isi Konten Dinamis (Teks & Gambar Bebas) */}
                <div className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Isi Konten & Narasi Dinamis</label>
                            <p className="text-[9px] font-bold text-slate-400 ml-1">Bisa tambah banyak gambar & teks dalam dua bahasa</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="flex items-center gap-1.5 text-[10px] font-black text-brand-gold hover:text-brand-gold/80 transition-colors disabled:opacity-50 uppercase tracking-widest"
                        >
                            {isTranslating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Wand2 className="w-3 h-3" />
                            )}
                            Magic Auto-Translate
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.content.map((block, index) => (
                            <div key={index} className="relative group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
                                {/* Block Controls */}
                                <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, -1)}
                                        disabled={index === 0}
                                        className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 shadow-sm disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-4 h-4 -rotate-90" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, 1)}
                                        disabled={index === formData.content.length - 1}
                                        className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 shadow-sm disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeBlock(index)}
                                        className="p-1.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Block Content */}
                                {block.type === 'text' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <textarea
                                            rows="4"
                                            required
                                            value={block.value}
                                            onChange={(e) => updateBlock(index, e.target.value, false)}
                                            className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-y text-sm leading-relaxed"
                                            placeholder="Tulis narasi di sini (ID)..."
                                        ></textarea>
                                        <textarea
                                            rows="4"
                                            value={formData.content_en[index]?.value || ''}
                                            onChange={(e) => updateBlock(index, e.target.value, true)}
                                            className="w-full bg-blue-50/10 border border-blue-100/50 rounded-xl py-4 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-50 transition-all resize-y text-sm leading-relaxed"
                                            placeholder="Translate narrative here (EN)..."
                                        ></textarea>
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        <ImageUploader
                                            label={`Gambar Konten ${index + 1}`}
                                            currentImage={block.value}
                                            onUploadSuccess={(url) => updateBlock(index, url)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Block Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => addBlock('text')}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all"
                        >
                            <Type className="w-4 h-4" /> Tambah Paragraf
                        </button>
                        <button
                            type="button"
                            onClick={() => addBlock('image')}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all"
                        >
                            <ImageIcon className="w-4 h-4" /> Tambah Gambar
                        </button>
                    </div>
                </div>

                {/* Section: Image Upload from Device has been moved up */}



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
