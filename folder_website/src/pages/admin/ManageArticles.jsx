import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, FileText, X, Calendar, User, Upload, Search, Filter, TrendingUp, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ManageArticles — Manajemen Artikel & Berita untuk Admin.
 * Layout 2 kolom: Daftar Artikel (Main) + Statistik/Info (Sidebar).
 * Desain compact & profesional memanfaatkan lebar layar.
 */
const ManageArticles = () => {
    const [articles, setArticles] = useState([]); // Daftar artikel
    const [loading, setLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [editingArticle, setEditingArticle] = useState(null); // Artikel diedit
    const [uploading, setUploading] = useState(false); // Upload state
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian

    // Form state awal
    const initialFormState = { title: '', content: '', excerpt: '', image: '', author: 'Admin Pakuaty', category: 'Insights', date: new Date().toISOString().split('T')[0] };
    const [formData, setFormData] = useState(initialFormState);

    /** fetchArticles — Ambil data artikel dari API */
    const fetchArticles = async () => {
        setLoading(true);
        try { setArticles(await api.get('/articles')); } catch (err) { console.error("Gagal memuat artikel:", err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchArticles(); }, []); // Fetch saat mount

    /** handleInputChange — Handler perubahan input form */
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

    /** handleFileUpload — Upload gambar sampul ke backend */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try { const result = await api.upload(file); setFormData(prev => ({ ...prev, image: `http://localhost:5000${result.url}` })); }
        catch (err) { alert("Gagal mengunggah: " + err.message); }
        finally { setUploading(false); }
    };

    /** handleSubmit — Submit form (POST/PUT) */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArticle) { await api.put(`/articles/${editingArticle.id}`, formData); }
            else { await api.post('/articles', formData); }
            setIsModalOpen(false); setFormData(initialFormState); fetchArticles();
        } catch (err) { alert("Gagal menyimpan: " + err.message); }
    };

    /** handleDelete — Hapus artikel dengan konfirmasi */
    const handleDelete = async (id) => {
        if (window.confirm("Hapus artikel ini?")) { try { await api.delete(`/articles/${id}`); fetchArticles(); } catch (err) { alert("Gagal menghapus"); } }
    };

    /** openEditModal — Buka modal edit dengan data prefill */
    const openEditModal = (article) => {
        setEditingArticle(article);
        setFormData({ title: article.title || '', content: article.content || '', excerpt: article.excerpt || '', image: article.image || '', author: article.author || 'Admin Pakuaty', category: article.category || 'Insights', date: article.date || new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    // Filter artikel berdasarkan pencarian
    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="text-center py-16 font-semibold text-slate-400 text-sm italic">Menyinkronkan data artikel...</div>;

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center border border-brand-blue/10">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-stone-dark tracking-tight leading-none">Pusat Literasi Pakuaty</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Kelola Konten & Berita</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold w-full md:w-64 focus:ring-1 focus:ring-brand-blue/30 transition-all border-dashed"
                        />
                    </div>
                    <button onClick={() => { setIsModalOpen(true); setEditingArticle(null); setFormData(initialFormState); }} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-dark shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98] whitespace-nowrap">
                        <Plus size={16} /> Tulis Artikel
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Article List (8/12) */}
                <div className="lg:col-span-8 space-y-4">
                    {filteredArticles.length === 0 ? (
                        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <FileText className="mx-auto text-slate-100 mb-6" size={48} />
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Belum ada artikel yang diterbitkan.</p>
                        </div>
                    ) : (
                        filteredArticles.map((article) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row group min-h-[160px]"
                            >
                                {/* Thumbnail */}
                                <div className="w-full md:w-56 bg-slate-50 shrink-0 overflow-hidden relative aspect-video md:aspect-auto">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-3 left-3 bg-brand-blue/90 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                                        {article.category}
                                    </div>
                                </div>
                                {/* Content info */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-blue" /> {article.date}</span>
                                            <span className="flex items-center gap-1.5"><User size={12} className="text-brand-blue" /> {article.author}</span>
                                        </div>
                                        <h3 className="font-bold text-stone-dark text-base md:text-lg line-clamp-2 md:line-clamp-1 group-hover:text-brand-blue transition-colors leading-tight mb-2 uppercase tracking-tight">{article.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium italic">"{article.excerpt}"</p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all translate-x-0 md:translate-x-4 group-hover:translate-x-0">
                                        <button onClick={() => openEditModal(article)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-all border border-slate-100"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(article.id)} className="p-2.5 bg-rose-50 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-rose-100 shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Right Column: Statistics & Quick Info (4/12) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} className="text-brand-blue" /> Statistik Konten
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-stone-dark">{articles.length}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Artikel</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-brand-blue">{articles.filter(a => a.category === 'Insights').length}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Insights</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-medium text-slate-500">Draft Status</span>
                                <span className="text-[11px] font-bold text-emerald-500">All Published</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-brand-blue h-full w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><Filter size={14} className="text-brand-gold" /> Filter Cepat</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Tutup', 'Edukasi', 'Pakuaty News', 'Sirkulasi'].map(tag => (
                                    <button key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-colors uppercase tracking-wider">{tag}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed Mockup */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-brand-blue" /> Aktivitas</h3>
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-bold text-stone-dark">Update "{articles[0]?.title || 'Artikel'}"</p>
                                        <p className="text-[10px] text-slate-400">2 jam yang lalu oleh Admin</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form — with standard compact style */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
                        >
                            {/* Header Modal — Presisi & Informatif */}
                            <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-dark leading-none">{editingArticle ? 'Edit Narasi Konten' : 'Registrasi Konten Baru'}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Content & Media Strategy System</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all hover:bg-rose-50"><X size={18} /></button>
                            </div>

                            {/* Form Input — Tata Letak Padat & Rapi */}
                            <form onSubmit={handleSubmit} className="p-7 overflow-y-auto space-y-6 no-scrollbar">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Judul Utama Artikel</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="Ketik judul artikel yang menarik..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue/30 focus:border-brand-blue outline-none text-base font-bold text-stone-dark shadow-sm transition-all" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Kategori & Topik</label>
                                        <div className="relative">
                                            <input name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold text-brand-blue shadow-sm focus:border-brand-blue transition-all" placeholder="Misal: Edukasi, News..." />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <Tag size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Lampiran Media (URL Sampul)</label>
                                        <div className="flex gap-2">
                                            <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none text-slate-400 truncate shadow-sm focus:border-brand-blue transition-all" placeholder="http://..." />
                                            <label className="cursor-pointer w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-blue transition-all shadow-lg active:scale-95 group shrink-0">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Ringkasan Eksekutif (Excerpt)</label>
                                    <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" placeholder="Tulis ringkasan singkat untuk pratinjau..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none resize-none italic text-xs leading-relaxed text-slate-500 shadow-sm focus:border-brand-blue transition-all" />
                                </div>

                                <div className="space-y-1.5 flex-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Isi Narasi Lengkap</label>
                                    <textarea required name="content" value={formData.content} onChange={handleInputChange} rows="8" placeholder="Tuangkan detail konten secara mendalam..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none resize-none leading-relaxed text-sm text-stone-dark shadow-sm focus:border-brand-blue transition-all" />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:bg-stone-dark hover:shadow-stone-dark/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                                        {uploading ? 'Sinkronisasi Media...' : (editingArticle ? <><Edit2 size={16} /> Update Konten & Publish</> : <><Plus size={18} /> Terbitkan Artikel Baru</>)}
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

export default ManageArticles;
