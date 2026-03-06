import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
    Plus,
    Edit2,
    Trash2,
    Image as ImageIcon,
    X,
    Save,
    Upload,
    Calendar,
    MapPin
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Animasi

/**
 * ManageGalleries — Manajemen Media Galeri untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageGalleries = () => {
    const [galleries, setGalleries] = useState([]); // State daftar galeri
    const [loading, setLoading] = useState(true); // State loading
    const [isModalOpen, setIsModalOpen] = useState(false); // State modal
    const [editingItem, setEditingItem] = useState(null); // Item sedang diedit

    // Initial Form State
    const initialFormState = {
        title: '',
        description: '',
        image: '',
        category: 'Production',
        date: new Date().toISOString().split('T')[0],
        location: 'Malang'
    };

    const [formData, setFormData] = useState(initialFormState);

    // Ambil data galeri
    const fetchGalleries = async () => {
        setLoading(true);
        try {
            const data = await api.get('/galleries');
            setGalleries(data);
        } catch (err) {
            console.error("Gagal memuat galeri:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleries();
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
            if (editingItem) {
                await api.put(`/galleries/${editingItem.id}`, formData);
            } else {
                await api.post('/galleries', formData);
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchGalleries();
        } catch (err) {
            alert("Gagal menyimpan: " + err.message);
        }
    };

    // Hapus item
    const handleDelete = async (id) => {
        if (window.confirm("Hapus aset media ini?")) {
            try {
                await api.delete(`/galleries/${id}`);
                fetchGalleries();
            } catch (err) {
                alert("Gagal menghapus");
            }
        }
    };

    // Buka edit modal
    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
            category: item.category || 'Production',
            date: item.date || new Date().toISOString().split('T')[0],
            location: item.location || 'Malang'
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Galeri...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-extrabold text-stone-dark">Media Galeri</h2>
                    <p className="text-sm text-stone-dark/50 mt-1">Dokumentasi visual aktivitas PT Bala Aditi Pakuaty.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingItem(null); setFormData(initialFormState); }}
                    className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
                >
                    <Plus size={20} /> Tambah Media
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleries.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
                        <ImageIcon className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-dark/30 font-medium italic">Belum ada media galeri.</p>
                    </div>
                ) : (
                    galleries.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all group relative aspect-square">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-stone-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={10} /> {item.location}
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(item)} className="p-2 bg-white text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={16} />
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
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-dark">{editingItem ? 'Edit Media' : 'Tambah Media'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Nama Aktivitas / Judul</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Kategori</label>
                                        <input name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Lokasi</label>
                                        <input name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Thumbnail Media (URL)</label>
                                    <div className="flex gap-2">
                                        <input required name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none" />
                                        <label className="cursor-pointer w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all flex-shrink-0">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                            <Upload size={20} className={uploading ? 'animate-bounce' : ''} />
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all disabled:opacity-50">
                                    {uploading ? 'Mengunggah...' : 'Simpan Media'}
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
