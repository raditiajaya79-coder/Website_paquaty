import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, Calendar, X, MapPin, Clock, Upload, Search, Filter, AppWindow, PlayCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ManageEvents — Manajemen Event & Agenda untuk Admin.
 * Layout 2 kolom: Grid Event (Main) + Statistik & Agenda Sidebar.
 */
const ManageEvents = () => {
    const [events, setEvents] = useState([]); // Daftar event
    const [loading, setLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [editingEvent, setEditingEvent] = useState(null); // Event diedit
    const [uploading, setUploading] = useState(false); // Upload state
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian

    // Form state awal
    const initialFormState = { title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', time: '08:00 - 17:00 WIB', image: '', category: 'Exhibition' };
    const [formData, setFormData] = useState(initialFormState);

    /** fetchEvents — Ambil data event dari API */
    const fetchEvents = async () => {
        setLoading(true);
        try { setEvents(await api.get('/events')); } catch (err) { console.error("Gagal memuat:", err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

    /** handleFileUpload — Upload gambar event */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        setUploading(true);
        try { const r = await api.upload(file); setFormData(prev => ({ ...prev, image: `http://localhost:5000${r.url}` })); }
        catch (err) { alert("Gagal mengunggah: " + err.message); } finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { if (editingEvent) { await api.put(`/events/${editingEvent.id}`, formData); } else { await api.post('/events', formData); } setIsModalOpen(false); setFormData(initialFormState); fetchEvents(); }
        catch (err) { alert("Gagal menyimpan: " + err.message); }
    };

    const handleDelete = async (id) => { if (window.confirm("Hapus event ini?")) { try { await api.delete(`/events/${id}`); fetchEvents(); } catch (err) { alert("Gagal menghapus"); } } };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setFormData({ title: event.title || '', description: event.description || '', date: event.date || new Date().toISOString().split('T')[0], location: event.location || '', time: event.time || '08:00 - 17:00 WIB', image: event.image || '', category: event.category || 'Exhibition' });
        setIsModalOpen(true);
    };

    // Pencarian
    const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;

    if (loading) return <div className="text-center py-24 font-black text-slate-400 text-xs tracking-widest italic animate-pulse">SYNCHRONIZING AGENDA...</div>;

    return (
        <div className="space-y-4 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/5 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/10"><Calendar size={20} /></div>
                    <div>
                        <h2 className="text-lg font-bold text-stone-dark tracking-tight">Kanal Event & Aktivitas</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Global Exhibition & Corporate Gathering</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input
                            type="text"
                            placeholder="Cari event..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-medium w-full sm:w-48 focus:ring-1 focus:ring-brand-blue/20 transition-all border-dashed"
                        />
                    </div>
                    <button onClick={() => { setIsModalOpen(true); setEditingEvent(null); setFormData(initialFormState); }} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-dark transition-all shadow-md shadow-brand-blue/15 active:scale-[0.98] whitespace-nowrap">
                        <Plus size={14} /> Create Event
                    </button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Event Cards (8/12) */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredEvents.length === 0 ? (
                            <div className="col-span-full py-24 text-center bg-white rounded-xl border border-dashed border-slate-200">
                                <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
                                <p className="text-slate-400 text-sm font-medium">Belum ada agenda terdaftar.</p>
                            </div>
                        ) : (
                            filteredEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    layout
                                    className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group overflow-hidden border-b-4 border-b-brand-gold/10"
                                >
                                    <div className="aspect-video bg-slate-50 overflow-hidden relative">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                        <div className="absolute top-3 left-3 bg-stone-dark/80 backdrop-blur-md text-brand-gold text-[9px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest">{event.category}</div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-stone-dark text-base line-clamp-1 group-hover:text-brand-blue transition-colors tracking-tight">{event.title}</h3>
                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400"><Calendar size={13} className="text-brand-blue" /> {event.date}</div>
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400"><MapPin size={13} className="text-brand-blue" /> {event.location}</div>
                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400"><Clock size={13} className="text-brand-blue" /> {event.time}</div>
                                        </div>
                                        <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                                            <button onClick={() => openEditModal(event)} className="flex-1 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all whitespace-nowrap">Configure</button>
                                            <button onClick={() => handleDelete(event.id)} className="w-10 h-10 shrink-0 flex items-center justify-center bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Insights (4/12) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Agenda Stats */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <PlayCircle size={15} className="text-brand-blue" /> Agenda Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-3xl font-black text-stone-dark leading-none mb-1">{events.length}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Events</p>
                            </div>
                            <div className="border-l border-slate-100 pl-4">
                                <p className="text-3xl font-black text-emerald-500 leading-none mb-1">{upcomingEvents}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Upcoming</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Efficiency</span>
                                <span className="text-[10px] font-black text-brand-blue">100% Active</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-brand-blue h-full w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Filter/Tags Card */}
                    <div className="bg-stone-dark rounded-2xl p-6 text-white relative overflow-hidden shadow-lg h-36 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2"><Filter size={14} className="text-brand-gold" /> Quick Segments</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Exhibition', 'Charity', 'Workshop', 'Internal'].map(tag => (
                                    <button key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-stone-dark transition-all">{tag}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Archive Tip */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60 flex gap-4">
                        <History size={20} className="text-brand-blue shrink-0 mt-1" />
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-stone-dark tracking-tight">Data Archiving</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium capitalize">Event yang telah lewat tanggalnya akan otomatis masuk ke kategori "Past Events" di halaman publik pakuaty.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal — professional 2-column layout */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10 transition-all">
                            <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-dark tracking-tighter">{editingEvent ? 'Modify Agenda' : 'Draft New Agenda'}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.25em]">Event Scheduling module</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-7 overflow-y-auto space-y-6 no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Identification</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-base font-bold text-stone-dark focus:ring-1 focus:ring-brand-blue/20" placeholder="E.g. Pakuaty Annual Gala" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scheduling Date</label>
                                    <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold text-brand-blue" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Hours</label>
                                    <input name="time" value={formData.time} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold text-stone-dark" placeholder="08:00 - 17:00 WIB" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Venue Location</label>
                                    <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold text-stone-dark" placeholder="JIExpo Kemayoran" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Cover</label>
                                    <div className="flex gap-2">
                                        <input name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none text-slate-400 truncate" placeholder="URL Gambar..." />
                                        <label className="cursor-pointer w-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center hover:bg-stone-dark transition-all shadow-lg shadow-brand-blue/20">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                            {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={20} />}
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Editorial Description</label>
                                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-sm leading-relaxed text-slate-600" placeholder="Detail deskripsi agenda event..." />
                                </div>

                                <button type="submit" disabled={uploading} className="md:col-span-2 py-4 bg-stone-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-brand-blue transition-all active:scale-[0.98] mt-2">
                                    {uploading ? 'UPLOADING DATA...' : 'COMMIT TO AGENDA'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageEvents;
