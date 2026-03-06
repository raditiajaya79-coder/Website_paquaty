import React, { useState, useEffect } from 'react'; // React hooks
import { api } from '../../utils/api'; // Utilitas API backend
import {
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  X,
  Save,
  Music2,
  Youtube,
  Share2
} from 'lucide-react'; // Ikon
import { motion, AnimatePresence } from 'framer-motion'; // Animasi

/**
 * ManageContacts — Manajemen Kanal Komunikasi & Media Sosial untuk Admin.
 * Desain bersih dan fungsional sesuai standar original.
 */
const ManageContacts = () => {
  const [contacts, setContacts] = useState([]); // State daftar kontak
  const [loading, setLoading] = useState(true); // State loading
  const [isModalOpen, setIsModalOpen] = useState(false); // State modal
  const [editingContact, setEditingContact] = useState(null); // Kontak sedang diedit

  const initialForm = { platform: 'Instagram', value: '', location: 'both' };
  const [formData, setFormData] = useState(initialForm);

  // Pemetaan ikon
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'tiktok': return <Music2 size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'whatsapp': return <MessageCircle size={20} />;
      case 'website': return <Globe size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/contacts');
      setContacts(data);
    } catch (err) {
      console.error("Gagal memuat kontak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact.id}`, formData);
      } else {
        await api.post('/contacts', formData);
      }
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingContact(null);
      fetchContacts();
    } catch (err) {
      alert("Gagal menyimpan kontak: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus kanal komunikasi ini?")) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        alert("Gagal menghapus");
      }
    }
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      platform: contact.platform || 'Instagram',
      value: contact.value || '',
      location: contact.location || 'both'
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-20 font-bold text-stone-dark">Memuat Data Kontak...</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-dark">Kanal Komunikasi</h2>
          <p className="text-sm text-stone-dark/50 mt-1">Kelola link media sosial dan platform kontak publik.</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setEditingContact(null); setFormData(initialForm); }}
          className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-brand-blue/10"
        >
          <Plus size={20} /> Tambah Platform
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
            <Share2 className="mx-auto text-stone-200 mb-4" size={48} />
            <p className="text-stone-dark/30 font-medium italic">Belum ada kanal kontak terdaftar.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-2xl border border-stone-50 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${contact.location === 'footer' ? 'bg-brand-blue' : 'bg-brand-gold'}`}>
                {getIcon(contact.platform)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-dark text-sm">{contact.platform}</h3>
                <p className="text-[10px] text-stone-dark/40 font-bold truncate mt-0.5">{contact.value}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(contact)} className="p-2 bg-stone-50 text-stone-dark/40 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(contact.id)} className="p-2 bg-stone-50 text-stone-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-dark/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-dark">{editingContact ? 'Edit Kanal' : 'Tambah Kanal'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-dark/20 hover:text-stone-dark transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Platform</label>
                  <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none font-bold">
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Username / Link / No. Telp</label>
                  <input required name="value" value={formData.value} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none" placeholder="@username atau +62..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-dark/60 uppercase ml-1">Penempatan</label>
                  <select name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none text-sm">
                    <option value="both">Halaman Kontak & Footer</option>
                    <option value="footer">Hanya Footer</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-opacity-90 transition-all">
                  Simpan Kanal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageContacts;
