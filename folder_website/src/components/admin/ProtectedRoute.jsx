import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component — Pelindung route khusus admin.
 * Memeriksa keberadaan token di localStorage sebelum mengizinkan akses.
 */
const ProtectedRoute = () => {
    // Cek apakah token admin tersedia di localStorage
    const token = localStorage.getItem('admin_token');

    // Jika token tidak ada, lempar user kembali ke halaman login
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // Jika token ada, izinkan akses ke child routes
    return <Outlet />;
};

export default ProtectedRoute;
