import React, { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigasi router
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    Star
} from 'lucide-react'; // Ikon
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';

/**
 * ManageProducts Component — Halaman pengelolaan katalog produk.
 * Sekarang mendukung navigasi ke halaman terpisah untuk CRUD.
 */
const ManageProducts = () => {
    const navigate = useNavigate(); // Hook untuk navigasi
    const [products, setProducts] = useState([]); // State untuk data produk asli
    const [loading, setLoading] = useState(true); // State loading
    const [error, setError] = useState(null); // State error
    const [searchTerm, setSearchTerm] = useState(''); // State pencarian

    // Modal & Toast States
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        itemToDelete: null
    });
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // Fetch data produk dari backend saat komponen dimuat
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Gagal mengambil data produk');
            const data = await response.json();

            // Sanitasi data: Pastikan data adalah array untuk mencegah crash pada .filter() atau .map()
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            setProducts([]); // Reset ke array kosong jika terjadi error
            setLoading(false);
        }
    };

    // Fungsi hapus produk (Sekarang menggunakan modal kustom)
    const handleDelete = (id, name) => {
        setModalConfig({
            isOpen: true,
            itemToDelete: { id, name }
        });
    };

    const confirmDelete = async () => {
        const { id, name } = modalConfig.itemToDelete;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setToast({
                    show: true,
                    message: `Produk "${name}" berhasil dihapus`,
                    type: 'success'
                });
                fetchProducts(); // Refresh data
            } else {
                const data = await response.json();
                setToast({
                    show: true,
                    message: `Gagal menghapus: ${data.error}`,
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({
                show: true,
                message: 'Terjadi kesalahan saat menghapus produk',
                type: 'error'
            });
        }
    };

    // Filter produk berdasarkan search term
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Formatter harga Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header — Responsive Alignment */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Produk</h1>
                    <p className="text-[10px] sm:text-xs text-[#64748B] mt-1 font-bold uppercase tracking-wider opacity-70">Kelola katalog produk, harga diskon, dan varian kemasan.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1e40af] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 transition-all group w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Filter & Search Bar — Stacked on Mobile */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari nama produk atau kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Product Table — Responsive Scroll */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Info Produk</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Harga</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Highlight</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <Package className="w-12 h-12 text-slate-300" />
                                            <p className="font-bold text-sm text-slate-500 tracking-tight">Tidak ada produk ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 overflow-hidden p-2.5 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => e.target.src = '/images/placeholder.png'}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-[#1E293B] text-sm tracking-tight leading-tight group-hover:text-[#2563EB] transition-colors">{product.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SKU-{product.id.toString().slice(-4).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black rounded-xl uppercase tracking-widest inline-block focus:ring-2 focus:ring-indigo-200">
                                            {product.category || 'Chips'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-[#1E293B] text-sm">{formatPrice(product.price)}</span>
                                            {product.original_price > product.price && (
                                                <span className="text-[10px] text-red-400 font-bold line-through opacity-60">{formatPrice(product.original_price)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {product.is_bestseller ? (
                                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 w-fit shadow-sm shadow-amber-900/5">
                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Laris</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-90"
                                                title="Edit Produk"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-90"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer — Total item */}
                <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total: {filteredProducts.length} dari {products.length} produk</p>
                </div>
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message={`Peringatan: Produk "${modalConfig.itemToDelete?.name}" akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
            />

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default ManageProducts;
