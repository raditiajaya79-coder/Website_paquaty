import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api, getToken, removeToken } from '../../utils/api';

/**
 * ProtectedRoute Component — Pelindung route khusus admin.
 * Melakukan verifikasi dua tahap:
 * 1. Cek keberadaan token secara sinkron.
 * 2. Verifikasi keabsahan token ke backend secara asinkron.
 */
const ProtectedRoute = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Ambil token dari localStorage
    const token = getToken();

    useEffect(() => {
        const verifyToken = async () => {
            // Jika token benar-benar kosong, langsung tolak
            if (!token || token === 'null' || token === 'undefined') {
                setIsAuthenticated(false);
                setIsVerifying(false);
                return;
            }

            try {
                // Panggil endpoint /auth/me untuk memvalidasi token di sisi server
                // Jika token valid, backend akan mengembalikan data user (200 OK)
                await api.get('/auth/me');
                setIsAuthenticated(true);
            } catch (error) {
                // Jika error (401/403/500), berarti token tidak valid atau expired
                console.error('[AUTH] ❌ Verifikasi token gagal:', error.message);
                removeToken(); // Bersihkan token yang bermasalah
                setIsAuthenticated(false);
            } finally {
                setIsVerifying(false);
            }
        };

        // Listener untuk event logout otomatis (dari api.js interceptor)
        const handleForceLogout = () => {
            setIsAuthenticated(false);
        };
        window.addEventListener('pakuaty_logout', handleForceLogout);

        verifyToken();

        return () => window.removeEventListener('pakuaty_logout', handleForceLogout);
    }, [token]);

    // Tampilkan loading screen sederhana saat sedang verifikasi ke server
    if (isVerifying) {
        return (
            <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">
                    Verifying Identity...
                </p>
            </div>
        );
    }

    // Jika hasil verifikasi gagal, lempar ke halaman login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Jika sukses, izinkan akses ke dashboard/module admin
    return <Outlet />;
};

export default ProtectedRoute;
