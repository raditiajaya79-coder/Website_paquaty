import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Loader2 } from 'lucide-react';
import Toast from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import { api } from '../../../utils/api';

/**
 * ManageFounder Component — Pengelolaan foto founder.
 */
const ManageFounder = () => {
    const [founderImage, setFounderImage] = useState('');
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
            setFounderImage(data.founder_image || '');
            setLoading(false);
        } catch (err) {
            console.error('Error fetching founder settings:', err);
            setToast({
                show: true,
                message: 'Gagal memuat pengaturan',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const handleUpdate = async (file) => {
        if (!file) return;
        try {
            setSaving(true);
            setToast({
                show: true,
                message: 'Mengunggah foto founder...',
                type: 'success'
            });

            // Upload ke Minio via API proxy
            const result = await api.upload(file);
            const value = result.url;

            // Simpan URL ke pengaturan
            await api.put('/settings', { key: 'founder_image', value });

            setToast({
                show: true,
                message: 'Foto Founder berhasil diperbarui!',
                type: 'success'
            });

            setFounderImage(value);
        } catch (err) {
            console.error('Error updating founder image:', err);
            setToast({
                show: true,
                message: err.message || 'Gagal memperbarui foto founder',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
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
                        <UserCircle className="w-7 h-7 text-purple-600" />
                        Pengaturan Foto Founder
                    </h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Atur foto utama founder yang ditampilkan di halaman About Us.</p>
                </div>
            </div>

            <div className="max-w-[400px]">
                {/* Tampilan Visual Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1E293B] tracking-tight">Tampilan Visual</h3>
                            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">Ganti / Upload Foto Baru</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col items-center">
                        <div className="w-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 inline-block ml-1">Foto Akses Utama</label>
                            <ImageUploader
                                label="Foto Founder (Semua Format)"
                                currentImage={founderImage}
                                onFileSelect={(file) => handleUpdate(file)}
                                previewClassName="w-full max-w-[280px] aspect-[4/5] mx-auto min-h-[350px]"
                            />
                            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-center mt-4">
                                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest leading-relaxed">
                                    Pastikan gambar berkualitas tinggi (contoh: portrait/vertikal bebas background).
                                </p>
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

export default ManageFounder;
