import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, Plus, Trash2, Save, Loader2, GripVertical, X, AlertCircle } from 'lucide-react';
import Toast from '../../../components/admin/Toast';
import { api } from '../../../utils/api';

/**
 * ICON_OPTIONS — Daftar ikon yang tersedia untuk dipilih admin.
 * Setiap ikon direpresentasikan sebagai string nama Lucide icon.
 */
const ICON_OPTIONS = [
    { value: 'Sprout', label: '🌱 Sprout' },
    { value: 'Microscope', label: '🔬 Microscope' },
    { value: 'Package', label: '📦 Package' },
    { value: 'Store', label: '🏪 Store' },
    { value: 'Leaf', label: '🍃 Leaf' },
    { value: 'Flame', label: '🔥 Flame' },
    { value: 'Truck', label: '🚚 Truck' },
    { value: 'ShieldCheck', label: '🛡️ Shield' },
    { value: 'Award', label: '🏆 Award' },
    { value: 'Beaker', label: '🧪 Beaker' },
    { value: 'Factory', label: '🏭 Factory' },
    { value: 'Globe', label: '🌍 Globe' },
];

// Batas maksimal jumlah langkah
const MAX_STEPS = 6;

/**
 * ManageJourney — Halaman admin untuk mengelola langkah-langkah
 * proses heritage (Our Heritage Process) di halaman utama.
 * Mendukung CRUD fleksibel: minimal 2, maksimal 6 langkah.
 */
const ManageJourney = () => {
    // State utama: daftar steps dari API
    const [steps, setSteps] = useState([]);
    // State loading & saving
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    // State form tambah step baru
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStep, setNewStep] = useState({
        step_number: 1,
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        icon: 'Sprout'
    });
    // State edit inline
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    // Toast notification
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Fetch data saat mount
    useEffect(() => {
        fetchSteps();
    }, []);

    /**
     * fetchSteps — Ambil semua journey steps dari backend
     */
    const fetchSteps = async () => {
        try {
            setLoading(true);
            const data = await api.get('/journey-steps');
            setSteps(data);
        } catch (err) {
            console.error('Error fetching journey steps:', err);
            setToast({ show: true, message: 'Gagal memuat data proses.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    /**
     * handleCreate — Tambah langkah baru ke database
     */
    const handleCreate = async () => {
        // Validasi: judul wajib diisi
        if (!newStep.title.trim()) {
            setToast({ show: true, message: 'Judul langkah wajib diisi!', type: 'error' });
            return;
        }
        try {
            setSaving(true);
            // Otomatis set step_number berdasarkan jumlah step saat ini + 1
            const stepNumber = steps.length + 1;
            await api.post('/journey-steps', { ...newStep, step_number: stepNumber });
            setToast({ show: true, message: 'Langkah baru berhasil ditambahkan!', type: 'success' });
            // Reset form dan refresh data
            setNewStep({ step_number: 1, title: '', title_en: '', description: '', description_en: '', icon: 'Sprout' });
            setShowAddForm(false);
            fetchSteps();
        } catch (err) {
            setToast({ show: true, message: err.message || 'Gagal menambah langkah.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    /**
     * handleStartEdit — Mulai mode edit untuk satu step
     */
    const handleStartEdit = (step) => {
        setEditingId(step.id);
        // Clone data step ke state edit
        setEditData({
            step_number: step.step_number,
            title: step.title,
            title_en: step.title_en || '',
            description: step.description,
            description_en: step.description_en || '',
            icon: step.icon || 'Sprout'
        });
    };

    /**
     * handleSaveEdit — Simpan perubahan edit ke backend
     */
    const handleSaveEdit = async () => {
        if (!editData.title.trim()) {
            setToast({ show: true, message: 'Judul tidak boleh kosong!', type: 'error' });
            return;
        }
        try {
            setSaving(true);
            await api.put(`/journey-steps/${editingId}`, editData);
            setToast({ show: true, message: 'Langkah berhasil diperbarui!', type: 'success' });
            setEditingId(null);
            fetchSteps();
        } catch (err) {
            setToast({ show: true, message: err.message || 'Gagal memperbarui.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    /**
     * handleDelete — Hapus step dari database
     * Minimal 2 step harus tersisa
     */
    const handleDelete = async (id) => {
        if (steps.length <= 2) {
            setToast({ show: true, message: 'Minimal 2 langkah harus ada!', type: 'error' });
            return;
        }
        if (!window.confirm('Yakin ingin menghapus langkah ini?')) return;
        try {
            setSaving(true);
            await api.delete(`/journey-steps/${id}`);
            setToast({ show: true, message: 'Langkah berhasil dihapus.', type: 'success' });
            fetchSteps();
        } catch (err) {
            setToast({ show: true, message: err.message || 'Gagal menghapus.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Data Proses...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* ═══ Header ═══ */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-3">
                        <Footprints className="w-7 h-7 text-amber-600" />
                        Kelola Proses Heritage
                    </h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">
                        Atur langkah-langkah proses produksi di halaman utama (maks. {MAX_STEPS} langkah).
                    </p>
                </div>
                {/* Tombol Tambah — hanya tampil jika belum mencapai batas */}
                {steps.length < MAX_STEPS && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1E293B] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Langkah
                    </button>
                )}
            </div>

            {/* ═══ Info Badge ═══ */}
            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                    Saat ini ada <span className="font-black">{steps.length}</span> dari <span className="font-black">{MAX_STEPS}</span> langkah.
                    Minimal 2 langkah harus ada agar tampilan di website tetap proporsional.
                </p>
            </div>

            {/* ═══ Form Tambah Baru ═══ */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-[#1E293B] tracking-tight">Tambah Langkah Baru</h3>
                                <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Grid input */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Judul ID */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul (ID)</label>
                                    <input
                                        type="text"
                                        value={newStep.title}
                                        onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                                        placeholder="Contoh: Kedelai Premium"
                                    />
                                </div>
                                {/* Judul EN */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul (EN)</label>
                                    <input
                                        type="text"
                                        value={newStep.title_en}
                                        onChange={(e) => setNewStep({ ...newStep, title_en: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                                        placeholder="Example: Premium Soybeans"
                                    />
                                </div>
                                {/* Deskripsi ID */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi (ID)</label>
                                    <textarea
                                        value={newStep.description}
                                        onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                                        rows={2}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                                        placeholder="Deskripsi singkat langkah ini..."
                                    />
                                </div>
                                {/* Deskripsi EN */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi (EN)</label>
                                    <textarea
                                        value={newStep.description_en}
                                        onChange={(e) => setNewStep({ ...newStep, description_en: e.target.value })}
                                        rows={2}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                                        placeholder="Short description in English..."
                                    />
                                </div>
                                {/* Ikon */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ikon</label>
                                    <select
                                        value={newStep.icon}
                                        onChange={(e) => setNewStep({ ...newStep, icon: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                                    >
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Tombol Simpan */}
                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Simpan Langkah
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Daftar Langkah ═══ */}
            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden group"
                    >
                        {editingId === step.id ? (
                            /* ─── MODE EDIT ─── */
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest">
                                        Edit Langkah #{step.step_number}
                                    </h3>
                                    <button onClick={() => setEditingId(null)} className="p-2 rounded-full hover:bg-slate-100">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul (ID)</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul (EN)</label>
                                        <input
                                            type="text"
                                            value={editData.title_en}
                                            onChange={(e) => setEditData({ ...editData, title_en: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi (ID)</label>
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi (EN)</label>
                                        <textarea
                                            value={editData.description_en}
                                            onChange={(e) => setEditData({ ...editData, description_en: e.target.value })}
                                            rows={2}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor Urut</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={MAX_STEPS}
                                            value={editData.step_number}
                                            onChange={(e) => setEditData({ ...editData, step_number: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ikon</label>
                                        <select
                                            value={editData.icon}
                                            onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        >
                                            {ICON_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#1E293B] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        ) : (
                            /* ─── MODE TAMPILAN ─── */
                            <div className="flex items-start gap-5">
                                {/* Nomor Langkah */}
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black text-lg shrink-0 border border-amber-200/50">
                                    {String(step.step_number).padStart(2, '0')}
                                </div>

                                {/* Info Utama */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-black text-[#1E293B] tracking-tight leading-snug">
                                        {step.title}
                                    </h3>
                                    {step.title_en && (
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                                            EN: {step.title_en}
                                        </p>
                                    )}
                                    <p className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed line-clamp-2">
                                        {step.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                                            Ikon: {step.icon}
                                        </span>
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleStartEdit(step)}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(step.id)}
                                        disabled={saving || steps.length <= 2}
                                        className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Toast */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default ManageJourney;
