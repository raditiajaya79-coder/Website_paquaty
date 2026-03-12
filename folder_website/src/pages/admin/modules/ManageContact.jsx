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

    // Ambil data saat komponen pertama kali dibuka
    useEffect(() => {
        fetchContacts();
    }, []);

    // Fungsi mengambil data dari API backend
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/contact');
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

    // Handle Perubahan Input Teks secara reaktif
    const handleInputChange = (id, newValue) => {
        // Menggunakan loose equality (==) agar ID tetap cocok meskipun ada perbedaan tipe string vs number
        setSocials(socials.map(s => s.id == id ? { ...s, value: newValue } : s));
    };

    // Handle Toggle Visibilitas (Header/Footer) secara reaktif
    const toggleDisplay = (id, field) => {
        // Menggunakan loose equality (==) untuk fleksibilitas tipe data ID
        setSocials(socials.map(s => s.id == id ? { ...s, [field]: !s[field] } : s));
    };

    // Fungsi memicu tambah platform baru
    const handleAdd = () => {
        const newItem = {
            id: Date.now(), // ID sementara untuk urutan render
            platform: 'Platform Baru',
            value: '',
            icon: 'Globe',
            color: 'text-slate-400',
            show_in_header: false,
            show_in_footer: false,
            isNew: true // Flag untuk penanda saat simpan (POST)
        };
        setSocials([...socials, newItem]); // Masukkan ke list state
    };

    // Fungsi Simpan Masal ke Database (Cerdas: POST untuk baru, PUT untuk lama)
    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('admin_token'); // Auth token admin

            // Loop semua kontak dan tentukan metode (POST/PUT) berdasarkan asal ID-nya
            const promises = socials.map(contact => {
                const isNew = contact.isNew || typeof contact.id === 'number' && contact.id > 1000000000000; // Deteksi ID sementara Date.now()
                const url = isNew
                    ? 'http://localhost:5000/api/contact'
                    : `http://localhost:5000/api/contact/${contact.id}`;
                const method = isNew ? 'POST' : 'PUT';

                return fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(contact)
                });
            });

            const results = await Promise.all(promises);

            // Cek jika ada request yang gagal
            const failedRequests = results.filter(res => !res.ok);
            if (failedRequests.length > 0) {
                // Ambil pesan error dari salah satu request yang gagal jika ada
                const errData = await failedRequests[0].json();
                throw new Error(errData.error || 'Gagal menyimpan beberapa item');
            }

            setToast({ show: true, message: 'Semua perubahan berhasil disinkronisasi!', type: 'success' });
            fetchContacts(); // Refresh data untuk mendapatkan ID asli dari database
        } catch (err) {
            console.error('[CONTACT] ❌ Sync Error:', err.message);
            setToast({ show: true, message: 'Gagal sinkronisasi: ' + err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
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
            const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
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
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1e40af] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] transition-all ${saving ? 'opacity-50' : ''}`}
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* Grid Daftar Kontak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
                {socials.map((item) => {
                    const IconToRender = iconComponents[item.icon] || Globe; // Pilih icon sesuai database atau default Globe
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 flex flex-col gap-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Input Area */}
                            <div className="flex items-center gap-4">
                                <div className={`p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm ${item.color}`}>
                                    <IconToRender className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest ml-1">{item.platform}</label>
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
                                        <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">Tampil Header</span>
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
