import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Bell, Save, Image as ImageIcon, Link as LinkIcon, Type, AlignLeft, ToggleLeft, ToggleRight, Upload, X, Eye, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

/**
 * ManageAnnouncement — Pengaturan Popup Pengumuman.
 * Admin bisa aktifkan/nonaktifkan popup dan ubah isi konten.
 * Layout full-width: 3 kolom pada desktop (preview + form + sidebar info).
 */
const ManageAnnouncement = () => {
    const { showToast, setGlobalLoading } = useAdmin(); // Global state hooks
    const [loading, setLoading] = useState(true); // Loading data awal
    const [uploading, setUploading] = useState(false); // Upload state

    // State data pengumuman — semua field popup
    const [data, setData] = useState({ title: '', message: '', image: '', button_text: 'Lihat Detail', link: '', is_active: false });

    /** Ambil data pengumuman dari backend saat mount */
    useEffect(() => {
        const fetch = async () => {
            try { setData(await api.get('/announcements')); } // GET pengumuman
            catch (err) { showToast("Gagal memuat data", "error"); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    /** handleChange — Handler generik untuk semua input form */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    /** handleFileUpload — Upload gambar pengumuman ke backend */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; // Ambil file pertama
        if (!file) return;
        setUploading(true);
        try {
            const r = await api.upload(file); // Upload ke server
            setData(prev => ({ ...prev, image: `http://localhost:5000${r.url}` })); // Set URL hasil
            showToast("Gambar berhasil diunggah", "success");
        } catch (err) {
            showToast("Gagal mengunggah: " + err.message, "error");
        } finally { setUploading(false); }
    };

    /** handleSubmit — Simpan pengaturan pengumuman ke backend */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalLoading(true);
        try {
            await api.put('/announcements', data); // PUT update data
            showToast("Pengaturan berhasil disimpan!", "success");
        } catch (err) {
            showToast("Gagal menyimpan: " + err.message, "error");
        } finally { setGlobalLoading(false); }
    };

    // Loading state
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <div className="w-10 h-10 border-[3px] border-stone-dark border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold uppercase tracking-widest">Menyinkronkan Data...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-10">
            {/* Header + Toggle — full width */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base md:text-lg font-bold text-stone-dark tracking-tight flex items-center gap-2 leading-none">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-brand-blue/5 text-brand-blue rounded-lg flex items-center justify-center shrink-0"><Bell size={16} /></div>
                        Popup Pengumuman
                    </h2>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1.5 leading-none">Atur pesan selamat datang atau promo untuk pengunjung.</p>
                </div>
                {/* Toggle Switch */}
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 md:px-3.5 md:py-2 rounded-xl border border-slate-200/60 w-full md:w-auto justify-between md:justify-start">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status:</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setData(prev => ({ ...prev, is_active: !prev.is_active }))} className={`transition-all duration-300 ${data.is_active ? 'text-brand-blue' : 'text-slate-300'}`}>
                            {data.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                        <span className={`text-[11px] md:text-xs font-bold leading-none ${data.is_active ? 'text-brand-blue' : 'text-slate-400'}`}>{data.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                </div>
            </div>

            {/* Main Content — Layout 3 kolom: Image | Form Fields | Preview/Tips */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Kolom Kiri — Image Upload (4/12) */}
                <div className="lg:col-span-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={13} /> Gambar Pengumuman</label>
                    {/* Preview area — aspect 4:3 */}
                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-brand-gold/30">
                        {data.image ? (
                            <>
                                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                                {/* Tombol hapus gambar — tampil saat hover */}
                                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => setData(prev => ({ ...prev, image: '' }))} className="bg-white p-2 rounded-full text-rose-500 shadow-lg"><X size={16} /></button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4 opacity-40">
                                <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Drop image or click<br />to select</p>
                            </div>
                        )}
                        {/* Uploading overlay */}
                        {uploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"><div className="w-6 h-6 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>
                    {/* Upload button */}
                    <label className="cursor-pointer block">
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        <div className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold uppercase tracking-wider text-center hover:bg-slate-100 transition-all border border-slate-200/60">{uploading ? 'Processing...' : 'Upload Asset'}</div>
                    </label>
                    {/* Image URL manual input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Atau masukkan URL</label>
                        <input name="image" value={data.image} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-[11px] text-slate-500 truncate" />
                    </div>
                </div>

                {/* Kolom Tengah — Content Fields (5/12) */}
                <div className="lg:col-span-5 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                    <h3 className="text-xs md:text-sm font-black text-stone-dark uppercase tracking-widest flex items-center gap-1.5 mb-1"><Type size={14} className="text-brand-blue" /> Konten Pengumuman</h3>

                    {/* Headline */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Headline</label>
                        <input required name="title" value={data.title} onChange={handleChange} placeholder="E.g. Promo Spesial" className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue/20 outline-none text-xs md:text-sm font-bold text-stone-dark placeholder:text-slate-300" />
                    </div>

                    {/* Pesan */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pesan</label>
                        <textarea required name="message" value={data.message} onChange={handleChange} rows="4" md:rows="5" placeholder="Deskripsi pengumuman..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-blue/20 outline-none resize-none text-[11px] md:text-sm font-medium leading-relaxed text-slate-600 placeholder:text-slate-300" />
                    </div>

                    {/* Teks Tombol & URL */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teks Tombol</label>
                            <input name="button_text" value={data.button_text} onChange={handleChange} placeholder="Explore Now" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold text-stone-dark" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL Tujuan</label>
                            <input name="link" value={data.link} onChange={handleChange} placeholder="/products" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-brand-blue font-bold" />
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={uploading} className="w-full py-3.5 bg-stone-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-brand-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2">
                        <Save size={15} /> Simpan Pengaturan
                    </button>
                </div>

                {/* Kolom Kanan — Preview & Tips (3/12) */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Preview Mock — simulasi popup di layar */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Smartphone size={13} /> Preview Popup</h3>
                        <div className="bg-slate-900 rounded-lg p-3 aspect-[9/14] flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Mock popup card */}
                            <div className="bg-white rounded-lg w-full max-w-full shadow-xl overflow-hidden">
                                {data.image && <img src={data.image} alt="Preview" className="w-full h-20 object-cover" />}
                                <div className="p-3">
                                    <h4 className="font-bold text-[10px] text-stone-dark truncate">{data.title || 'Headline...'}</h4>
                                    <p className="text-[8px] text-slate-400 mt-1 line-clamp-2">{data.message || 'Pesan pengumuman...'}</p>
                                    {data.button_text && (
                                        <div className="mt-2 bg-brand-blue text-white text-[7px] py-1 px-2 rounded text-center font-semibold">{data.button_text}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Eye size={13} /> Tips</h3>
                        <ul className="space-y-2">
                            <li className="text-[11px] text-slate-500 leading-relaxed flex gap-2">
                                <span className="text-brand-gold font-bold mt-0.5">•</span>
                                Gunakan gambar beresolusi tinggi (800x600px+) agar tampil jelas.
                            </li>
                            <li className="text-[11px] text-slate-500 leading-relaxed flex gap-2">
                                <span className="text-brand-gold font-bold mt-0.5">•</span>
                                URL kosong akan menonaktifkan tombol aksi pada popup.
                            </li>
                            <li className="text-[11px] text-slate-500 leading-relaxed flex gap-2">
                                <span className="text-brand-gold font-bold mt-0.5">•</span>
                                Popup hanya tampil sekali per sesi pengunjung.
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default ManageAnnouncement;
