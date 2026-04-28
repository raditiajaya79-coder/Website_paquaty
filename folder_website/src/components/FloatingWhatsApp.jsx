import React from 'react';
import { useGlobalData } from '../context/GlobalDataContext';
import { generateContactHref } from '../utils/contact';

/**
 * FloatingWhatsApp
 * Widget kontak WhatsApp yang mengambang di pojok kiri bawah layar.
 * Komponen ini otomatis mengambil data dari context global tanpa fetch ulang.
 */
const FloatingWhatsApp = () => {
    // Ambil daftar kontak dari data global (di-load saat awal render web)
    const { contacts } = useGlobalData();
    
    // Cari spesifik kontak yang memiliki icon 'WhatsApp'
    const waContact = Array.isArray(contacts) 
        ? contacts.find(c => c.icon === 'WhatsApp') 
        : null;

    // Jika admin tidak mendefinisikan kontak WhatsApp, maka jangan tampilkan widget ini
    if (!waContact) return null;

    // Gunakan fungsi utility untuk merubah raw value menjadi link API whatsapp lengkap
    const href = generateContactHref(waContact);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            // Layout fixed di bottom-6 left-6 (kiri bawah) dengan z-index tinggi
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            title="Chat dengan Kami di WhatsApp"
        >
            {/* Tooltip text, diposisikan ke kanan ikon agar tidak memotong layar */}
            <span className="absolute left-full ml-3 bg-white text-stone-dark text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Hubungi Kami
            </span>

            {/* Ikon resmi WhatsApp standar SVG */}
            <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="currentColor" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
            </svg>
        </a>
    );
};

export default FloatingWhatsApp;
