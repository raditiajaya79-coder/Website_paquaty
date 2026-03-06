import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
    Plus,
    Edit2,
    Trash2,
    Award,
    X,
    Save,
    Pin,
    Building2,
    Upload
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Animasi

/**
 * ManageCertificates — Manajemen Sertifikasi & Legalitas untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]); // State daftar sertifikat
    const [loading, setLoading] = useState(true); // State loading
    const [isModalOpen, setIsModalOpen] = useState(false); // State modal form
    const [editingItem, setEditingItem] = useState(null); // Item sedang diedit

    const initialForm = { title: '', image: '', issuedBy: '', isPinned: false };
    const [formData, setFormData] = useState(initialForm);

    // Muat data
    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const data = await api.get('/certificates');
            setCertificates(data);
        } catch (err) {
            console.error("Gagal memuat sertifikat:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/certificates/${editingItem.id}`, formData);
            } else {
                await api.post('/certificates', formData);
            }
            setIsModalOpen(false);
            setFormData(initialForm);
            setEditingItem(null);
            fetchCertificates();
        } catch (err) {
            alert("Gagal menyimpan sertifikat: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus sertifikat ini?")) {
            try {
                await api.delete(`/certificates/${id}`);
                fetchCertificates();
            } catch (err) {
                alert("Gagal menghapus");
            }
        }
    };

    const togglePin = async (item) => {
        try {
            await api.put(`/certificates/${item.id}`, { isPinned: !item.isPinned });
            fetchCertificates();
        } catch (err) {
            alert("Gagal mengubah status pin");
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            image: item.image || '',
            issuedBy: item.issuedBy || '',
            isPinned: !!item.isPinned
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Sertifikat...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-extrabold text-stone-dark">Sertifikasi & Legalitas</h2>
                    <p className="text-sm text-stone-dark/50 mt-1">Kelola bukti otentikasi dan kredibilitas Pakuaty.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingItem(null); setFormData(initialForm); }}
                    className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
                >
                    <Plus size={20} /> Register Sertifikat
                </button>
            </div>

            {/* List View */}
            <div className="space-y-4">
                {certificates.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                        <Award className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-dark/30 font-medium italic">Belum ada dokumen sertifikat.</p>
                    </div>
                ) : (
                    certificates.map((item) => (
                        <div key={item.id} className={`bg-white p-6 rounded-2xl border ${item.isPinned ? 'border-brand-gold bg-brand-gold/5' : 'border-stone-50'} flex items-center gap-6 group hover:shadow-md transition-all`}>
                            {/* Visual Preview */}
                            <div className="w-24 h-24 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-100 flex items-center justify-center">
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-dark text-lg">{item.title}</h3>
                                <div className="flex items-center gap-2 text-stone-dark/50 text-xs mt-1">
                                    <Building2 size={14} /> Penerbit: <span className="text-brand-blue font-bold">{item.issuedBy}</span>
                                </div>
                                <div className="mt-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.isPinned ? 'bg-brand-gold text-white' : 'bg-stone-100 text-stone-dark/40'}`}>
                                        {item.isPinned ? 'Priority Display' : 'Standard'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(item)} className="p-2.5 bg-brand-cream text-brand-gold-dark rounded-lg hover:bg-brand-gold/10 transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => togglePin(item)} className={`p-2.5 rounded-lg transition-colors ${item.isPinned ? 'bg-brand-gold text-white' : 'bg-stone-50 text-stone-dark/40 hover:bg-brand-gold/10'}`}>
                                    <Pin size={18} fill={item.isPinned ? "currentColor" : "none"} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-dark/30 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-dark">{editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Nama Sertifikasi</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="Misal: Sertifikat Halal MUI" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Lembaga Penerbit</label>
                                    <input required name="issuedBy" value={formData.issuedBy} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="Misal: Majelis Ulama Indonesia" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Thumbnail Gambar (URL)</label>
                                    <div className="flex gap-2">
                                        <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none" />
                                        <label className="cursor-pointer w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all flex-shrink-0">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                            <Upload size={20} className={uploading ? 'animate-bounce' : ''} />
                                        </label>
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer py-2">
                                    <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleInputChange} className="w-5 h-5 rounded border-stone-300 text-brand-gold focus:ring-brand-gold" />
                                    <span className="text-sm font-bold text-stone-dark/70">Tampilkan sebagai prioritas</span>
                                </label>

                                <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all">
                                    {uploading ? 'Mengunggah...' : 'Simpan Sertifikat'}
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
