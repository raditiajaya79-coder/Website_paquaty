import React from 'react';
import { Factory, Cog, Pencil } from 'lucide-react';

/**
 * ManageProduction [Placeholder]
 * Halaman khusus admin untuk mengelola konten Proses Produksi & Sustainability.
 * Saat ini hanya berfungsi sebagai placeholder navigasi sesuai permintaan user.
 */
const ManageProduction = () => {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800">Manajemen Produksi</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Kustomisasi konten proses produksi dan laporan keberlanjutan.</p>
                </div>
            </header>

            {/* Placeholder Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Factory className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Halaman Manajemen Produksi</h2>
                <p className="text-slate-400 text-sm max-w-md font-medium tracking-tight mx-auto mb-8">
                    Modul ini disiapkan untuk pengerjaan selanjutnya. Anda dapat menambahkan field untuk mengubah langkah-langkah produksi atau mengunggah laporan keberlanjutan baru di sini nanti.
                </p>
                
                <div className="flex gap-4">
                    <button disabled className="px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                        Fitur Segera Hadir
                    </button>
                    <button disabled className="px-6 py-2.5 border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                        Pengaturan Dasar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageProduction;
