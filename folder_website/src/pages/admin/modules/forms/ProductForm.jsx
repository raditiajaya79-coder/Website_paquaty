import React, { useState, useEffect } from 'react'; // React library
import { useNavigate, useParams } from 'react-router-dom'; // Navigasi
import { motion } from 'framer-motion'; // Animasi
import {
    Package,
    Plus,
    CheckCircle2,
    X,
    Star,
    Image as ImageIcon,
    Trash2,
    ArrowLeft,
    Wand2,
    Loader2
} from 'lucide-react'; // Ikon
import ImageUploader from '../../../../components/admin/ImageUploader';
import { translateText } from '../../../../utils/translate';
import Toast from '../../../../components/admin/Toast';
import { API_BASE_URL } from '../../../../utils/api';

/**
 * ProductForm Component — Halaman khusus untuk tambah/edit produk.
 * Menggantikan sistem modal sebelumnya sesuai permintaan user.
 */
const ProductForm = () => {
    const navigate = useNavigate(); // Hook untuk navigasi antar halaman
    const { id } = useParams(); // Mengambil ID dari URL jika dalam mode edit
    const isEditMode = Boolean(id); // Menentukan apakah sedang mengedit atau menambah baru

    // State untuk form data
    const [formData, setFormData] = useState({
        name: '',
        name_en: '',
        grade: '',
        grade_en: '',
        origin: 'Kediri, East Java',
        origin_en: 'Kediri, East Java',
        moq: '100 pcs',
        category: 'Tempe Chips',
        category_en: '',
        price: '',
        original_price: '',
        description: '',
        description_en: '',
        tag: '',
        is_bestseller: 0,
        is_hero: 0,
        image: '',
        detail_image: '',
        packaging_options: []
    });
    const [isTranslating, setIsTranslating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Ambil data produk jika dalam mode edit
    useEffect(() => {
        if (isEditMode) {
            fetchProductData();
        }
    }, [isEditMode, id]);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data produk');
            const data = await response.json();

            // Konversi data dari DB ke state form (terutama JSON packaging_options)
            setFormData({
                ...data,
                price: data.price?.toString() || '',
                original_price: data.original_price?.toString() || '',
                packaging_options: typeof data.packaging_options === 'string'
                    ? JSON.parse(data.packaging_options)
                    : data.packaging_options || []
            });
            setLoading(false);
        } catch (err) {
            setToast({ show: true, message: 'Gagal memuat produk: ' + err.message, type: 'error' });
            setTimeout(() => navigate('/admin/products'), 2000);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Variant management is now handled inline within the render or can be moved here if needed, 
    // but the inline click handlers in the JSX are already functional using packaging_options.

    // Handle Submit Form (Save to DB)
    // Handle auto translation
    const handleTranslate = async () => {
        if (!formData.name && !formData.grade && !formData.description) {
            setToast({ show: true, message: 'Harap isi setidaknya satu field dalam Bahasa Indonesia.', type: 'error' });
            return;
        }

        setIsTranslating(true);
        try {
            const [name_en, grade_en, category_en, origin_en, description_en] = await Promise.all([
                translateText(formData.name),
                translateText(formData.grade),
                translateText(formData.category),
                translateText(formData.origin),
                translateText(formData.description)
            ]);

            setFormData(prev => ({
                ...prev,
                name_en,
                grade_en,
                category_en,
                origin_en,
                description_en
            }));
            setToast({ show: true, message: 'Penerjemahan otomatis berhasil!', type: 'success' });
        } catch (error) {
            console.error('Auto-translation failed:', error);
            setToast({ show: true, message: 'Gagal menerjemahkan secara otomatis.', type: 'error' });
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('admin_token');
            const url = isEditMode
                ? `${API_BASE_URL}/products/${id}`
                : `${API_BASE_URL}/products`;
            const method = isEditMode ? 'PUT' : 'POST';

            // Bersihkan data sebelum kirim (pastikan angka adalah angka)
            const submissionData = {
                ...formData,
                price: parseInt(formData.price.replace(/[^0-9]/g, '')),
                original_price: parseInt(formData.original_price.replace(/[^0-9]/g, '')),
                is_bestseller: formData.is_bestseller ? 1 : 0,
                is_hero: formData.is_hero ? 1 : 0,
                packaging_options: formData.packaging_options
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Produk berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}!`,
                    type: 'success'
                });
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                const errorData = await response.json();
                setToast({ show: true, message: 'Gagal menyimpan: ' + (errorData.error || 'Terjadi kesalahan'), type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Kesalahan jaringan: ' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Form & Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {isEditMode ? 'Edit Produk' : 'Tambah Produk'}
                        </h1>
                        <p className="text-[#64748B] mt-1 font-bold text-xs">Lengkapi detail produk PT Bala Aditi Pakuaty.</p>
                    </div>
                </div>
                {/* Header Status Indicator */}
                <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest">Sistem Inventori Aktif</span>
                </div>
            </div>

            {/* Main Form Area — Flat Style tanpa Card tambahan */}
            <form onSubmit={handleSubmit} className="space-y-6 pb-8">


                {/* Section 1: Identitas Produk (Flat) */}
                <div className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Nama Produk (ID)</label>
                                <input
                                    type="text"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Keripik Tempe Original"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Product Name (EN)</label>
                                <input
                                    type="text"
                                    name="name_en"
                                    value={formData.name_en}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Original Tempe Chips"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Grade / Subtitle (ID)</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Camilan Tradisional"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Grade / Subtitle (EN)</label>
                                <input
                                    type="text"
                                    name="grade_en"
                                    value={formData.grade_en}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Traditional Snack"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Kategori (ID)</label>
                                <input
                                    type="text"
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Kripik Tempe"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Category (EN)</label>
                                <input
                                    type="text"
                                    name="category_en"
                                    value={formData.category_en}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Tempe Chips"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Asal / Origin (ID)</label>
                                <input
                                    type="text"
                                    name="origin"
                                    value={formData.origin}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Kediri, Jawa Timur"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Asal / Origin (EN)</label>
                                <input
                                    type="text"
                                    name="origin_en"
                                    value={formData.origin_en}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                    placeholder="Kediri, East Java"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Harga Jual */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Harga Jual (RP)</label>
                            <input
                                type="text"
                                required
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                placeholder="15000"
                            />
                        </div>
                        {/* Harga Coret */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Harga Asli (RP)</label>
                            <input
                                type="text"
                                required
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-5 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-sm"
                                placeholder="20000"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Varian Kemasan (Opsi)</label>
                        <div className="space-y-3">
                            {formData.packaging_options.map((variant, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-white/50 border border-slate-100 rounded-2xl group transition-all">
                                    <input
                                        type="text"
                                        className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 px-5 font-bold text-[#1E293B] text-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
                                        placeholder="Nama Kemasan (ex: Pouch 100gr)"
                                        value={variant.label}
                                        onChange={(e) => {
                                            const newVariants = [...formData.packaging_options];
                                            newVariants[index].label = e.target.value;
                                            setFormData({ ...formData, packaging_options: newVariants });
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="w-48 bg-white border border-slate-200 rounded-xl py-2.5 px-5 font-bold text-[#1E293B] text-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
                                        placeholder="Value (ex: 100g)"
                                        value={variant.value}
                                        onChange={(e) => {
                                            const newVariants = [...formData.packaging_options];
                                            newVariants[index].value = e.target.value;
                                            setFormData({ ...formData, packaging_options: newVariants });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newVariants = formData.packaging_options.filter((_, i) => i !== index);
                                            setFormData({ ...formData, packaging_options: newVariants });
                                        }}
                                        className="p-2.5 text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, packaging_options: [...formData.packaging_options, { label: '', value: '' }] })}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Tambah Varian Kemasan
                            </button>
                        </div>
                    </div>
                </div >

                {/* Section 3: Deskripsi & Media (Flat) */}
                <div className="space-y-6">


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Deskripsi Lengkap (ID)</label>
                                    <button
                                        type="button"
                                        onClick={handleTranslate}
                                        disabled={isTranslating}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[9px] font-black text-indigo-600 rounded-md shadow-sm hover:bg-indigo-100 hover:text-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isTranslating ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Wand2 className="w-3.5 h-3.5" />
                                        )}
                                        Magic Auto-Translate
                                    </button>
                                </div>
                                <textarea
                                    rows="8"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm resize-none text-sm leading-relaxed"
                                    placeholder="Detail produk lengkap..."
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1">Full Description (EN)</label>
                                <textarea
                                    rows="8"
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm resize-none text-sm leading-relaxed"
                                    placeholder="Complete product details in English..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest ml-1 text-center block">Media Foto</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Slot 1: Foto Utama */}
                                <div className="space-y-3">
                                    <ImageUploader
                                        label="Foto Utama (Semua Format)"
                                        currentImage={formData.image}
                                        onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                    />
                                    <p className="text-[9px] font-bold text-slate-400 italic ml-1">Unggah foto produk terbaik. Semua format (JPG, PNG, WebP) didukung.</p>
                                </div>

                                {/* Slot 2: Foto Detail */}
                                <div className="space-y-3">
                                    <ImageUploader
                                        label="Foto Detail (Semua Format)"
                                        currentImage={formData.detail_image}
                                        onUploadSuccess={(url) => setFormData({ ...formData, detail_image: url })}
                                    />
                                    <p className="text-[9px] font-bold text-slate-400 italic ml-1">Unggah foto suasana atau detail kemasan produk.</p>
                                </div>
                            </div>
                            {/* Highlights */}
                            <div className="pt-4">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Best Seller</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, is_bestseller: formData.is_bestseller ? 0 : 1 })}
                                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${formData.is_bestseller ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <motion.div
                                            animate={{ x: formData.is_bestseller ? 26 : 2 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

                {/* Footer Buttons */}
                < div className="flex flex-col md:flex-row gap-5 pt-6" >
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-xl font-black text-xs text-[#64748B] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
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
                        {isEditMode ? 'Simpan Perubahan' : 'Terbitkan Produk'}
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
        </div>
    );
};

export default ProductForm;
