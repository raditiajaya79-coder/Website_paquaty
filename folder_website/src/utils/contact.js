/**
 * src/utils/contact.js — Utilitas terpusat untuk pengolahan data kontak
 * Digunakan untuk menstandarisasi Link (href) dan Label (tampilan) dari data kontak di database.
 */

/**
 * generateContactHref — Smart URL generator.
 * Mengonversi input mentah (username, nomor, email) menjadi link fungsional.
 *
 * @param {Object} contact - Objek kontak ({ icon, value })
 * @returns {string} URL siap pakai untuk atribut 'href' tag <a>
 */
export const generateContactHref = (contact) => {
    const val = (contact.value || '').trim();

    // Jika admin memasukkan URL lengkap, gunakan apa adanya
    if (val.startsWith('http://') || val.startsWith('https://')) return val;

    switch (contact.icon) {
        case 'Mail':
            return `mailto:${val}`;

        case 'WhatsApp':
        case 'MessageCircle':
        case 'Phone': {
            let num = val.replace(/\D/g, ''); // Hapus semua non-angka
            if (num.startsWith('0')) num = '62' + num.slice(1); // Konversi 0 ke 62
            return contact.icon === 'Phone' ? `tel:+${num}` : `https://wa.me/${num}`;
        }

        case 'Instagram':
            return `https://instagram.com/${val.replace(/^@/, '')}`;

        case 'Facebook':
            return `https://facebook.com/${val.replace(/^@/, '').replace(/facebook\.com\//, '')}`;

        case 'Tiktok':
            return `https://tiktok.com/${val.startsWith('@') ? val : '@' + val}`;

        case 'Twitter':
            return `https://x.com/${val.replace(/^@/, '')}`;

        case 'Shopee':
        case 'ShoppingBag':
            return `https://shopee.co.id/${val}`;

        default:
            return `https://${val}`;
    }
};

/**
 * generateContactLabel — Penyeragam tampilan (Visual Standardizer).
 * Mengonversi input mentah menjadi label yang bersih dan konsisten.
 *
 * @param {Object} contact - Objek kontak ({ icon, value, platform })
 * @returns {string} Label yang akan ditampilkan di layar (misal: @username)
 */
export const generateContactLabel = (contact) => {
    const val = (contact.value || '').trim();

    // Mapping per platform untuk standarisasi tampilan
    switch (contact.icon) {
        case 'Instagram':
            // Format: selalu @username (lowercase)
            return `@${val.replace(/^@/, '').toLowerCase()}`;

        case 'Facebook':
            // Format: Ambil ID page saja (hapus URL jika ada)
            return val.replace(/https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '');

        case 'WhatsApp':
        case 'MessageCircle':
        case 'Phone': {
            // Format: +62 8xx xxxx xxxx (agar mudah dibaca)
            let num = val.replace(/\D/g, '');
            if (num.startsWith('0')) num = '62' + num.slice(1);
            if (!num.startsWith('62')) num = '62' + num;
            
            // Format angka menjadi +62 8xx-xxxx-xxxx
            const part1 = num.slice(0, 2); // 62
            const part2 = num.slice(2, 5); // 8xx
            const part3 = num.slice(5, 9); // xxxx
            const part4 = num.slice(9);    // xxxx
            return `+${part1} ${part2} ${part3} ${part4}`.trim();
        }

        case 'Mail':
            return val.toLowerCase();

        default:
            // Standar: Hapus protokol untuk tautan lain
            return val.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    }
};
