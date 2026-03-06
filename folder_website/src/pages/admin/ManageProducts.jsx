import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    X,
    Save,
    Star,
    Trophy,
    Info,
    LayoutGrid,
    Tag,
    Upload
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Library animasi

/**
 * ManageProducts — Halaman Manajemen Produk untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageProducts = () => {
    const [products, setProducts] = useState([]); // State daftar produk
    const [loading, setLoading] = useState(true); // State loading
    const [isModalOpen, setIsModalOpen] = useState(false); // State modal
    const [editingProduct, setEditingProduct] = useState(null); // Produk yang sedang diedit

    // Initial Form State
    const initialFormState = {
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        category: 'Tempe Chips',
        grade: 'Export Quality',
        tag: '',
        origin: 'Malang, Indonesia',
        moq: '1000 Units',
        packagingOptions: [{ label: "50 Gram", value: "50g" }],
        isBestseller: false,
        isHero: false
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fungsi muat data
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.get('/products');
            setProducts(data);
        } catch (err) {
            console.error("Gagal memuat produk:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle input perubahan
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle upload file
    const [uploading, setUploading] = useState(false);
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await api.upload(file);
            const imageUrl = `http://localhost:5000${result.url}`;
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (err) {
            alert("Gagal mengunggah gambar: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
            } else {
                await api.post('/products', payload);
            }

            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchProducts();
        } catch (err) {
            alert("Gagal menyimpan: " + err.message);
        }
    };

    // Hapus produk
    const handleDelete = async (id) => {
        if (window.confirm("Hapus produk ini?")) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                alert("Gagal menghapus");
            }
        }
    };

    // Buka modal edit
    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            image: product.image || '',
            category: product.category || 'Tempe Chips',
            grade: product.grade || 'Export Quality',
            tag: product.tag || '',
            origin: product.origin || 'Malang, Indonesia',
            moq: product.moq || '1000 Units',
            packagingOptions: product.packagingOptions || [{ label: "50 Gram", value: "50g" }],
            isBestseller: !!product.isBestseller,
            isHero: !!product.isHero
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Produk...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-extrabold text-stone-dark">Kelola Produk</h2>
                    <p className="text-sm text-stone-dark/50 mt-1">Daftar produk dan varian mahakarya Pakuaty.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData(initialFormState); }}
                    className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
                >
                    <Plus size={20} /> Tambah Produk
                </button>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
                        <Package className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-dark/30 font-medium italic">Belum ada produk yang terdaftar.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            {/* Image Preview */}
                            <div className="aspect-video bg-stone-50 relative overflow-hidden flex items-center justify-center p-6">
                                <img src={product.image} alt={product.name} className="max-w-[70%] max-h-[70%] object-contain group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.isHero && <span className="bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">HERO</span>}
                                    {product.isBestseller && <span className="bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">BESTSELLER</span>}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="font-bold text-stone-dark text-lg line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-stone-dark/40 font-bold uppercase tracking-wider mt-1">{product.category} • {product.grade}</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-black text-brand-blue">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                                    {product.originalPrice && <span className="text-xs text-stone-dark/30 line-through">Rp {Number(product.originalPrice).toLocaleString('id-ID')}</span>}
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-stone-50">
                                    <button onClick={() => openEditModal(product)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-cream text-brand-gold-dark rounded-lg text-sm font-bold hover:bg-brand-gold/10 transition-colors">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={16} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-dark/30 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-dark">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Nama Produk</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Kategori</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all">
                                            <option value="Tempe Chips">Tempe Chips</option>
                                            <option value="Packaging">Packaging</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Deskripsi</label>
                                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all resize-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Harga (Rp)</label>
                                        <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">URL Gambar</label>
                                        <div className="flex gap-2">
                                            <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none" placeholder="http://..." />
                                            <label className="cursor-pointer w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all flex-shrink-0">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                <Upload size={20} className={uploading ? 'animate-bounce' : ''} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 py-4 border-t border-stone-50">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="isBestseller" checked={formData.isBestseller} onChange={handleInputChange} className="w-5 h-5 rounded border-stone-300 text-brand-gold focus:ring-brand-gold" />
                                        <span className="text-sm font-bold text-stone-dark/70">Best Seller</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="isHero" checked={formData.isHero} onChange={handleInputChange} className="w-5 h-5 rounded border-stone-300 text-brand-blue focus:ring-brand-blue" />
                                        <span className="text-sm font-bold text-stone-dark/70">Tampilkan di Beranda</span>
                                    </label>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all disabled:opacity-50">
                                    {uploading ? 'Mengunggah Gambar...' : 'Simpan Produk'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProducts;
