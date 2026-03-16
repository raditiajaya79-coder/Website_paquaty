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
    Shield,
    Eye,
    EyeOff,
    Loader2
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
    const [togglingId, setTogglingId] = useState(null); // Menyimpan ID sertifikat yang sedang di-toggle visibilitasnya

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
            const sanitizedData = Array.isArray(data) ? data : [];
            setCerts(sanitizedData);
            
            // Derive Global Status: Jika ada minimal 1 sertifikat yang aktif, maka status global Aktif
            if (sanitizedData.length > 0) {
                const someActive = sanitizedData.some(c => c.is_active);
                setIsGlobalActive(someActive);
            }
            
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
                setToast({ show: true, message: `Sertifikat "${title}" berhasil dihapus`, type: 'success' });
                fetchCertificates();
            } else {
                setToast({ show: true, message: 'Gagal menghapus sertifikat', type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Terjadi kesalahan saat menghapus sertifikat', type: 'error' });
        }
        setModalConfig({ isOpen: false, itemToDelete: null });
    };

    const handleToggleVisibility = async (cert) => {
        if (togglingId) return; // Mencegah klik ganda saat loading
        setTogglingId(cert.id);
        const newStatus = !cert.is_active;

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/certificates/${cert.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...cert, is_active: newStatus ? 1 : 0 })
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Status "${cert.title}" diubah menjadi ${newStatus ? 'Verified' : 'Draft'}`,
                    type: 'success'
                });
                await fetchCertificates();
            } else {
                setToast({ show: true, message: 'Gagal mengubah status', type: 'error' });
            }
        } catch (err) {
            setToast({ show: true, message: 'Kesalahan jaringan saat mengubah status', type: 'error' });
        } finally {
            setTogglingId(null);
        }
    };

    const filteredCerts = certs.filter(cert => {
        return cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cert.issued_by || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header — Responsive Alignment */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Sertifikat</h1>
                    <p className="text-[10px] sm:text-xs text-[#64748B] mt-1 font-bold uppercase tracking-wider opacity-70">Daftar lisensi dan sertifikasi resmi PT Bala Aditi Pakuaty.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={async () => {
                            const newStatus = !isGlobalActive;
                            setIsGlobalActive(newStatus);
                            setLoading(true);

                            try {
                                const token = localStorage.getItem('admin_token');
                                // Menyimpan status keseluruhan dengan cara memperbarui massal semua id
                                await Promise.all(certs.map(cert =>
                                    fetch(`http://localhost:5000/api/certificates/${cert.id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ ...cert, is_active: newStatus ? 1 : 0 })
                                    })
                                ));

                                setToast({
                                    show: true,
                                    message: `Status Global berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Draft'}`,
                                    type: 'success'
                                });
                                fetchCertificates(); // Reload data
                            } catch (err) {
                                console.error('Gagal toggle status global', err);
                                setIsGlobalActive(!newStatus); // Revert UI
                                setLoading(false);
                            }
                        }}
                        className={`flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${isGlobalActive ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-400 text-white hover:bg-slate-500 shadow-slate-400/20'}`}
                    >
                        {isGlobalActive ? <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                        <span>Status: {isGlobalActive ? 'Aktif' : 'Draft'}</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/certificates/add')}
                        className="flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 bg-[#1e40af] text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Tambah Sertifikat</span>
                    </button>
                </div>
            </div>

            {/* Warning if Global Inactive */}
            {!isGlobalActive && (
                <div className="bg-amber-50 border border-amber-100 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm border border-amber-50 self-start sm:self-auto shrink-0">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 leading-none mb-1.5 text-sm sm:text-base">Website Mode Draft</h4>
                        <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest leading-relaxed">Seluruh sertifikat disembunyikan dari halaman publik "About Us" saat ini.</p>
                    </div>
                </div>
            )}


            {/* Filter & Search Bar — Stacked on Mobile */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari penerbit atau judul sertifikat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="px-2 pb-2 lg:p-0">
                    <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                        <Filter className="w-4 h-4" /> Filter Tahun
                    </button>
                </div>
            </div>

            {/* Certificates List — Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pb-12">
                {loading ? (
                    <div className="col-span-full py-24 text-center">
                        <div className="inline-block w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mb-5"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Data...</p>
                    </div>
                ) : filteredCerts.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <Award className="w-12 h-12 text-slate-300" />
                            <p className="font-bold text-sm text-slate-500 tracking-tight">Tidak ada sertifikat ditemukan.</p>
                        </div>
                    </div>
                ) : filteredCerts.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-6 flex gap-4 sm:gap-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${!cert.is_active ? 'opacity-60 grayscale-[0.3]' : ''}`}
                    >
                        {/* Image Preview */}
                        <div className="w-24 sm:w-28 h-32 sm:h-36 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-3 relative group/thumb cursor-zoom-in shrink-0 shadow-inner overflow-hidden">
                            <img
                                src={cert.image || '/images/pure logo pakuaty.png'}
                                alt={cert.title}
                                className={`w-full h-full object-contain group-hover/thumb:scale-110 transition-transform duration-500 ${(!cert.image || cert.image.includes('pure logo pakuaty.png')) ? 'opacity-20 grayscale' : ''}`}
                                onError={(e) => {
                                    if (!e.target.src.includes('pure%20logo%20pakuaty.png') && !e.target.src.includes('pure logo pakuaty.png')) {
                                        e.target.src = '/images/pure logo pakuaty.png';
                                        e.target.className += ' opacity-20 grayscale';
                                    }
                                }}
                            />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div className="space-y-1.5 sm:space-y-2">
                                {/* Menampilkan judul sertifikat */}
                                <h3 className="text-sm sm:text-base font-black text-[#1E293B] tracking-tight leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">{cert.title}</h3>
                                {/* Menampilkan indikator 'Pinned' jika sertifikat di-pin */}
                                {cert.is_pinned && (
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 bg-amber-50 w-fit px-2 py-0.5 rounded-lg">
                                        <Award className="w-3 h-3" /> Pinned
                                    </span>
                                )}
                                {/* Menampilkan penerbit sertifikat */}
                                <p className="text-[9px] sm:text-[10px] font-bold text-[#64748B] uppercase tracking-widest line-clamp-1">{cert.issued_by}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3 mb-4 sm:mt-0 sm:mb-0">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-[0.5rem] border border-slate-200/60 shadow-sm">
                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#1E293B]">{cert.year}</span>
                                </div>
                                <div className={`px-2.5 py-1 rounded-[0.5rem] text-[9px] sm:text-[10px] font-black border uppercase tracking-widest shadow-sm ${cert.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    {cert.is_active ? 'Online' : 'Draft'}
                                </div>
                            </div>

                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={() => handleToggleVisibility(cert)}
                                    title={cert.is_active ? "Sembunyikan Sertifikat" : "Tampilkan Sertifikat"}
                                    disabled={togglingId === cert.id}
                                    className={`p-2.5 bg-white border rounded-xl transition-all shadow-sm active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${cert.is_active ? 'border-emerald-200 text-emerald-500 hover:bg-emerald-50' : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {togglingId === cert.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : cert.is_active ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <EyeOff className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(`/admin/certificates/edit/${cert.id}`)}
                                    className="flex-1 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-[9px] sm:text-[10px] text-[#64748B] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm active:scale-95"
                                >
                                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(cert.id, cert.title)}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-95 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Status Label on Top Right (Updated Design) */}
                        <div className="absolute top-0 right-0 overflow-hidden w-[120px] h-[120px] rounded-tr-[2rem] z-10 pointer-events-none">
                            <div className={`absolute top-[28px] -right-[35px] w-[160px] rotate-45 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-md text-center py-1.5 ${cert.is_active ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-400'}`}>
                                {cert.is_active ? 'Verified' : 'Draft'}
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
                message={`Peringatan: Sertifikat "${modalConfig.itemToDelete?.title}" akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
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
