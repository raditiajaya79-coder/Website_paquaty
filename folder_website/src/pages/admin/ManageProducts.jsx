import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, Package, X, Star, Tag, Upload, Search, Filter, Box, BarChart3, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

/**
 * ManageProducts — Manajemen Katalog Produk Admin.
 * Layout 2 kolom: Grid Produk (Main) + Insights & Filter (Sidebar).
 */
const ManageProducts = () => {
    const { showToast, setGlobalLoading } = useAdmin();
    const [products, setProducts] = useState([]); // Daftar produk
    const [loading, setLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [editingProduct, setEditingProduct] = useState(null); // Produk diedit
    const [uploading, setUploading] = useState(false); // Upload gambar state
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian
    const [activeCategory, setActiveCategory] = useState('All'); // Filter kategori

    // Form state awal
    const initialFormState = { name: '', description: '', price: '', originalPrice: '', image: '', category: 'Tempe Chips', grade: 'Export Quality', tag: '', origin: 'Malang, Indonesia', moq: '1000 Units', packagingOptions: [{ label: "50 Gram", value: "50g" }], isBestseller: false };
    const [formData, setFormData] = useState(initialFormState);

    /** fetchProducts — Ambil data produk terbaru dari backend */
    const fetchProducts = async () => {
        setLoading(true);
        try { setProducts(await api.get('/products')); } catch (err) { console.error("Gagal memuat produk:", err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    /** handleFileUpload — Proses unggah gambar produk */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try { const r = await api.upload(file); setFormData(prev => ({ ...prev, image: `http://localhost:5000${r.url}` })); showToast("Media terunggah", "success"); }
        catch (err) { showToast("Gagal mengunggah", "error"); } finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalLoading(true);
        try {
            if (editingProduct) { await api.put(`/products/${editingProduct.id}`, formData); showToast("Produk diperbarui", "success"); }
            else { await api.post('/products', formData); showToast("Produk ditambahkan", "success"); }
            setIsModalOpen(false); fetchProducts();
        } catch (err) { showToast("Gagal menyimpan", "error"); } finally { setGlobalLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus produk ini dari database?")) {
            setGlobalLoading(true);
            try { await api.delete(`/products/${id}`); showToast("Produk dihapus", "info"); fetchProducts(); }
            catch (err) { showToast("Gagal menghapus", "error"); } finally { setGlobalLoading(false); }
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name || '', description: product.description || '', price: product.price || '', originalPrice: product.originalPrice || '', image: product.image || '', category: product.category || 'Tempe Chips', grade: product.grade || 'Export Quality', tag: product.tag || '', origin: product.origin || 'Malang, Indonesia', moq: product.moq || '1000 Units', packagingOptions: product.packagingOptions || [{ label: "50 Gram", value: "50g" }], isBestseller: !!product.isBestseller });
        setIsModalOpen(true);
    };

    // Filter logika
    const filteredProducts = products.filter(p =>
        (activeCategory === 'All' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-24 font-semibold text-slate-400 text-sm tracking-widest italic animate-pulse transition-opacity">MENGUMPULKAN DATA INVENTARIS...</div>;

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center border border-brand-blue/10">
                        <Package size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-stone-dark tracking-tight leading-none">Inventaris Produk</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Manajemen Katalog SKU</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold w-full sm:w-64 focus:ring-1 focus:ring-brand-blue/30 transition-all border-dashed"
                        />
                    </div>
                    <button onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData(initialFormState); }} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-dark shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98] whitespace-nowrap">
                        <Plus size={16} /> Tambah Produk
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Right Column: Statistics & Filter Sidebar (3/12) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Filter size={14} className="text-brand-blue" /> Kategori Terdaftar
                        </h3>
                        <div className="flex flex-col gap-1">
                            {['All', 'Tempe Chips', 'Packaging'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-brand-blue text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} className="text-brand-blue" /> Statistik SKU
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-stone-dark">{products.length}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Items</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-brand-gold">{products.filter(p => p.isBestseller).length}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Bestsellers</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-medium text-slate-500">Market Coverage</span>
                                <span className="text-[11px] font-bold text-brand-blue">100% Active</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-brand-blue h-full w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column: Product Grid (9/12) */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                <Package className="mx-auto text-slate-200 mb-4" size={40} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">SKU tidak ditemukan.</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    className="bg-white rounded-xl md:rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                                >
                                    <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-3 md:p-6">
                                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        {product.isBestseller && (
                                            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-brand-gold text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1 md:gap-1.5">
                                                <Star className="w-2 h-2 md:w-2.5 md:h-2.5" fill="currentColor" /> Best
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-white/90 backdrop-blur-md px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg border border-slate-200/50 flex items-center gap-1">
                                            <Tag className="w-2 h-2 md:w-2.5 md:h-2.5 text-brand-blue" />
                                            <span className="text-[7px] md:text-[9px] font-bold text-slate-600 uppercase tracking-widest">{product.category}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                                        <div className="mb-3 md:mb-4">
                                            <h3 className="font-bold text-stone-dark text-xs md:text-sm line-clamp-2 md:line-clamp-1 group-hover:text-brand-blue transition-colors mb-0.5">{product.name}</h3>
                                            <p className="text-[10px] md:text-xs font-black text-brand-blue">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex gap-1.5 md:gap-2">
                                            <button onClick={() => openEditModal(product)} className="flex-1 py-1.5 md:py-2 bg-slate-50 text-slate-400 hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg md:rounded-xl font-bold text-[8px] md:text-[10px] uppercase tracking-widest transition-all border border-slate-100"><Edit2 className="w-3 h-3 md:w-3.5 md:h-3.5 mx-auto" /></button>
                                            <button onClick={() => handleDelete(product.id)} className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg md:rounded-xl transition-all flex items-center justify-center border border-rose-100"><Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form — unified styling */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
                        >
                            {/* Header Modal — Presisi & Informatif */}
                            <div className="px-5 py-4 md:px-7 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 shrink-0">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-stone-dark leading-none">{editingProduct ? 'Perbarui Atribut Produk' : 'Registrasi Produk Baru'}</h3>
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Core Inventory Management System</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all hover:bg-rose-50 shrink-0"><X size={18} /></button>
                            </div>

                            {/* Form Input — Tata Letak Padat & Rapi */}
                            <form onSubmit={handleSubmit} className="p-5 md:p-7 overflow-y-auto space-y-4 md:space-y-6 no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-5">
                                    {/* Primary Information */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nama Identitas Produk</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue/30 focus:border-brand-blue outline-none text-sm md:text-base font-bold text-stone-dark shadow-sm transition-all" placeholder="Contoh: Kopi Tempe Original..." />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Segmentasi Kategori</label>
                                        <div className="relative">
                                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none text-xs md:text-sm font-bold text-brand-blue cursor-pointer appearance-none shadow-sm focus:border-brand-blue transition-all">
                                                <option value="Tempe Chips">Sangat Renyah (Tempe Chips)</option>
                                                <option value="Packaging">Kemasan (Packaging)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <Tag size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Standarisasi Mutu</label>
                                        <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none text-xs md:text-sm font-bold text-emerald-600 shadow-sm focus:border-emerald-300 transition-all">
                                            <option value="Export Quality">Export Grade A+</option>
                                            <option value="Standard Quality">Standard Quality</option>
                                            <option value="Premium Quality">Special Premium Rank</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Deskripsi & Narasi Singkat</label>
                                        <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none resize-none text-xs md:text-sm leading-relaxed text-slate-600 shadow-sm focus:border-brand-blue transition-all" placeholder="Jelaskan karakteristik unik produk ini..." />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Harga Satuan (IDR)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[10px] md:text-xs uppercase tracking-widest pointer-events-none">Rp</span>
                                            <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none text-base md:text-lg font-black text-brand-blue shadow-sm focus:border-brand-blue transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Geolokasi Produksi</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} md:size={16} />
                                            <input name="origin" value={formData.origin} onChange={handleInputChange} className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none text-xs md:text-sm font-bold text-stone-dark shadow-sm focus:border-brand-blue transition-all" placeholder="Contoh: Malang, Jawa Timur" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Asset Digital (URL Media)</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} md:size={16} />
                                                <input required name="image" value={formData.image} onChange={handleInputChange} className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl text-[10px] md:text-[11px] font-medium outline-none text-slate-400 truncate shadow-sm focus:border-brand-blue transition-all" placeholder="Unggah atau tempel URL gambar..." />
                                            </div>
                                            <label className="cursor-pointer w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-blue transition-all shadow-lg active:scale-95 group shrink-0">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Area Kontrol Tambahan & Tombol Aksi */}
                                <div className="pt-2 md:pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                                    <label className="flex items-center gap-3 md:gap-4 cursor-pointer group select-none">
                                        <div className="relative w-10 md:w-12 h-5 md:h-6 bg-slate-100 rounded-full border border-slate-200 transition-colors peer-checked:bg-brand-gold group-hover:border-brand-gold/50">
                                            <input type="checkbox" name="isBestseller" checked={formData.isBestseller} onChange={handleInputChange} className="peer hidden" />
                                            <div className="absolute left-1 top-0.5 md:top-1 w-3.5 md:w-4 h-3.5 md:h-4 bg-white rounded-full shadow-md transition-all border border-slate-200 peer-checked:translate-x-5 md:peer-checked:translate-x-6 peer-checked:border-brand-gold flex items-center justify-center">
                                                <Star size={7} md:size={8} className="text-brand-gold opacity-0 peer-checked:opacity-100" fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] md:text-[11px] font-black text-stone-dark uppercase tracking-widest leading-none">Best Seller Status</span>
                                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase mt-1">Munculkan di rute populer</span>
                                        </div>
                                    </label>

                                    <button type="submit" disabled={uploading} className="flex-1 md:flex-initial px-6 md:px-10 py-3 md:py-4 bg-brand-blue text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:bg-stone-dark hover:shadow-stone-dark/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3">
                                        {uploading ? 'Sinkronisasi Media...' : (editingProduct ? <><Edit2 size={14} /> Simpan Perubahan</> : <><Plus size={16} /> Daftarkan Inventaris</>)}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProducts;
