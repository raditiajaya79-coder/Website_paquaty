import React from 'react'; // React library
import { motion } from 'framer-motion'; // Animasi
import { Layout } from 'lucide-react'; // Default icon

/**
 * PlaceholderPage — Komponen umum untuk halaman admin yang belum diimplementasikan.
 * Berguna sebagai kerangka awal (UI Frame) sesuai permintaan pengguna.
 */
const PlaceholderPage = ({ title, description }) => {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">{title}</h1>
                <p className="text-[#64748B] mt-1 font-bold">{description || 'Kelola dan atur konten di sini.'}</p>
            </div>

            {/* Main Placeholder Container */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-[3rem] p-12 text-center shadow-sm"
            >
                <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                    <Layout className="w-10 h-10 text-[#2563EB]" />
                </div>
                <h2 className="text-xl font-black text-[#1E293B] mb-2 tracking-tight">Halaman Sedang Dipersiapkan</h2>
                <p className="text-[#64748B] max-sm:px-4 max-w-sm mx-auto mb-8 font-bold italic">
                    UI untuk manajemen {title.toLowerCase()} akan segera hadir. Backend CRUD akan ditambahkan di tahap berikutnya.
                </p>

                <div className="flex gap-4">
                    <button className="px-8 py-3 bg-[#1e40af] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] transition-all">
                        Tambah Data
                    </button>
                    <button className="px-8 py-3 bg-white border border-slate-200 text-[#64748B] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Export Laporan
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Export individual pages using the placeholder
export const ManageProducts = () => <PlaceholderPage title="Manajemen Produk" description="Katalog dan detail produk perusahaan." />;
export const ManageGallery = () => <PlaceholderPage title="Manajemen Galeri" description="Dokumentasi foto dan video kegiatan." />;
export const ManageCertificates = () => <PlaceholderPage title="Manajemen Sertifikat" description="Daftar sertifikasi dan lisensi resmi." />;
export const ManageEvents = () => <PlaceholderPage title="Manajemen Event" description="Agenda kegiatan dan artikel terbaru." />;
export const ManageContact = () => <PlaceholderPage title="Manajemen Kontak" description="Hubungi kami dan lokasi kantor." />;
export const ManageAnnouncements = () => <PlaceholderPage title="Manajemen Pengumuman" description="Informasi penting untuk admin dan user." />;
export const AdminProfile = () => <PlaceholderPage title="Profil Admin" description="Pengaturan akun dan keamanan." />;
