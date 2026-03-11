import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, Award, X, Pin, Building2, Upload, Eye, EyeOff, Power, ShieldCheck, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ManageCertificates — Manajemen Sertifikasi & Legalitas untuk Admin.
 * Layout 2 kolom: List Sertifikat (Main) + Info & Master Control (Sidebar).
 */
const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]); // Daftar sertifikat
    const [loading, setLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [editingItem, setEditingItem] = useState(null); // Item diedit
    const [uploading, setUploading] = useState(false); // Upload state
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian

    // Form state awal
    const initialForm = { title: '', image: '', issuedBy: '', isPinned: false, isActive: true };
    const [formData, setFormData] = useState(initialForm);

    /** fetchCertificates — Muat data sertifikat dari API */
    const fetchCertificates = async () => {
        setLoading(true);
        try { setCertificates(await api.get('/certificates')); } catch (err) { console.error("Gagal memuat:", err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchCertificates(); }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    /** handleFileUpload — Upload gambar sertifikat */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try { const r = await api.upload(file); setFormData(prev => ({ ...prev, image: `http://localhost:5000${r.url}` })); }
        catch (err) { alert("Gagal mengunggah: " + err.message); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) { await api.put(`/certificates/${editingItem.id}`, formData); }
            else { await api.post('/certificates', formData); }
            setIsModalOpen(false); setFormData(initialForm); setEditingItem(null); fetchCertificates();
        } catch (err) { alert("Gagal menyimpan: " + err.message); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus sertifikat ini?")) { try { await api.delete(`/certificates/${id}`); fetchCertificates(); } catch (err) { alert("Gagal menghapus"); } }
    };

    const togglePin = async (item) => {
        try { await api.put(`/certificates/${item.id}`, { isPinned: !item.isPinned }); fetchCertificates(); } catch (err) { alert("Gagal mengubah pin"); }
    };

    const toggleActive = async (item) => {
        try { await api.put(`/certificates/${item.id}`, { isActive: !item.isActive }); fetchCertificates(); } catch (err) { alert("Gagal mengubah status"); }
    };

    const toggleAll = async (activate) => {
        const msg = activate ? 'Aktifkan SEMUA sertifikat?' : 'Matikan SEMUA sertifikat?';
        if (!window.confirm(msg)) return;
        try { await api.put('/certificates/toggle-all', { isActive: activate }); fetchCertificates(); } catch (err) { alert('Gagal mengubah status semua'); }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ title: item.title || '', image: item.image || '', issuedBy: item.issuedBy || '', isPinned: !!item.isPinned, isActive: item.isActive !== false });
        setIsModalOpen(true);
    };

    // Pencarian
    const filteredItems = certificates.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.issuedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="text-center py-24 font-bold text-slate-300 text-xs uppercase tracking-[0.2em] italic">Loading Credentials...</div>;

    return (
        <div className="space-y-4 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-stone-dark tracking-tight">E-Legalitas & Audit</h2>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Compliance & Certification Module</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px] font-medium w-full md:w-36 lg:w-48 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                        />
                    </div>
                    <button onClick={() => { setIsModalOpen(true); setEditingItem(null); setFormData(initialForm); }} className="bg-brand-blue text-white px-3 md:px-5 py-2.5 rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-stone-dark transition-all shadow-md shadow-brand-blue/15 whitespace-nowrap">
                        <Plus size={14} /> Register
                    </button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Main List (8/12) */}
                <div className="lg:col-span-8 space-y-2.5">
                    {filteredItems.length === 0 ? (
                        <div className="py-24 text-center bg-white rounded-xl border border-dashed border-slate-200">
                            <Award className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-slate-400 text-sm font-medium">Dokumen tidak ditemukan.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`bg-white p-4 rounded-xl border flex items-center gap-4 group hover:shadow-md transition-all ${!item.isActive ? 'border-red-200 bg-red-50/20' : item.isPinned ? 'border-brand-gold bg-brand-gold/[0.02]' : 'border-slate-200/60'}`}
                            >
                                <div className={`w-14 h-14 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center p-2 ${!item.isActive ? 'grayscale opacity-50' : ''}`}>
                                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-stone-dark text-xs md:text-sm truncate">{item.title}</h3>
                                        {item.isPinned && <Pin size={10} className="text-brand-gold" fill="currentColor" />}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider"><Building2 size={10} className="text-brand-blue" /> {item.issuedBy}</div>
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                    <div className="flex flex-col items-start sm:items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {item.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(item)} className="p-2 bg-slate-50 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-all" title="Edit"><Edit2 size={14} /></button>
                                        <button onClick={() => toggleActive(item)} className={`p-2 rounded-lg transition-all ${item.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`} title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}>{item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all" title="Hapus"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar (4/12) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Master Control Card */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Power size={13} className="text-brand-blue" /> Master Control
                        </h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => toggleAll(true)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                                Aktifkan Koleksi
                                <CheckCircle size={14} />
                            </button>
                            <button
                                onClick={() => toggleAll(false)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                                Istirahatkan Koleksi
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Policy Insight Card */}
                    <div className="bg-stone-dark rounded-xl p-5 text-white relative overflow-hidden shadow-lg h-32 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10">
                            <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Total Assets</p>
                            <p className="text-3xl font-black">{certificates.length}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-full bg-white/10 h-1 rounded-full">
                                    <div className="bg-emerald-400 h-full w-[85%]" />
                                </div>
                                <span className="text-[8px] font-bold text-white/40">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Card */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
                        <div className="flex gap-3">
                            <ShieldCheck size={18} className="text-brand-blue shrink-0" />
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-stone-dark">Standard Operating Procedure</p>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                    Pastikan dokumen yang diunggah memiliki masa berlaku yang masih aktif. Penempatan <span className="text-brand-blue font-bold">Priority</span> akan menggeser dokumen lain di baris pertama website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal — with cleaner wider look */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 transition-all">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-dark tracking-tight">{editingItem ? 'Edit Credential' : 'New Credential'}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Document management</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Label Sertifikat</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-stone-dark" placeholder="Misal: Sertifikat Halal MUI" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lembaga Akreditasi</label>
                                    <input required name="issuedBy" value={formData.issuedBy} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-brand-blue" placeholder="Penerbit dokumen..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Reference (URL/File)</label>
                                    <div className="flex gap-2">
                                        <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none text-slate-400" />
                                        <label className="cursor-pointer px-4 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-stone-dark transition-all shadow-md">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                            <Upload size={18} className={uploading ? 'animate-bounce' : ''} />
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer group">
                                        <div className="relative w-5 h-5">
                                            <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleInputChange} className="peer hidden" />
                                            <div className="w-full h-full border-2 border-slate-300 rounded group-hover:border-brand-gold peer-checked:bg-brand-gold peer-checked:border-brand-gold flex items-center justify-center">
                                                <Pin size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Pin to Front</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer group">
                                        <div className="relative w-5 h-5">
                                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="peer hidden" />
                                            <div className="w-full h-full border-2 border-slate-300 rounded group-hover:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Publish Live</span>
                                    </label>
                                </div>
                                <button type="submit" disabled={uploading} className="w-full py-4 bg-stone-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-brand-blue transition-all disabled:opacity-50">
                                    {uploading ? 'CALCULATING DATA...' : 'AUTHORIZE STORAGE'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageCertificates;
