import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
    Plus,
    Edit2,
    Trash2,
    FileText,
    X,
    Save,
    Calendar,
    User,
    Upload
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Animasi

/**
 * ManageArticles — Manajemen Artikel & Berita untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageArticles = () => {
    const [articles, setArticles] = useState([]); // State daftar artikel
    const [loading, setLoading] = useState(true); // State loading
    const [isModalOpen, setIsModalOpen] = useState(false); // State modal
    const [editingArticle, setEditingArticle] = useState(null); // Artikel sedang diedit

    // Initial Form State
    const initialFormState = {
        title: '',
        content: '',
        excerpt: '',
        image: '',
        author: 'Admin Pakuaty',
        category: 'Insights',
        date: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialFormState);

    // Ambil data artikel
    const fetchArticles = async () => {
        setLoading(true);
        try {
            const data = await api.get('/articles');
            setArticles(data);
        } catch (err) {
            console.error("Gagal memuat artikel:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // Handle input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            if (editingArticle) {
                await api.put(`/articles/${editingArticle.id}`, formData);
            } else {
                await api.post('/articles', formData);
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchArticles();
        } catch (err) {
            alert("Gagal menyimpan artikel: " + err.message);
        }
    };

    // Hapus artikel
    const handleDelete = async (id) => {
        if (window.confirm("Hapus artikel ini?")) {
            try {
                await api.delete(`/articles/${id}`);
                fetchArticles();
            } catch (err) {
                alert("Gagal menghapus");
            }
        }
    };

    // Buka edit modal
    const openEditModal = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title || '',
            content: article.content || '',
            excerpt: article.excerpt || '',
            image: article.image || '',
            author: article.author || 'Admin Pakuaty',
            category: article.category || 'Insights',
            date: article.date || new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Artikel...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-extrabold text-stone-dark">Kelola Artikel</h2>
                    <p className="text-sm text-stone-dark/50 mt-1">Arsip berita dan cerita edukasi Pakuaty.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingArticle(null); setFormData(initialFormState); }}
                    className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
                >
                    <Plus size={20} /> Tulis Artikel
                </button>
            </div>

            {/* Article List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
                        <FileText className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-dark/30 font-medium italic">Belum ada artikel yang diterbitkan.</p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row group">
                            {/* Image Preview */}
                            <div className="md:w-48 h-48 bg-stone-50 shrink-0 overflow-hidden">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Content Info */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-stone-dark/40 uppercase mb-2">
                                        <Calendar size={12} /> {article.date} <span className="mx-1">•</span> <User size={12} /> {article.author}
                                    </div>
                                    <h3 className="font-bold text-stone-dark text-lg line-clamp-2 leading-tight">{article.title}</h3>
                                    <p className="text-xs text-stone-dark/50 mt-2 line-clamp-2 italic">"{article.excerpt}"</p>
                                </div>
                                <div className="flex gap-2 pt-4 mt-4 border-t border-stone-50">
                                    <button onClick={() => openEditModal(article)} className="p-2.5 bg-brand-cream text-brand-gold-dark rounded-lg hover:bg-brand-gold/10 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(article.id)} className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={18} />
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
                            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-dark">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Judul Artikel</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all font-bold" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Kategori</label>
                                        <input name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="Misal: Edukasi / Berita" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Gambar Sampul (URL)</label>
                                        <div className="flex gap-2">
                                            <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none" placeholder="http://..." />
                                            <label className="cursor-pointer w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all flex-shrink-0">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                <Upload size={20} className={uploading ? 'animate-bounce' : ''} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Ringkasan Singkat</label>
                                    <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none transition-all resize-none italic text-sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Isi Artikel</label>
                                    <textarea required name="content" value={formData.content} onChange={handleInputChange} rows="6" className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none transition-all resize-none leading-relaxed" />
                                </div>

                                <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all disabled:opacity-50">
                                    {uploading ? 'Mengunggah Gambar...' : (editingArticle ? 'Simpan Artikel' : 'Terbitkan Artikel')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageArticles;
