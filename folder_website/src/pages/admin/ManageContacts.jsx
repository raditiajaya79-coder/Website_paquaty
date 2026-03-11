import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Plus, Edit2, Trash2, Link as LinkIcon, Globe, Instagram, Facebook, MessageCircle, X, Music2, Youtube, Share2, Search, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ManageContacts — Manajemen Kanal Komunikasi & Media Sosial.
 * Layout 2 kolom: List Platform (Main) + Statistik & Panduan (Sidebar).
 */
const ManageContacts = () => {
  const [contacts, setContacts] = useState([]); // Daftar kontak
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [editingContact, setEditingContact] = useState(null); // Kontak diedit
  const [searchTerm, setSearchTerm] = useState(''); // State pencarian

  const initialForm = { platform: 'Instagram', value: '', location: 'both' };
  const [formData, setFormData] = useState(initialForm);

  /** getIcon — Pemetaan platform ke ikon */
  const getIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p === 'instagram') return <Instagram size={18} />;
    if (p === 'facebook') return <Facebook size={18} />;
    if (p === 'tiktok') return <Music2 size={18} />;
    if (p === 'youtube') return <Youtube size={18} />;
    if (p === 'whatsapp') return <MessageCircle size={18} />;
    if (p === 'website') return <Globe size={18} />;
    return <LinkIcon size={18} />;
  };

  const fetchContacts = async () => {
    setLoading(true);
    try { setContacts(await api.get('/contacts')); } catch (err) { console.error("Gagal memuat:", err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { if (editingContact) { await api.put(`/contacts/${editingContact.id}`, formData); } else { await api.post('/contacts', formData); } setIsModalOpen(false); setFormData(initialForm); setEditingContact(null); fetchContacts(); }
    catch (err) { alert("Gagal menyimpan: " + err.message); }
  };

  const handleDelete = async (id) => { if (window.confirm("Hapus kanal ini?")) { try { await api.delete(`/contacts/${id}`); fetchContacts(); } catch (err) { alert("Gagal menghapus"); } } };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({ platform: contact.platform || 'Instagram', value: contact.value || '', location: contact.location || 'both' });
    setIsModalOpen(true);
  };

  // Logika Filter
  const filteredContacts = contacts.filter(c => c.platform.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="text-center py-24 font-black text-slate-400 text-xs tracking-widest italic uppercase">Syncing communication lines...</div>;

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-blue/5 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/10 shrink-0"><Share2 size={18} /></div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-stone-dark tracking-tight leading-none">Media Sosial & Kontak</h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Omnichannel Management</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative group w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={14} />
            <input
              type="text"
              placeholder="Cari platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold w-full transition-all border-dashed focus:border-brand-blue"
            />
          </div>
          <button onClick={() => { setIsModalOpen(true); setEditingContact(null); setFormData(initialForm); }} className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-dark transition-all shadow-lg shadow-brand-blue/15 active:scale-95 whitespace-nowrap">
            <Plus size={14} /> Deploy Link
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main List (8/12) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Share2 className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 text-sm font-medium">Platform belum terdaftar.</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 md:gap-4 group relative overflow-hidden"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12 shrink-0 ${contact.location === 'footer' ? 'bg-brand-blue' : 'bg-brand-gold'}`}>{getIcon(contact.platform)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-stone-dark text-[11px] md:text-sm uppercase tracking-tighter leading-none">{contact.platform}</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold truncate mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1.5 min-w-fit">
                      <Zap size={9} md:size={10} className="text-brand-gold" /> {contact.value}
                    </p>
                  </div>
                  <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-all translate-x-1 md:translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => openEditModal(contact)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg md:rounded-xl transition-all shadow-sm border border-slate-100"><Edit2 size={12} md:size={14} /></button>
                    <button onClick={() => handleDelete(contact.id)} className="p-2 md:p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-sm border border-rose-100"><Trash2 size={12} md:size={14} /></button>
                  </div>
                  <div className={`absolute top-0 right-0 w-10 h-10 rotate-45 translate-x-5 -translate-y-5 opacity-10 group-hover:opacity-20 transition-opacity ${contact.location === 'footer' ? 'bg-brand-blue' : 'bg-brand-gold'}`} />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Insights (4/12) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Channel Health Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Zap size={15} className="text-brand-blue shadow-sm" /> Channel Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-1.5">
                  <span className="text-slate-500">Contact Score</span>
                  <span className="text-emerald-500">Optimum (98%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%]" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-stone-dark">{contacts.length}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Live Links</p>
                </div>
                <div className="w-px h-8 bg-slate-100 mx-4" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-brand-gold">{contacts.filter(c => c.location !== 'footer').length}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Primary</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-stone-dark rounded-2xl p-6 text-white relative overflow-hidden shadow-lg h-36 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10 space-y-3">
              <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <ExternalLink size={14} /> Quick Guide
              </h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-bold italic">
                Gunakan format "+62" untuk WhatsApp agar fitur Direct-Chat di mobile berfungsi 100%. Social media link harus diawali dengan "https://".
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/60 flex gap-3">
            <ShieldCheck size={18} className="text-brand-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-stone-dark uppercase tracking-tight">Data Integrity</p>
              <p className="text-[9px] text-slate-500 mt-1 font-medium italic">Semua link kontak akan diverifikasi berkala oleh sistem bot Pakuaty.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal — professional compact shape */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-sm rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transition-all p-1.5 md:p-2">
              <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 pb-1.5 md:pb-2">
                <div className="px-5 py-5 md:px-7 md:py-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-stone-dark tracking-tighter uppercase leading-none">{editingContact ? 'Modify Channel' : 'New Channel'}</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-300 mt-1.5 uppercase tracking-widest italic leading-none">Global Connectivity</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-90 shrink-0"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="px-5 pb-6 md:px-7 md:pb-8 space-y-4 md:space-y-5">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Identity</label>
                    <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-black uppercase text-brand-blue appearance-none cursor-pointer focus:ring-1 focus:ring-brand-blue/20">
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Facebook">Facebook</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Website">Website</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credential/Address</label>
                    <input required name="value" value={formData.value} onChange={handleInputChange} className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-bold text-stone-dark" placeholder="@username or full URL" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Placement</label>
                    <select name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-[11px] md:text-xs font-bold text-slate-600 appearance-none cursor-pointer">
                      <option value="both">Halaman Kontak & Footer</option>
                      <option value="footer">Hanya Footer</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3.5 md:py-4.5 bg-stone-dark text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-xl hover:bg-brand-blue transition-all active:scale-95 mt-2 md:mt-4">
                    COMMIT CHANNEL
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageContacts;
