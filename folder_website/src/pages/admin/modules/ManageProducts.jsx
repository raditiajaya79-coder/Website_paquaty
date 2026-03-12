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
        <div className="space-y-5 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Manajemen Produk</h1>
                    <p className="text-xs text-[#64748B] mt-1 font-bold">Kelola katalog produk, harga diskon, dan varian kemasan.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className="flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1e40af] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#1d4ed8] transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Tambah Produk
                </button>
            </div>

            {/* Filter & Search Bar — Medium Compact */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#64748B] hover:bg-slate-50 transition-all uppercase tracking-widest">
                        Urutkan
                    </button>
                </div>
            </div>

            {/* Product Table — Flat Layout */}
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-5 py-3 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Info Produk</th>
                                <th className="px-5 py-3 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Kategori</th>
                                <th className="px-5 py-3 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Harga</th>
                                <th className="px-5 py-3 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Highlight</th>
                                <th className="px-5 py-3 text-[10px] font-black text-[#64748B] uppercase tracking-widest text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-black text-[#64748B] uppercase tracking-widest">Memuat Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-20 text-center text-[#64748B] font-bold text-sm">
                                        Tidak ada produk ditemukan.
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 overflow-hidden p-2 shadow-inner">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <span className="font-black text-[#1E293B] text-sm tracking-tight">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-[#2563EB] text-[10px] font-black rounded-lg uppercase tracking-widest">
                                            {product.category || 'Tempe Chips'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-black text-[#1E293B] text-sm">{formatPrice(product.price)}</span>
                                            {product.original_price > product.price && (
                                                <span className="text-[10px] text-red-500 font-bold line-through opacity-40">{formatPrice(product.original_price)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {product.is_bestseller ? (
                                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 w-fit">
                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest ml-1">Normal</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2.5">
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:border-blue-300 transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-400 hover:text-red-500 hover:border-red-300 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination — Medium Compact */}
                <div className="py-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Total: {products.length} produk terdaftar</p>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#64748B] opacity-40 uppercase tracking-widest transition-all hover:bg-slate-50">Previous</button>
                        <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#64748B] opacity-40 uppercase tracking-widest transition-all hover:bg-slate-50">Next Page</button>
                    </div>
                </div>
            </div>

            {/* Premium Components Integration */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, itemToDelete: null })}
                onConfirm={confirmDelete}
                title="Hapus Produk"
                message={`Peringatan: Produk "${modalConfig.itemToDelete?.name}" akan dihapus permanen dari katalog. Lanjutkan?`}
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
