import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
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

    const filteredContents = contents.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'Semua' ||
            (activeTab === 'Artikel' && item.type === 'Article') ||
            (activeTab === 'Event' && item.type === 'Event') ||
            (activeTab === 'Pinned' && item.is_pinned);
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-5 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Agenda</h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Atur artikel, berita, dan jadwal event PT Bala Aditi Pakuaty.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/events/add')}
                    className="flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Buat Konten
                </button>
            </div>

            {/* Filter & Search Bar — Medium Compact */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari agenda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter Konten
                </button>
            </div>

            {/* Quick Filter — Micro */}
            <div className="flex flex-wrap gap-4 pb-2 border-b border-slate-50">
                {['Semua', 'Artikel', 'Event', 'Pinned'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveTab(filter)}
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === filter ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#2563EB]'}`}
                    >
                        {filter}
                        {activeTab === filter && (
                            <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content List — Flat Item Layout */}
            <div className="divide-y divide-slate-100 pb-12">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Agenda...</p>
                    </div>
                ) : filteredContents.length === 0 ? (
                    <div className="py-20 text-center text-[#64748B] font-bold text-sm">
                        Tidak ada agenda atau artikel ditemukan.
                    </div>
                ) : filteredContents.map((item) => (
                    <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group py-6 flex items-center gap-5 transition-all hover:bg-slate-50/50 rounded-2xl px-4 ${item.is_pinned ? 'bg-blue-50/30' : 'bg-transparent'}`}
                    >
                        {/* Type Icon */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${item.type === 'Article' ? 'bg-white border-indigo-100 text-indigo-500' : 'bg-white border-emerald-100 text-emerald-500'}`}>
                            {item.type === 'Article' ? <FileText className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest border ${item.type === 'Article' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                    {item.type === 'Article' ? 'Artikel' : 'Event'}
                                </span>
                                {item.is_pinned && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase tracking-widest">
                                        <Pin className="w-3 h-3 fill-white" /> Pinned
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1">{item.title}</h3>
                            <div className="flex items-center gap-5 text-[#94A3B8]">
                                <div className="flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => navigate(`/admin/events/edit/${item.id}?type=${item.type}`)}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:border-blue-300 transition-all shadow-sm"
                            >
                                <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id, item.type, item.title)}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-300 hover:text-red-500 transition-all shadow-sm"
                            >
                                <Trash2 className="w-4.5 h-4.5" />
                            </button>
                            <div className="p-2 text-slate-200">
                                <ChevronRight className="w-5 h-5" />
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
                message={`${modalConfig.itemToDelete?.type === 'Article' ? 'Artikel' : 'Event'} "${modalConfig.itemToDelete?.title}" akan dihapus permanen. Lanjutkan?`}
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
