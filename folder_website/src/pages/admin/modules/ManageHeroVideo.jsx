import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Save, Loader2 } from 'lucide-react';
import Toast from '../../../components/admin/Toast';
import { api } from '../../../utils/api';

const ManageHeroVideo = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await api.get('/settings');
            setSettings(data);
            setLoading(false);
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

    const handleUpdate = async (key, value) => {
        try {
            setSaving(true);
            await api.put('/settings', { key, value });

            setToast({
                show: true,
                message: 'Video Profil berhasil diperbarui!',
                type: 'success'
            });

            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (err) {
            console.error('Error updating setting:', err);
            setToast({
                show: true,
                message: err.message || 'Gagal memperbarui pengaturan',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
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
                        <MonitorPlay className="w-7 h-7 text-rose-600" />
                        Pengaturan Video Beranda
                    </h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Ubah tautan YouTube untuk mengatur video latar di halaman utama.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                            <MonitorPlay className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1E293B] tracking-tight">Tautan Video YouTube</h3>
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">Masukkan link URL YouTube</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="w-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 inline-block ml-1">Link URL</label>
                            
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    value={settings.hero_video_url || ''}
                                    onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all text-slate-700 placeholder:text-slate-300"
                                    placeholder="Contoh: https://youtube.com/watch?v=xxxxx"
                                />
                                <button
                                    onClick={() => handleUpdate('hero_video_url', settings.hero_video_url)}
                                    disabled={saving}
                                    className="px-8 py-3.5 bg-[#1E293B] text-white rounded-xl hover:bg-black font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                                </button>
                            </div>

                            <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100/50 mt-6">
                                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed mb-2">
                                    Informasi Penting:
                                </p>
                                <ul className="text-xs text-rose-900/70 list-disc ml-4 space-y-1.5 font-medium">
                                    <li>Masukkan URL penuh (contoh: https://www.youtube.com/watch?v=abcd) atau link pendek youtu.be.</li>
                                    <li>Kosongkan isian ini lalu tekan Simpan jika ingin mengembalikan foto kerajinan tangan tempe statis seperti aslinya.</li>
                                    <li>Video secara otomatis berada dalam mode tanpa suara (mute) dan looping terus-menerus.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
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

export default ManageHeroVideo;
