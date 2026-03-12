import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    Calendar,
    Tag,
    Edit2,
    Filter,
    Maximize2
} from 'lucide-react'; // Ikon
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';

/**
 * ManageGallery Component — Halaman pengelolaan galeri foto.
 * Sekarang mendukung navigasi ke halaman terpisah untuk CRUD dokumentasi.
 */
const ManageGallery = () => {
    const navigate = useNavigate(); // Hook untuk navigasi

    const [images, setImages] = useState([]); // State data foto galeri
    const [loading, setLoading] = useState(true);
    const [activeCat, setActiveCat] = useState('Semua');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal & Toast States
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        itemToDelete: null
    });
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/gallery');
            if (!response.ok) throw new Error('Gagal mengambil data galeri');
            const data = await response.json();

            // Sanitasi data: Pastikan data adalah array untuk mencegah crash pada .filter() atau .map()
            setImages(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setImages([]); // Reset ke array kosong jika terjadi error
            setLoading(false);
        }
    };

    // Fungsi hapus foto (Sekarang menggunakan modal kustom)
    const handleDelete = (id, title) => {
        setModalConfig({
            isOpen: true,
            itemToDelete: { id, title }
        });
    };

    const confirmDelete = async () => {
        const { id, title } = modalConfig.itemToDelete;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Foto "${title}" berhasil dihapus`,
                    type: 'success'
                });
                fetchGallery();
            } else {
                setToast({
                    show: true,
                    message: 'Gagal menghapus foto',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Terjadi kesalahan saat menghapus foto',
                type: 'error'
            });
        }
    };

    const filteredImages = images.filter(img => {
        const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCat === 'Semua' || img.category === activeCat;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Galeri</h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Upload dan kelola dokumentasi foto kegiatan perusahaan.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/gallery/add')}
                    className="flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Upload Foto
                </button>
            </div>

            {/* Filter & Search — Medium Compact */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari foto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex bg-white border border-slate-200 rounded-xl p-1 shrink-0 shadow-sm border-dashed">
                        {['Semua', 'Produksi', 'Kegiatan', 'Event'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCat === cat ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/10' : 'text-[#64748B] hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery Grid — Medium Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Galeri...</p>
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-[#64748B] font-bold text-sm">
                        Tidak ada foto ditemukan di galeri.
                    </div>
                ) : filteredImages.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                        {/* Image Container */}
                        <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                            <img src={img.image} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-[#0f172a]/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-4">
                                <div className="flex flex-col gap-2 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <button
                                        onClick={() => navigate(`/admin/gallery/edit/${img.id}`)}
                                        className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit Foto
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id, img.title)}
                                        className="w-full py-2.5 bg-red-500/20 text-red-100 border border-red-500/30 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/40 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Info Content */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest border bg-slate-50 border-slate-100 text-slate-500`}>
                                    {img.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-[#94A3B8]">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold tracking-tighter uppercase">
                                        {new Date(img.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1 leading-tight">{img.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Hapus Foto"
                message={`Foto "${modalConfig.itemToDelete?.title}" akan dihapus permanen dari galeri. Lanjutkan?`}
            />

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

// Internal sub-component for Clock icon match
const Clock = ({ className }) => <Calendar className={className} />;

export default ManageGallery;
