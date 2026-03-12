import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import { motion } from 'framer-motion'; // Animasi
import {
    Award,
    Plus,
    Search,
    Trash2,
    Calendar,
    ShieldCheck,
    Download,
    Edit2,
    ChevronRight,
    Filter,
    Shield
} from 'lucide-react'; // Ikon
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';

/**
 * ManageCertificates Component — Halaman pengelolaan sertifikat perusahaan.
 * Mendukung navigasi ke halaman terdedikasi untuk pengelolaan dokumen legalitas.
 */
const ManageCertificates = () => {
    const navigate = useNavigate(); // Hook navigasi yang sebelumnya terlewat
    const [certs, setCerts] = useState([]); // State data sertifikat
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isGlobalActive, setIsGlobalActive] = useState(true);

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
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/certificates');
            if (!response.ok) throw new Error('Gagal mengambil data sertifikat');
            const data = await response.json();

            // Sanitasi data: Pastikan data adalah array untuk mencegah crash pada .filter() atau .map()
            setCerts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setCerts([]); // Reset ke array kosong jika terjadi error network/parsing
            setLoading(false);
        }
    };

    // Fungsi hapus sertifikat (Sekarang menggunakan modal kustom)
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
            const response = await fetch(`http://localhost:5000/api/certificates/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Sertifikat "${title}" berhasil dihapus`,
                    type: 'success'
                });
                fetchCertificates();
            } else {
                setToast({
                    show: true,
                    message: 'Gagal menghapus sertifikat',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Terjadi kesalahan saat menghapus sertifikat',
                type: 'error'
            });
        }
    };

    const filteredCerts = certs.filter(cert => {
        return cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cert.issued_by || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Sertifikat</h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Daftar lisensi dan sertifikasi resmi PT Bala Aditi Pakuaty.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsGlobalActive(!isGlobalActive)}
                        className={`hidden lg:flex items-center justify-center gap-3 px-7 py-4 border rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-sm ${isGlobalActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'}`}
                    >
                        {isGlobalActive ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        Status Website: {isGlobalActive ? 'Aktif' : 'Draft'}
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/admin/certificates/add')}
                            className="flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] transition-all group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Tambah Sertifikat
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning if Global Inactive */}
            {!isGlobalActive && (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm border border-amber-50">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 leading-none mb-1">Status: Mode Draft</h4>
                        <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest leading-relaxed">Sertifikat tidak ditampilkan di halaman publik "About Us" saat ini.</p>
                    </div>
                </div>
            )}


            {/* Filter & Search Bar — Medium Compact */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari sertifikat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter Tahun
                </button>
            </div>

            {/* Certificates List — Compact Flat */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Sertifikat...</p>
                    </div>
                ) : filteredCerts.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-[#64748B] font-bold text-sm">
                        Tidak ada sertifikat ditemukan.
                    </div>
                ) : filteredCerts.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white border border-slate-200 rounded-2xl p-5 flex gap-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${!cert.is_active && 'opacity-60 grayscale-[0.3]'}`}
                    >
                        {/* Image Preview */}
                        <div className="w-24 h-32 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-2.5 relative group/thumb cursor-zoom-in shrink-0 shadow-inner">
                            <img src={cert.image} alt={cert.title} className="w-full h-full object-contain group-hover/thumb:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                {/* Menampilkan judul sertifikat */}
                                <h3 className="text-sm font-black text-[#1E293B] tracking-tight group-hover:text-[#2563EB] transition-colors truncate">{cert.title}</h3>
                                {/* Menampilkan indikator 'Pinned' jika sertifikat di-pin */}
                                {cert.is_pinned && (
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                        <Award className="w-3 h-3" /> Pinned
                                    </span>
                                )}
                                {/* Menampilkan penerbit sertifikat */}
                                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{cert.issued_by}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                    <Calendar className="w-3 h-3 text-[#94A3B8]" />
                                    <span className="text-[10px] font-black text-[#1E293B]">{cert.year}</span>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${cert.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    {cert.is_active ? 'Online' : 'Draft'}
                                </div>
                            </div>

                            <div className="flex gap-2.5">
                                <button
                                    onClick={() => navigate(`/admin/certificates/edit/${cert.id}`)}
                                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-[10px] text-[#64748B] uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit Dokumen
                                </button>
                                <button
                                    onClick={() => handleDelete(cert.id, cert.title)}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Status Label on Top Right */}
                        <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[6px] font-black uppercase tracking-widest text-white ${cert.is_active ? 'bg-emerald-500 shadow-md' : 'bg-slate-400'}`}>
                            {cert.is_active ? 'Verified' : 'Draft'}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Hapus Sertifikat"
                message={`Peringatan: Sertifikat "${modalConfig.itemToDelete?.title}" akan dihapus permanen. Lanjutkan?`}
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

export default ManageCertificates;
