import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
    Plus,
    Edit2,
    Trash2,
    Calendar,
    X,
    Save,
    MapPin,
    Clock,
    Upload
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Animasi

/**
 * ManageEvents — Manajemen Event & Agenda untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageEvents = () => {
    const [events, setEvents] = useState([]); // State daftar event
    const [loading, setLoading] = useState(true); // State loading
    const [isModalOpen, setIsModalOpen] = useState(false); // State modal
    const [editingEvent, setEditingEvent] = useState(null); // Event sedang diedit

    // Initial Form State
    const initialFormState = {
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        time: '08:00 - 17:00 WIB',
        image: '',
        category: 'Exhibition'
    };

    const [formData, setFormData] = useState(initialFormState);

    // Ambil data event
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await api.get('/events');
            setEvents(data);
        } catch (err) {
            console.error("Gagal memuat event:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle upload file
    const [uploading, setUploading] = useState(false);
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await api.upload(file);
            const imageUrl = `http://localhost:5000${result.url}`;
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (err) {
            alert("Gagal mengunggah gambar: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, formData);
            } else {
                await api.post('/events', formData);
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchEvents();
        } catch (err) {
            alert("Gagal menyimpan event: " + err.message);
        }
    };

    // Hapus event
    const handleDelete = async (id) => {
        if (window.confirm("Hapus agenda event ini?")) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (err) {
                alert("Gagal menghapus");
            }
        }
    };

    // Buka edit modal
    const openEditModal = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            description: event.description || '',
            date: event.date || new Date().toISOString().split('T')[0],
            location: event.location || '',
            time: event.time || '08:00 - 17:00 WIB',
            image: event.image || '',
            category: event.category || 'Exhibition'
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Agenda...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-extrabold text-stone-dark">Agenda Event</h2>
                    <p className="text-sm text-stone-dark/50 mt-1">Kelola pameran dan aktivitas mendatang.</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingEvent(null); setFormData(initialFormState); }}
                    className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
                >
                    <Plus size={20} /> Tambah Agenda
                </button>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
                        <Calendar className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-dark/30 font-medium italic">Belum ada agenda event terdaftar.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                            {/* Visual Sample */}
                            <div className="aspect-video bg-stone-50 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                    {event.category}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="font-bold text-stone-dark text-lg line-clamp-1">{event.title}</h3>
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-xs text-stone-dark/50">
                                        <Calendar size={14} className="text-brand-blue" /> {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-stone-dark/50">
                                        <MapPin size={14} className="text-brand-blue" /> {event.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-stone-dark/50">
                                        <Clock size={14} className="text-brand-blue" /> {event.time}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-6 mt-6 border-t border-stone-50">
                                    <button onClick={() => openEditModal(event)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-cream text-brand-gold-dark rounded-lg text-sm font-bold hover:bg-brand-gold/10 transition-colors">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(event.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={16} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-dark/30 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-dark">{editingEvent ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Nama Event</label>
                                    <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Tanggal</label>
                                        <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Waktu</label>
                                        <input name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="Misal: 08:00 - Selesai" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Lokasi</label>
                                        <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="Misal: JIExpo Kemayoran" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Gambar Agenda (URL)</label>
                                        <div className="flex gap-2">
                                            <input name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-xs outline-none" />
                                            <label className="cursor-pointer w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all flex-shrink-0">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                <Upload size={20} className={uploading ? 'animate-bounce' : ''} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all">
                                    {uploading ? 'Mengunggah...' : 'Simpan Agenda'}
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
