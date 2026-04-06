import React, { useState, useEffect } from 'react'; // React hooks
import { motion } from 'framer-motion'; // Animasi
import {
    Phone,
    Instagram,
    Video,
    ShoppingBag,
    Globe,
    CheckCircle2,
    Save,
    Eye,
    Layout,
    Navigation,
    Twitter,
    Link as LinkIcon,
    Plus,
    Loader2,
    Trash2,
    Facebook,
    Mail,
    MessageCircle
} from 'lucide-react'; // Ikon Lucide
import Toast from '../../../components/admin/Toast'; // Komponen Toast untuk feedback
import ConfirmModal from '../../../components/admin/ConfirmModal'; // Modal Konfirmasi
import { API_BASE_URL } from '../../../utils/api';

/**
 * ManageContact Component — Manajemen link kontak & sosial media secara dinamis.
 */
const ManageContact = () => {
    const [socials, setSocials] = useState([]); // State data kontak
    const [loading, setLoading] = useState(true); // State loading proses
    const [saving, setSaving] = useState(false); // State loading saat simpan
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // State feedback user
    const [modalConfig, setModalConfig] = useState({ isOpen: false, itemToDelete: null }); // Config modal hapus

    // Mapping string nama icon ke komponen Lucide asli agar bisa di-render
    const iconComponents = {
        'Phone': Phone,
        'Instagram': Instagram,
        'Video': Video,
        'ShoppingBag': ShoppingBag,
        'Globe': Globe,
        'Twitter': Twitter,
        'LinkIcon': LinkIcon,
        'Facebook': Facebook,
        'Mail': Mail,
        'MessageCircle': MessageCircle
    };

    // Custom SVG Component untuk Logo Asli / Brand Icons
    const CustomBrandIcons = {
        Instagram: () => (
            <svg viewBox="0 0 24 24" fill="url(#ig-grad)" className="w-7 h-7">
                <defs>
                    <linearGradient id="ig-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#405de6" />
                        <stop offset="25%" stopColor="#5851db" />
                        <stop offset="50%" stopColor="#833ab4" />
                        <stop offset="75%" stopColor="#c13584" />
                        <stop offset="90%" stopColor="#e1306c" />
                        <stop offset="100%" stopColor="#fd1d1d" />
                    </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        Facebook: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" style={{ color: '#1877F2' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        WhatsApp: () => (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
                <rect width="24" height="24" rx="5.5" fill="#25D366" />
                <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
            </svg>
        ),
        Tiktok: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: '#000000' }}>
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.63 3.26-1.78 4.41-1.24 1.25-3.03 1.96-4.8 1.89-1.76-.08-3.41-.89-4.54-2.2-1.17-1.35-1.72-3.17-1.52-4.94.2-1.76 1.11-3.32 2.51-4.4 1.41-1.09 3.22-1.52 4.96-1.19.16.03.32.07.48.11V5.09c0-1.69.01-3.38.01-5.07zm-2.02 8.71c-1.47.01-2.92.57-4 1.55-1.03.95-1.63 2.34-1.67 3.75-.02 1.48.51 2.92 1.48 4.02.99 1.11 2.45 1.75 3.96 1.79 1.5.03 2.97-.53 4.07-1.53 1.05-.96 1.67-2.33 1.72-3.76.01-1.89.01-3.79.02-5.69-.17-.03-.35-.06-.52-.08-1.5-.15-3.02.02-4.4.67-.23.11-.44.24-.66.38z" />
            </svg>
        ),
        Twitter: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: '#000000' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        Shopee: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" style={{ color: '#EE4D2D' }}>
                <path d="M7.747 16.335c0 1.218 1.413 2.15 3.985 2.15 2.89 0 3.846-1.125 3.846-2.15 0-.89-.861-1.47-3.003-1.859l-2.016-.372c-2.455-.45-3.69-1.545-3.69-3.416 0-2.333 2.05-3.956 5.09-3.956 3.19 0 4.885 1.77 4.885 3.88h-3.03c0-.98-.823-1.688-2.004-1.688-1.423 0-2.04.646-2.04 1.446 0 .806.777 1.258 2.21 1.503l2.808.513c2.407.45 3.69 1.55 3.69 3.518 0 2.288-1.956 4.148-5.32 4.148-3.06 0-5.463-1.413-5.463-4.147l3.052.23zM23.116 8.44L14.475 1A2.5 2.5 0 0012 0a2.5 2.5 0 00-2.475 1L.884 8.44C.358 8.892 0 9.535 0 10.237v9.42c0 1.94 1.573 3.512 3.513 3.512h16.974c1.94 0 3.513-1.572 3.513-3.513v-9.42c0-.702-.358-1.345-.884-1.797z" />
            </svg>
        )
    };

    // Preset Platform untuk kemudahan Admin saat tambah baru
    const PRESET_PLATFORMS = [
        { name: 'Instagram', icon: 'Instagram' },
        { name: 'Facebook', icon: 'Facebook' },
        { name: 'WhatsApp Sales', icon: 'WhatsApp' },
        { name: 'Phone Inquiry', icon: 'Phone', color: 'text-blue-500' },
        { name: 'Email', icon: 'Mail', color: 'text-slate-600' },
        { name: 'Tiktok', icon: 'Tiktok' },
        { name: 'Twitter/X', icon: 'Twitter' },
        { name: 'Shopee/Tokopedia', icon: 'Shopee' },
        { name: 'Website Lain', icon: 'Globe', color: 'text-slate-400' }
    ];

    // Ambil data saat komponen pertama kali dibuka
    useEffect(() => {
        fetchContacts();
    }, []);

    // Fungsi mengambil data dari API backend
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/contact`);
            if (!response.ok) throw new Error('Gagal memuat data kontak');
            const data = await response.json();
            // Simpan data array ke state
            setSocials(Array.isArray(data) ? data : []);
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Fungsi Simpan Individual (Auto-Save)
    const saveContact = async (contactToSave) => {
        if (!contactToSave) return;
        try {
            setSaving(true);
            const token = localStorage.getItem('admin_token');
            const isNew = contactToSave.isNew || (typeof contactToSave.id === 'number' && contactToSave.id > 1000000000000);
            const url = isNew ? `${API_BASE_URL}/contact` : `${API_BASE_URL}/contact/${contactToSave.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(contactToSave)
            });

            if (!response.ok) throw new Error('Gagal menyimpan otomatis');
            if (isNew) fetchContacts(); // Refresh untuk dapatkan ID DB
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Handle Perubahan Input Teks (Hanya update state)
    const handleInputChange = (id, newValue) => {
        setSocials(socials.map(s => s.id == id ? { ...s, value: newValue } : s));
    };

    // Auto-save: dipicu saat input teks kehilangan fokus (onBlur)
    const handleInputBlur = (id) => {
        const item = socials.find(s => s.id == id);
        if (item) saveContact(item);
    };

    // Handle Perubahan Dropdown Platform (Auto-Save)
    const handlePlatformChange = (id, newPlatformName) => {
        const preset = PRESET_PLATFORMS.find(p => p.name === newPlatformName);
        const updatedItem = preset ? { platform: preset.name, icon: preset.icon, color: preset.color } : { platform: newPlatformName };
        
        const newSocials = socials.map(s => s.id == id ? { ...s, ...updatedItem } : s);
        setSocials(newSocials);
        saveContact(newSocials.find(s => s.id == id));
    };

    // Handle Toggle Visibilitas (Header/Footer) (Auto-Save)
    const toggleDisplay = (id, field) => {
        const newSocials = socials.map(s => s.id == id ? { ...s, [field]: !s[field] } : s);
        setSocials(newSocials);
        saveContact(newSocials.find(s => s.id == id));
    };

    // Fungsi memicu tambah platform baru
    const handleAdd = () => {
        const newItem = {
            id: Date.now(), // ID sementara untuk urutan render
            platform: 'Instagram', // Default preset pertama
            value: '',
            icon: 'Instagram',
            color: 'text-pink-500',
            show_in_header: false,
            show_in_footer: false,
        };
        setSocials([...socials, newItem]); 
    };

    // Fungsi Pemicu Modal Hapus
    const handleDelete = (id, platform) => {
        setModalConfig({ isOpen: true, itemToDelete: { id, platform } });
    };

    // Fungsi Eksekusi Hapus dari Database
    const confirmDelete = async () => {
        const { id, platform } = modalConfig.itemToDelete;

        // CEK: Jika ID > 1000000000000, berarti ini adalah item baru yang belum disimpan ke DB (Date.now())
        // Kita cukup menghapusnya dari state lokal tanpa memanggil API.
        if (typeof id === 'number' && id > 1000000000000) {
            setSocials(socials.filter(s => s.id !== id));
            setToast({ show: true, message: `Platform baru berhasil dibatalkan`, type: 'success' });
            setModalConfig({ isOpen: false, itemToDelete: null });
            return;
        }

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setToast({ show: true, message: `Kontak ${platform} berhasil dihapus`, type: 'success' });
                // Optimistic UI: Langsung hapus dari state agar tidak perlu fetch ulang yang berat
                setSocials(socials.filter(s => s.id !== id));
            } else {
                throw new Error('Gagal menghapus dari server');
            }
        } catch (err) {
            setToast({ show: true, message: err.message, type: 'error' });
        } finally {
            setModalConfig({ isOpen: false, itemToDelete: null });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Kontak...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Manajemen */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Manajemen Kontak</h1>
                    <p className="text-[#64748B] mt-0.5 font-bold text-[11px]">Atur link sosial media dan lokasi penampilannya di website.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saving && <span className="text-xs font-bold text-slate-400 animate-pulse">Menyimpan...</span>}
                </div>
            </div>

            {/* Grid Daftar Kontak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
                {socials.map((item) => {
                    // Cek jika icon ini adalah brand icon SVG custom
                    const CustomBrandIcon = CustomBrandIcons[item.icon];
                    const IconToRender = CustomBrandIcon || iconComponents[item.icon] || Globe;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 flex flex-col gap-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Input Area */}
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center w-12 h-12 ${CustomBrandIcon ? '' : item.color}`}>
                                    {CustomBrandIcon ? <CustomBrandIcon /> : <IconToRender className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        {/* Dropdown Pemilihan Platform */}
                                        <select
                                            value={item.platform}
                                            onChange={(e) => handlePlatformChange(item.id, e.target.value)}
                                            className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest ml-1 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:underline"
                                        >
                                            {/* Opsi Dropdown */}
                                            {PRESET_PLATFORMS.map(preset => (
                                                <option key={preset.name} value={preset.name} className="text-slate-700 font-bold">
                                                    {preset.name}
                                                </option>
                                            ))}
                                            {/* Fallback untuk platform custom usang yang tidak ada di preset */}
                                            {!PRESET_PLATFORMS.find(p => p.name === item.platform) && (
                                                <option value={item.platform} className="text-slate-700 font-bold">{item.platform}</option>
                                            )}
                                        </select>
                                        <button
                                            onClick={() => handleDelete(item.id, item.platform)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                                            onBlur={() => handleInputBlur(item.id)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 font-bold text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visibility Controls */}
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => toggleDisplay(item.id, 'show_in_header')}
                                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${item.show_in_header ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-50' : 'bg-slate-50 border-transparent grayscale opacity-50'}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Navigation className={`w-3.5 h-3.5 ${item.show_in_header ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                                        <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">Tampil Di Page Contact</span>
                                    </div>
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${item.show_in_header ? 'bg-[#2563EB]' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.show_in_header ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => toggleDisplay(item.id, 'show_in_footer')}
                                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${item.show_in_footer ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-50' : 'bg-slate-50 border-transparent grayscale opacity-50'}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Layout className={`w-3.5 h-3.5 ${item.show_in_footer ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                                        <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">Tampil Footer</span>
                                    </div>
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${item.show_in_footer ? 'bg-[#2563EB]' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.show_in_footer ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Tombol Tambah — Masuk ke state socials */}
                <div
                    onClick={handleAdd}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-[#2563EB] hover:border-blue-200 transition-all cursor-pointer group bg-slate-50/20"
                >
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:scale-110 transition-all">
                        <Plus className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Tambah Platform Baru</span>
                </div>
            </div>

            {/* Notifikasi Toast */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* Modal Konfirmasi Hapus */}
            {/* ConfirmModal digunakan untuk menampilkan dialog konfirmasi sebelum melakukan aksi yang destruktif, seperti menghapus data. */}
            {/* isOpen: Mengontrol visibilitas modal. */}
            {/* onClose: Fungsi yang dipanggil saat modal ditutup (misalnya, klik di luar modal atau tombol batal). */}
            {/* onConfirm: Fungsi yang dipanggil saat pengguna mengkonfirmasi aksi (misalnya, klik tombol 'Hapus'). */}
            {/* title: Judul yang ditampilkan di header modal. */}
            {/* message: Pesan peringatan yang ditampilkan di body modal, seringkali dinamis berdasarkan item yang akan dihapus. */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Hapus Kontak"
                message={`Peringatan: Link ${modalConfig.itemToDelete?.platform} akan dihapus permanen. Lanjutkan?`}
            />
        </div>
    );
};

export default ManageContact;
