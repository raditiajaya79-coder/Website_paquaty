import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Upload, MapPin, Search, Filter, Camera, Clapperboard, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ManageGalleries — Manajemen Media Galeri untuk Admin.
 * Layout 2 kolom: Grid Visual (Main) + Insights & Kategori (Sidebar).
 */
const ManageGalleries = () => {
    const [galleries, setGalleries] = useState([]); // Daftar galeri
    const [loading, setLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [editingItem, setEditingItem] = useState(null); // Item diedit
    const [uploading, setUploading] = useState(false); // Upload state
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian
    const [activeCategory, setActiveCategory] = useState('All'); // Filter kategori

    const initialFormState = { title: '', description: '', image: '', category: 'Production', date: new Date().toISOString().split('T')[0], location: 'Malang' };
    const [formData, setFormData] = useState(initialFormState);

    /** fetchGalleries — Ambil data galeri dari API */
    const fetchGalleries = async () => {
        setLoading(true);
        try { setGalleries(await api.get('/galleries')); } catch (err) { console.error("Gagal memuat:", err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchGalleries(); }, []);

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        setUploading(true);
        try { const r = await api.upload(file); setFormData(prev => ({ ...prev, image: `http://localhost:5000${r.url}` })); }
        catch (err) { alert("Gagal mengunggah: " + err.message); } finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { if (editingItem) { await api.put(`/galleries/${editingItem.id}`, formData); } else { await api.post('/galleries', formData); } setIsModalOpen(false); setFormData(initialFormState); fetchGalleries(); }
        catch (err) { alert("Gagal menyimpan: " + err.message); }
    };

    const handleDelete = async (id) => { if (window.confirm("Hapus media ini?")) { try { await api.delete(`/galleries/${id}`); fetchGalleries(); } catch (err) { alert("Gagal menghapus"); } } };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ title: item.title || '', description: item.description || '', image: item.image || '', category: item.category || 'Production', date: item.date || new Date().toISOString().split('T')[0], location: item.location || 'Malang' });
        setIsModalOpen(true);
    };

    // Filter logika
    const filteredGalleries = galleries.filter(g =>
        (activeCategory === 'All' || g.category === activeCategory) &&
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-24 font-black text-slate-300 text-xs tracking-[0.2em] italic">ACCESSING MEDIA SERVER...</div>;

    return (
        <div className="space-y-4 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-blue/5 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/10 shrink-0"><ImageIcon size={18} /></div>
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-stone-dark tracking-tight leading-none">Aset Visual Galeri</h2>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Documentary & Media Assets</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative group w-full sm:w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Cari media..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold w-full transition-all border-dashed focus:border-brand-blue"
                        />
                    </div>
                    <button onClick={() => { setIsModalOpen(true); setEditingItem(null); setFormData(initialFormState); }} className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-dark transition-all shadow-lg shadow-brand-blue/15 active:scale-[0.98] whitespace-nowrap">
                        <Plus size={14} /> Upload Media
                    </button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Right Sidebar: Categories & Stats (3/12) */}
                <div className="lg:col-span-3 space-y-4 order-last lg:order-none">
                    {/* Category Switcher */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Filter size={15} className="text-brand-blue" /> Segmen Media
                        </h3>
                        <div className="flex flex-col gap-1">
                            {['All', 'Production', 'CSR', 'Event'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${activeCategory === cat ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {cat === 'All' ? 'Tampilkan Semua' : cat}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                        {cat === 'All' ? galleries.length : galleries.filter(g => g.category === cat).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Media Insight */}
                    <div className="bg-stone-dark rounded-2xl p-6 text-white relative overflow-hidden shadow-lg h-40 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10 space-y-3">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Visual Database</p>
                            <p className="text-3xl font-black leading-none">{galleries.length}</p>
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Photos</span>
                                    <span className="text-xs font-bold text-brand-gold">{galleries.length}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Videos</span>
                                    <span className="text-xs font-bold text-white/40">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60 flex gap-3">
                        <Layers size={18} className="text-brand-blue mt-0.5 shrink-0" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">Media yang diunggah harus memiliki lisensi penuh hak cipta perusahaan.</p>
                    </div>
                </div>

                {/* Left Column: Grid (9/12) */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredGalleries.length === 0 ? (
                            <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
                                <p className="text-slate-400 text-sm font-medium">Aset visual tidak ditemukan.</p>
                            </div>
                        ) : (
                            filteredGalleries.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative aspect-square"
                                >
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                    {/* Glass Overlay Controls */}
                                    <div className="absolute inset-0 bg-stone-dark/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3 md:p-4">
                                        <div className="flex justify-between items-start">
                                            <span className="bg-brand-gold text-stone-dark text-[7px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">{item.category}</span>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => openEditModal(item)} className="p-1.5 md:p-2 bg-white/20 hover:bg-white text-white hover:text-brand-blue rounded-lg md:rounded-xl backdrop-blur-md transition-all"><Edit2 size={10} md:size={12} /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 md:p-2 bg-white/20 hover:bg-rose-500 text-white rounded-lg md:rounded-xl backdrop-blur-md transition-all"><Trash2 size={10} md:size={12} /></button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-[10px] md:text-xs leading-tight line-clamp-1">{item.title}</p>
                                            <p className="text-white/60 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-1 md:gap-1.5"><MapPin size={8} md:size={9} /> {item.location}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal — professional small form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-stone-dark/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 transition-all">
                            <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                                <div>
                                    <h3 className="text-base md:text-lg font-black text-stone-dark tracking-tighter uppercase leading-none">{editingItem ? 'Edit Asset' : 'New Asset'}</h3>
                                    <p className="text-[9px] md:text-[10px] font-bold text-brand-blue mt-1 uppercase tracking-widest group italic">Media server module</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-stone-dark transition-all shrink-0"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-4 md:space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Label Media</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2.5 md:px-5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-bold text-stone-dark focus:ring-1 focus:ring-brand-blue/20" placeholder="Judul foto..." />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 md:px-5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase appearance-none cursor-pointer text-brand-blue">
                                            <option value="Production">Production</option>
                                            <option value="CSR">CSR</option>
                                            <option value="Event">Event</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lokasi</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                                            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold" placeholder="E.g. Malang" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Visual Asset URL</label>
                                    <div className="flex gap-2">
                                        <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-2.5 md:px-5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold outline-none text-slate-400 truncate" />
                                        <label className="cursor-pointer w-10 md:w-14 h-10 md:h-14 bg-brand-blue text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-stone-dark transition-all shadow-lg shrink-0">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                            {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" disabled={uploading} className="w-full py-3 md:py-4 bg-brand-blue text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-brand-blue/20 hover:bg-stone-dark transition-all active:scale-[0.98]">
                                    {uploading ? 'UPLOADING...' : 'COMMIT MEDIA'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageGalleries;
