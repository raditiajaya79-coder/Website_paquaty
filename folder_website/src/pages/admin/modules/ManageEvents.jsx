import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import { motion, AnimatePresence } from 'framer-motion'; // Animasi
import {
    Calendar,
    FileText,
    Plus,
    Search,
    Edit2,
    Trash2,
    Pin,
    ChevronRight,
    Tag,
    Filter
} from 'lucide-react'; // Ikon
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';

/**
 * ManageEvents Component — Halaman pengelolaan Event & Artikel.
 * Sekarang mendukung navigasi ke halaman terpisah untuk CRUD.
 */
const ManageEvents = () => {
    const navigate = useNavigate(); // Hook navigasi yang sebelumnya terlewat
    const [contents, setContents] = useState([]); // State gabungan artikel & event
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Semua');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

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
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            // Ambil data dari kedua endpoint secara paralel
            const [artRes, eveRes] = await Promise.all([
                fetch('http://localhost:5000/api/articles'),
                fetch('http://localhost:5000/api/events')
            ]);

            // Konversi respon ke JSON
            const articlesData = await artRes.json();
            const eventsData = await eveRes.json();

            // Pastikan data yang diterima adalah array untuk menghindari crash .map()
            const articles = Array.isArray(articlesData) ? articlesData : [];
            const events = Array.isArray(eventsData) ? eventsData : [];

            // Gabungkan data dan tambahkan tag tipe untuk identifikasi di list
            const combined = [
                ...articles.map(a => ({ ...a, type: 'Article' })),
                ...events.map(e => ({ ...e, type: 'Event' }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            setContents(combined);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setContents([]); // Reset ke array kosong jika gagal total
            setLoading(false);
        }
    };

    // Fungsi hapus agenda (Sekarang menggunakan modal kustom)
    const handleDelete = (id, type, title) => {
        setModalConfig({
            isOpen: true,
            itemToDelete: { id, type, title }
        });
    };

    const confirmDelete = async () => {
        const { id, type, title } = modalConfig.itemToDelete;
        try {
            const endpoint = type === 'Article' ? 'articles' : 'events';
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `${type === 'Article' ? 'Artikel' : 'Event'} "${title}" berhasil dihapus`,
                    type: 'success'
                });
                fetchAllData();
            } else {
                setToast({
                    show: true,
                    message: 'Gagal menghapus konten',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Terjadi kesalahan saat menghapus konten',
                type: 'error'
            });
        }
    };

    // Fungsi Toggle Pin Langsung dari List
    const handleTogglePin = async (item) => {
        // Optimistic UI Update: Langsung rubah di UI agar terasa instan
        const previousContents = [...contents];
        const newPinnedStatus = item.is_pinned ? 0 : 1;

        setContents(contents.map(c =>
            c.id === item.id && c.type === item.type
                ? { ...c, is_pinned: newPinnedStatus === 1 }
                : c
        ));

        try {
            const endpoint = item.type === 'Article' ? 'articles' : 'events';
            const token = localStorage.getItem('admin_token');
            const payload = { ...item, is_pinned: newPinnedStatus === 1 };

            const response = await fetch(`http://localhost:5000/api/${endpoint}/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Gagal menyimpan status pin ke server');

            setToast({
                show: true,
                message: `Status Sematan "${item.title}" diperbarui`,
                type: 'success'
            });
        } catch (err) {
            // Revert state jika server gagal atau error jaringan
            setContents(previousContents);
            setToast({
                show: true,
                message: 'Gagal mengubah status sematan (Koneksi bermasalah)',
                type: 'error'
            });
        }
    };

    const categories = ['Semua Kategori', ...new Set(contents.map(item => item.category).filter(Boolean))];

    const filteredContents = contents.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'Semua' ||
            (activeTab === 'Artikel' && item.type === 'Article') ||
            (activeTab === 'Event' && item.type === 'Event') ||
            (activeTab === 'Pinned' && item.is_pinned);
        const matchesCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
        return matchesSearch && matchesTab && matchesCategory;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header — Responsive Alignment */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Agenda</h1>
                    <p className="text-[10px] sm:text-xs text-[#64748B] mt-1 font-bold uppercase tracking-wider opacity-70">Atur artikel, berita, dan jadwal event PT Bala Aditi Pakuaty.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/events/add')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1e40af] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all group w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Buat Konten</span>
                </button>
            </div>

            {/* Filter & Search Bar — Stacked on Mobile */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul agenda atau artikel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="px-2 pb-2 lg:p-0">
                    <div className="relative w-full lg:w-auto">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className={`w-full lg:w-auto flex items-center justify-between lg:justify-center gap-2 px-8 py-3.5 bg-white border ${showFilterDropdown || selectedCategory !== 'Semua Kategori' ? 'border-blue-300 text-blue-600 bg-blue-50/50' : 'border-slate-200 text-[#64748B]'} rounded-xl text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest min-w-[200px]`}
                        >
                            <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> {selectedCategory === 'Semua Kategori' ? 'Filter Konten' : selectedCategory}</span>
                            <ChevronRight className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-90' : ''} lg:hidden`} />
                        </button>

                        {/* Filter Dropdown */}
                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 left-0 lg:left-auto mt-2 w-full lg:w-full min-w-[200px] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden"
                                >
                                    <div className="py-2 px-1 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                        {categories.map((cat, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setShowFilterDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                    ${selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Quick Filter — Micro Responsive */}
            <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-3 border-b border-slate-200/60 custom-scrollbar snap-x">
                {['Semua', 'Artikel', 'Event', 'Pinned'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveTab(filter)}
                        className={`px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap snap-start ${activeTab === filter ? 'text-[#2563EB] bg-blue-50/50' : 'text-[#64748B] hover:text-[#2563EB] hover:bg-slate-50'}`}
                    >
                        {filter}
                        {activeTab === filter && (
                            <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content List — Responsive Layout */}
            <div className="divide-y divide-slate-100/60 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-24 text-center">
                        <div className="inline-block w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mb-5"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Data...</p>
                    </div>
                ) : filteredContents.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <Calendar className="w-12 h-12 text-slate-300" />
                            <p className="font-bold text-sm text-slate-500 tracking-tight">Tidak ada agenda atau artikel ditemukan.</p>
                        </div>
                    </div>
                ) : filteredContents.map((item) => (
                    <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group py-3 px-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center gap-4 sm:gap-5 transition-all hover:bg-slate-50/80 ${item.is_pinned ? 'bg-blue-50/30' : 'bg-transparent'}`}
                    >
                        <div className="flex items-start md:items-center gap-4 flex-1">
                            {/* Type Icon */}
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.type === 'Article' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                                {item.type === 'Article' ? <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> : <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className={`px-2.5 py-1 text-[8px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest border ${item.type === 'Article' ? 'bg-indigo-100/50 text-indigo-700 border-indigo-200' : 'bg-emerald-100/50 text-emerald-700 border-emerald-200'}`}>
                                        {item.type === 'Article' ? 'Artikel' : 'Event'}
                                    </span>
                                    {item.is_pinned && (
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-white text-[8px] sm:text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm shadow-amber-900/10">
                                            <Pin className="w-3 h-3 fill-white" /> Pinned
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-sm sm:text-base font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-2 md:line-clamp-1 mb-2.5">{item.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[#94A3B8]">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                                            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 transition-opacity justify-end border-t border-slate-100 md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 px-2 md:px-0">
                            <button
                                onClick={() => handleTogglePin(item)}
                                className={`p-2 bg-white border rounded-xl transition-all shadow-sm active:scale-90 ${item.is_pinned ? 'border-amber-400 text-amber-500 hover:bg-amber-50' : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50'}`}
                                title={item.is_pinned ? "Lepaskan Sematan dari Banner" : "Sematkan Menjadi Banner Utama"}
                            >
                                <Pin className={`w-3.5 h-3.5 ${item.is_pinned ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={() => navigate(`/admin/events/edit/${item.id}?type=${item.type}`)}
                                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-90"
                                title="Edit Konten"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id, item.type, item.title)}
                                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-90"
                                title="Hapus Konten"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="p-1.5 text-slate-200 hidden md:block group-hover:text-slate-300 transition-colors">
                                <ChevronRight className="w-4 h-4" />
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
                title={`Hapus ${modalConfig.itemToDelete?.type === 'Article' ? 'Artikel' : 'Event'}`}
                message={`Peringatan: ${modalConfig.itemToDelete?.type === 'Article' ? 'Artikel' : 'Event'} "${modalConfig.itemToDelete?.title}" akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
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

export default ManageEvents;
