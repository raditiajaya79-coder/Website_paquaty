import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet untuk nested routes
import { getToken, removeToken } from '../utils/api';

const AdminContext = createContext();

/**
 * AdminProvider — Provider data global untuk dashboard admin.
 * Menangani state login, notifikasi (toast), dan indikator loading global.
 */
export const AdminProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login
    const [isAuthChecked, setIsAuthChecked] = useState(false); // Flag pengecekan awal selesai
    const [toasts, setToasts] = useState([]); // Daftar notifikasi aktif
    const [globalLoading, setGlobalLoading] = useState(false); // Spinner layar penuh
    const [profile, setProfile] = useState({ fullName: 'Administrator', role: 'Super Admin' }); // Data Profil Admin

    // Sinkronisasi status login dan profil saat mounting
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            const loggedInFlag = localStorage.getItem('isLoggedIn');
            const adminData = localStorage.getItem('admin_user');

            if (token && loggedInFlag === 'true') {
                setIsLoggedIn(true);
                if (adminData) {
                    try { setProfile(JSON.parse(adminData)); } catch (e) { console.error("Gagal parse profil"); }
                }
            } else {
                setIsLoggedIn(false);
                // Clear state jika tidak ada token valid
                localStorage.removeItem('isLoggedIn');
            }
            setIsAuthChecked(true); // Tandai pengecekan selesai
        };

        checkAuth();
    }, []);

    /**
     * showToast — Menampilkan notifikasi popup sementara.
     * @param {string} message - Isi pesan
     * @param {'success' | 'error' | 'info'} type - Varian warna
     */
    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Hapus otomatis setelah 3 detik
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    /**
     * logout — Keluar dari sesi admin dan membersihkan data.
     */
    const logout = () => {
        removeToken();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('admin_user');
        setIsLoggedIn(false);
        showToast("Anda telah keluar dari sistem.", "info");
    };

    return (
        <AdminContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            isAuthChecked,
            logout,
            toasts,
            showToast,
            globalLoading,
            setGlobalLoading,
            profile,
            setProfile
        }}>
            {children || <Outlet />}
        </AdminContext.Provider>
    );
};

// Hook kustom untuk memudahkan akses di komponen
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin harus digunakan di dalam AdminProvider');
    }
    return context;
};
