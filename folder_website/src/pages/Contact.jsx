import { useState, useEffect } from 'react'; // React hooks untuk state dan side-effect
import { Helmet } from 'react-helmet-async'; // SEO meta tags
import { motion } from 'framer-motion'; // Animasi scroll reveal
import { Mail, Phone, Send, Clock, Globe, MapPin } from 'lucide-react'; // Ikon Lucide
import { generatePageTitle } from '../utils/seo'; // Utilitas SEO
import { useLanguage } from '../context/LanguageContext'; // Multi-bahasa
import { generateContactHref, generateContactLabel } from '../utils/contact'; // Utilitas standarisasi kontak
// Mengambil data dari GlobalDataContext (sudah di-preload saat awal)
import { useGlobalData } from '../context/GlobalDataContext';

/**
 * ContactBrandIcons — Mapping nama ikon dari database ke komponen SVG brand asli.
 * Digunakan agar ikon yang tampil di halaman Contact konsisten dengan Footer.
 * Key = string `icon` dari tabel `contact` di database.
 */
const ContactBrandIcons = {
    // Instagram: logo gradasi resmi
    Instagram: () => (
        <svg viewBox="0 0 24 24" fill="url(#contact-ig-grad)" className="w-5 h-5">
            <defs>
                <linearGradient id="contact-ig-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#405de6" />
                    <stop offset="50%" stopColor="#833ab4" />
                    <stop offset="100%" stopColor="#fd1d1d" />
                </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    // Facebook: logo biru resmi
    Facebook: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1877F2]">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    // WhatsApp: logo hijau resmi dengan background rounded
    WhatsApp: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]">
            <rect width="24" height="24" rx="5.5" fill="currentColor" />
            <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
        </svg>
    ),
    // Phone: ikon telepon klasik (gagang)
    Phone: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    // MessageCircle: alias untuk WhatsApp (beberapa DB pakai ini)
    MessageCircle: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]">
            <rect width="24" height="24" rx="5.5" fill="currentColor" />
            <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
        </svg>
    ),
    // Mail: ikon amplop surat
    Mail: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-dark">
            <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    // Tiktok: logo hitam
    Tiktok: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.63 3.26-1.78 4.41-1.24 1.25-3.03 1.96-4.8 1.89-1.76-.08-3.41-.89-4.54-2.2-1.17-1.35-1.72-3.17-1.52-4.94.2-1.76 1.11-3.32 2.51-4.4 1.41-1.09 3.22-1.52 4.96-1.19v4.38c-.68-.17-1.44-.1-2.07.22-.63.32-1.13.84-1.39 1.49-.26.65-.27 1.38 0 2.04.27.66.79 1.18 1.43 1.49.64.31 1.38.37 2.07.17.69-.2 1.27-.64 1.64-1.23.37-.59.52-1.3.42-1.99V.02h.01z" />
        </svg>
    ),
    // Twitter/X: logo X hitam
    Twitter: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    // Shopee: logo oranye
    Shopee: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#EE4D2D]">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.537-.194 1.006.131.828.94z" />
        </svg>
    ),
    // Globe: ikon website generik
    Globe: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-brand-blue">
            <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
        </svg>
    )
};


const Contact = () => {
    const { t } = useLanguage(); // Hook multi-bahasa
    // Ambil contacts dan settings dari data yang sudah di-preload
    const { contacts: allContacts, settings: globalSettings } = useGlobalData();

    // Filter kontak yang show_in_header (sama seperti logic sebelumnya)
    const contacts = (allContacts || []).filter(item => item.show_in_header === 1 || item.show_in_header === true);

    // Merge settings dengan default values untuk jam operasional
    const settings = {
        hours_mon_fri: '09:00 - 18:00',
        hours_sat: '09:00 - 13:00',
        ...globalSettings
    };

    // Animasi scroll-reveal untuk elemen-elemen halaman
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.contact_title'))}</title>
                <meta name="description" content={t('seo.contact_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-32 pb-24 relative overflow-hidden selection:bg-brand-gold/30 selection:text-stone-dark">
                {/* Background Textures & Glows */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 xl:gap-24 items-start">

                        {/* LEFT PANEL : Typography & Contact Info */}
                        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="pt-8 lg:pt-16">
                            {/* Label badge */}
                            <span className="inline-block text-[9px] font-black tracking-[0.3em] uppercase text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full mb-8">
                                {t('contact.header_label')}
                            </span>
                            {/* Heading utama */}
                            <h1 className="text-[clamp(1.5rem,6vw,3.75rem)] font-light text-stone-dark tracking-tighter mb-8 leading-[1.1] flex items-baseline gap-2 whitespace-nowrap">
                                {t('contact.header_title')}
                                <span className="italic font-serif text-brand-gold text-[clamp(2rem,6vw,4.5rem)]">{t('contact.header_title_accent')}</span>
                            </h1>
                            {/* Sub-heading deskripsi */}
                            <p className="text-base sm:text-lg text-stone-dark/60 font-light leading-relaxed max-w-lg mb-12 sm:mb-16">
                                {t('contact.header_desc')}
                            </p>

                            <div className="space-y-10">
                                {/* Alamat Kantor — tetap hardcoded karena bukan bagian tabel contact */}
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold tracking-widest uppercase text-stone-dark mb-2">{t('contact.office_title')}</h4>
                                        <p className="text-stone-dark/60 font-medium leading-relaxed">
                                            Jl. Veteran No.15 B<br />
                                            Kota Kediri 64114, Jawa Timur<br />
                                            Indonesia
                                        </p>
                                    </div>
                                </div>

                                {/* Kontak Dinamis — di-render dari data API */}
                                {contacts.map(contact => {
                                    // Ambil komponen ikon SVG dari mapping, fallback ke Globe jika tidak ditemukan
                                    const BrandIcon = ContactBrandIcons[contact.icon];
                                    const href = generateContactHref(contact); // Generate URL yang tepat

                                    return (
                                        <a
                                            key={contact.id}
                                            href={href}
                                            target={contact.icon === 'Mail' || contact.icon === 'Phone' ? '_self' : '_blank'}
                                            rel="noopener noreferrer"
                                            className="flex gap-4 sm:gap-6 group cursor-pointer block"
                                        >
                                            {/* Ikon dalam lingkaran — hover effect gold */}
                                            <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shrink-0">
                                                {BrandIcon ? <BrandIcon /> : <Globe className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                {/* Nama platform dari database */}
                                                <h4 className="text-sm font-bold tracking-widest uppercase text-stone-dark mb-2">{contact.platform}</h4>
                                                {/* Nilai kontak (URL/nomor/email) yang sudah distandarisasi */}
                                                <p className="text-sm sm:text-base text-stone-dark/60 font-medium leading-relaxed group-hover:text-brand-blue transition-colors break-all sm:break-normal">
                                                    {generateContactLabel(contact)}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>


                        </motion.div>

                        {/* RIGHT PANEL : Floating Contact Form */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                            className="relative lg:mt-10 space-y-8"
                        >
                            {/* Working Hours Mini Card — moved from left to right panel */}
                            <div className="p-8 bg-white/50 backdrop-blur-md border border-stone-200/50 rounded-[2rem] relative overflow-hidden group shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <Clock className="w-4 h-4 text-brand-gold" />
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-blue">{t('contact.hours_label')}</span>
                                </div>
                                <div className="space-y-3 text-sm relative z-10">
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200/50">
                                        <span className="text-stone-dark/60 font-medium">{t('contact.monday_friday')}</span>
                                        <span className="text-brand-blue font-bold tracking-widest">{settings.hours_mon_fri}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-dark/60 font-medium">{t('contact.saturday')}</span>
                                        <span className="text-brand-blue font-bold tracking-widest">{settings.hours_sat}</span>
                                    </div>
                                    <p className="text-[9px] text-stone-dark/40 font-bold uppercase tracking-widest pt-3 text-right">{t('contact.time_zone')}</p>
                                </div>
                            </div>

                            {/* Dekoratif background blur di belakang form */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-blue/10 blur-2xl rounded-[3rem] -z-10" />

                            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 md:p-14 rounded-[2rem] sm:rounded-[3rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply group-hover:bg-brand-gold/20 transition-all duration-700"></div>

                                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-brand-blue mb-10 border-b border-stone-200/50 pb-6">
                                    {t('contact.form_title')}
                                </h3>

                                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        {/* Input Nama */}
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                id="name"
                                                className="peer w-full bg-transparent border-b border-stone-300 py-4 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold transition-colors"
                                                placeholder="John Doe"
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute left-0 -top-3.5 text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:font-bold"
                                            >
                                                {t('contact.form_name')}
                                            </label>
                                        </div>

                                        {/* Input Email */}
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                id="email"
                                                className="peer w-full bg-transparent border-b border-stone-300 py-4 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold transition-colors"
                                                placeholder="john@company.com"
                                                required
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-0 -top-3.5 text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:font-bold"
                                            >
                                                {t('contact.form_email')}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Textarea Pesan */}
                                    <div className="relative group/input pt-4">
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="peer w-full bg-stone-50/50 border border-stone-200 rounded-2xl p-6 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold focus:bg-white transition-all resize-none"
                                            placeholder={t('contact.form_message_placeholder')}
                                            required
                                        ></textarea>
                                        <label
                                            htmlFor="message"
                                            className="absolute left-6 -top-2 px-2 bg-white text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-medium peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:bg-white peer-focus:font-bold"
                                        >
                                            {t('contact.form_message')}
                                        </label>
                                    </div>

                                    {/* Tombol Submit dengan efek glare */}
                                    <button className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-stone-dark transition-all duration-500 shadow-xl shadow-brand-blue/20 hover:shadow-brand-gold/40 flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                                        <span className="relative z-10">{t('contact.form_submit')}</span>
                                        <Send className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2" />
                                        {/* Hover glare effect */}
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[glare_1s_ease-in-out]" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
