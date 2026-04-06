import React, { useState, useEffect } from 'react'; // React hooks
import { motion } from 'framer-motion'; // Animasi
import {
    Settings,
    Save,
    Clock,
    ShieldCheck,
    Loader2,
    RefreshCw
} from 'lucide-react'; // Ikon
import Toast from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import { api } from '../../../utils/api';
/**
 * ManageSettings Component — Pengelolaan konfigurasi global website.
 * Digunakan untuk mengatur jam operasional, visibilitas fitur, dll.
 */
const ManageSettings = () => {
    const [settings, setSettings] = useState({}); // State data pengaturan
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Toast state
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    // Ambil semua pengaturan dari backend menggunakan utilitas api.get
    const fetchSettings = async () => {
        try {
            setLoading(true); // Mulai loading
            const data = await api.get('/settings'); // Ambil data dari endpoint /settings
            setSettings(data); // Simpan ke state
            setLoading(false); // Selesai loading
        } catch (err) {
            console.error('Error fetching settings:', err);
            setToast({
                show: true,
                message: 'Gagal memuat pengaturan',
                type: 'error'
            });
            setLoading(false);
        }
    };

    // Fungsi update satu pengaturan menggunakan utilitas api.put
    const handleUpdate = async (key, value) => {
        try {
            setSaving(true); // Mulai proses simpan
            await api.put('/settings', { key, value }); // Kirim update ke backend

            setToast({
                show: true,
                message: 'Pengaturan berhasil diperbarui!',
                type: 'success'
            });

            // Perbarui state lokal agar UI sinkron
            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (err) {
            console.error('Error updating setting:', err);
            setToast({
                show: true,
                message: err.message || 'Gagal memperbarui pengaturan',
                type: 'error'
            });
        } finally {
            setSaving(false); // Selesai proses simpan
        }
    };


    if (loading) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Pengaturan...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight flex items-center gap-3">
                        <Settings className="w-7 h-7 text-blue-600" />
                        Pengaturan Website
                    </h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Kelola konfigurasi global dan jam operasional Pakuaty.</p>
                </div>
                <button
                    onClick={fetchSettings}
                    className="flex items-center justify-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Segarkan
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Operasional Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1E293B] tracking-tight">Jam Operasional</h3>
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">Tampil di halaman kontak</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Senin - Jumat */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senin — Jumat</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={settings.hours_mon_fri || ''}
                                    onChange={(e) => setSettings({ ...settings, hours_mon_fri: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    placeholder="Contoh: 09:00 - 18:00"
                                />
                                <button
                                    onClick={() => handleUpdate('hours_mon_fri', settings.hours_mon_fri)}
                                    disabled={saving}
                                    className="px-5 bg-[#1E293B] text-white rounded-2xl hover:bg-black transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Sabtu */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sabtu</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={settings.hours_sat || ''}
                                    onChange={(e) => setSettings({ ...settings, hours_sat: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    placeholder="Contoh: 09:00 - 13:00"
                                />
                                <button
                                    onClick={() => handleUpdate('hours_sat', settings.hours_sat)}
                                    disabled={saving}
                                    className="px-5 bg-[#1E293B] text-white rounded-2xl hover:bg-black transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <Clock className="w-40 h-40 absolute -right-10 -bottom-10 text-slate-900 opacity-[0.02] transform rotate-12 pointer-events-none" />
                </motion.div>

                {/* Visibilitas Fitur Section Dihapus karena sudah ada di Manajemen Sertifikat (Redundan) */}
            </div>

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default ManageSettings;
