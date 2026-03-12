import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Megaphone,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Clock,
    Edit2,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react'; // Ikon
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';

/**
 * ManageAnnouncements Component — Pengelolaan pop-up pengumuman website utama.
 * Sekarang mendukung navigasi ke halaman terpisah untuk CRUD.
 */
const ManageAnnouncements = () => {
    const navigate = useNavigate(); // Hook untuk navigasi

    const [announcements, setAnnouncements] = useState([]); // State data pengumuman
    const [loading, setLoading] = useState(true);
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
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/announcements');
            if (!response.ok) throw new Error('Gagal mengambil data pengumuman');
            const data = await response.json();

            // Sanitasi data: Pastikan data adalah array untuk mencegah crash pada .filter() atau .map()
            setAnnouncements(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setAnnouncements([]); // Reset ke array kosong jika terjadi error
            setLoading(false);
        }
    };

    // Fungsi hapus (Sekarang menggunakan modal kustom)
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
            const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Pengumuman "${title}" berhasil dihapus`,
                    type: 'success'
                });
                fetchAnnouncements();
            } else {
                setToast({
                    show: true,
                    message: 'Gagal menghapus pengumuman',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Terjadi kesalahan saat menghapus pengumuman',
                type: 'error'
            });
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Status pengumuman ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
                    type: 'success'
                });
                fetchAnnouncements();
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Gagal merubah status',
                type: 'error'
            });
        }
    };

    const filteredItems = announcements.filter(item => {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Pengumuman</h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Atur pesan pop-up yang muncul saat pengunjung membuka website.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/announcements/add')}
                    className="flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Buat Pesan Baru
                </button>
            </div>

            {/* Filter & Search Bar — Medium Compact */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari pengumuman..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter Status
                </button>
            </div>

            {/* Announcements List — Medium Compact */}
            <div className="space-y-4 pb-12">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Pengumuman...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-20 text-center text-[#64748B] font-bold text-sm">
                        Tidak ada pengumuman ditemukan.
                    </div>
                ) : filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
                    >
                        {/* Status Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            <Megaphone className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest border ${item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            <h3 className="text-sm font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors truncate">{item.title}</h3>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => toggleStatus(item.id, item.is_active)}
                                className={`p-2.5 bg-white border border-slate-200 rounded-xl transition-all shadow-sm ${item.is_active ? 'text-emerald-500 border-emerald-100' : 'text-[#64748B]'}`}
                            >
                                {item.is_active ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                            </button>
                            <button
                                onClick={() => navigate(`/admin/announcements/edit/${item.id}`)}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] transition-all shadow-sm"
                            >
                                <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id, item.title)}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-300 hover:text-red-500 transition-all shadow-sm"
                            >
                                <Trash2 className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        {/* Decoration Icon */}
                        <Megaphone className="w-12 h-12 absolute -right-4 -bottom-4 text-slate-100 opacity-5 rotate-12" />
                    </motion.div>
                ))}
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Hapus Pengumuman"
                message={`Pengumuman "${modalConfig.itemToDelete?.title}" akan dihapus permanen. Lanjutkan?`}
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

export default ManageAnnouncements;
