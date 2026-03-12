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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header — Responsive Alignment */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Galeri</h1>
                    <p className="text-[10px] sm:text-xs text-[#64748B] mt-1 font-bold uppercase tracking-wider opacity-70">Upload dan kelola dokumentasi foto kegiatan perusahaan.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/gallery/add')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1e40af] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all group w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Upload Foto</span>
                </button>
            </div>

            {/* Filter & Search — Stacked on Mobile */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul foto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Category Pills - Responsive Scroll */}
                <div className="px-2 pb-2 lg:p-0 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
                        <div className="flex bg-slate-50 border border-slate-200/60 rounded-xl p-1.5 shrink-0 shadow-inner">
                            {['Semua', 'Produksi', 'Kegiatan', 'Event'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCat(cat)}
                                    className={`px-5 py-2.5 rounded-[0.6rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCat === cat ? 'bg-white text-[#2563EB] shadow-sm border border-slate-200/50' : 'text-[#64748B] hover:bg-slate-100/50 hover:text-[#1E293B]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid — Responsive Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-12">
                {loading ? (
                    <div className="col-span-full py-24 text-center">
                        <div className="inline-block w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mb-5"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Data...</p>
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <ImageIcon className="w-12 h-12 text-slate-300" />
                            <p className="font-bold text-sm text-slate-500 tracking-tight">Tidak ada foto ditemukan di galeri.</p>
                        </div>
                    </div>
                ) : filteredImages.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white border border-slate-200 rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-blue-900/5 transition-all duration-300 flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="aspect-[4/5] bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner">
                            <img
                                src={img.image}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => e.target.src = '/images/placeholder.png'}
                            />

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-slate-900/70 xl:opacity-0 xl:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-3 sm:p-6 backdrop-blur-[2px] opacity-100 sm:opacity-0 group-hover:opacity-100">
                                <div className="flex flex-col gap-2 sm:gap-3 w-full translate-y-0 xl:translate-y-4 xl:group-hover:translate-y-0 transition-transform duration-300">
                                    <button
                                        onClick={() => navigate(`/admin/gallery/edit/${img.id}`)}
                                        className="w-full py-2 sm:py-3 bg-white/90 sm:bg-white text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB] rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-lg transition-colors active:scale-95"
                                    >
                                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit Foto
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id, img.title)}
                                        className="w-full py-2 sm:py-3 bg-red-500/80 sm:bg-red-500/90 text-white border border-red-400 rounded-lg sm:rounded-xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-red-600 shadow-lg transition-colors active:scale-95"
                                    >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Info Content */}
                        <div className="p-3 sm:p-6 space-y-2 sm:space-y-3 flex flex-col flex-1 justify-between">
                            <h3 className="text-xs sm:text-base font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">{img.title}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-auto">
                                <span className={`px-2 py-1 sm:px-2.5 sm:py-1 text-[7px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest border bg-slate-50 border-slate-200/60 text-slate-500 w-fit`}>
                                    {img.category || 'Galeri'}
                                </span>
                                <div className="flex items-center gap-1 sm:gap-1.5 text-[#94A3B8]">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[7px] sm:text-[10px] font-bold tracking-widest uppercase">
                                        {new Date(img.created_at || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message={`Peringatan: Foto "${modalConfig.itemToDelete?.title}" akan dihapus permanen dari galeri. Tindakan ini tidak dapat dibatalkan.`}
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
