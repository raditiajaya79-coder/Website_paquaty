import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, Phone, Mail, Globe, ShoppingBag, Video, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';
const Navbar = () => {
    const { lang, switchLang, t } = useLanguage();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasCertificates, setHasCertificates] = useState(false);
    const [headerContacts, setHeaderContacts] = useState([]); // Menampung kontak untuk header

    // Custom SVG Logo Mapping
    const NavbarBrandIcons = {
        Instagram: () => (
            <svg viewBox="0 0 24 24" fill="url(#ig-grad-nav)" className="w-4 h-4 md:w-5 md:h-5">
                <defs>
                    <linearGradient id="ig-grad-nav" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#405de6" />
                        <stop offset="25%" stopColor="#5851db" />
                        <stop offset="50%" stopColor="#833ab4" />
                        <stop offset="75%" stopColor="#c13584" />
                        <stop offset="90%" stopColor="#e1306c" />
                        <stop offset="100%" stopColor="#fd1d1d" />
                    </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        Facebook: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#1877F2' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        WhatsApp: () => (
            <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 text-[#25D366]">
                <rect width="24" height="24" rx="5.5" fill="currentColor" />
                <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
            </svg>
        ),
        Tiktok: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#000000' }}>
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.63 3.26-1.78 4.41-1.24 1.25-3.03 1.96-4.8 1.89-1.76-.08-3.41-.89-4.54-2.2-1.17-1.35-1.72-3.17-1.52-4.94.2-1.76 1.11-3.32 2.51-4.4 1.41-1.09 3.22-1.52 4.96-1.19.16.03.32.07.48.11V5.09c0-1.69.01-3.38.01-5.07zm-2.02 8.71c-1.47.01-2.92.57-4 1.55-1.03.95-1.63 2.34-1.67 3.75-.02 1.48.51 2.92 1.48 4.02.99 1.11 2.45 1.75 3.96 1.79 1.5.03 2.97-.53 4.07-1.53 1.05-.96 1.67-2.33 1.72-3.76.01-1.89.01-3.79.02-5.69-.17-.03-.35-.06-.52-.08-1.5-.15-3.02.02-4.4.67-.23.11-.44.24-.66.38z" />
            </svg>
        ),
        Twitter: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#000000' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        Shopee: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#EE4D2D' }}>
                <path d="M7.747 16.335c0 1.218 1.413 2.15 3.985 2.15 2.89 0 3.846-1.125 3.846-2.15 0-.89-.861-1.47-3.003-1.859l-2.016-.372c-2.455-.45-3.69-1.545-3.69-3.416 0-2.333 2.05-3.956 5.09-3.956 3.19 0 4.885 1.77 4.885 3.88h-3.03c0-.98-.823-1.688-2.004-1.688-1.423 0-2.04.646-2.04 1.446 0 .806.777 1.258 2.21 1.503l2.808.513c2.407.45 3.69 1.55 3.69 3.518 0 2.288-1.956 4.148-5.32 4.148-3.06 0-5.463-1.413-5.463-4.147l3.052.23zM23.116 8.44L14.475 1A2.5 2.5 0 0012 0a2.5 2.5 0 00-2.475 1L.884 8.44C.358 8.892 0 9.535 0 10.237v9.42c0 1.94 1.573 3.512 3.513 3.512h16.974c1.94 0 3.513-1.572 3.513-3.513v-9.42c0-.702-.358-1.345-.884-1.797z" />
            </svg>
        ),
        Phone: () => <Phone className="w-4 h-4 text-brand-blue" />,
        Mail: () => <Mail className="w-4 h-4 text-brand-blue" />,
        Globe: () => <Globe className="w-4 h-4 text-brand-blue" />,
        ShoppingBag: () => <ShoppingBag className="w-4 h-4 text-brand-blue" />,
        Video: () => <Video className="w-4 h-4 text-brand-blue" />,
        MessageCircle: () => <MessageCircle className="w-4 h-4 text-brand-blue" />,
        LinkIcon: () => <LinkIcon className="w-4 h-4 text-brand-blue" />,
        Default: () => <Globe className="w-4 h-4 text-stone-dark/40" />
    };

    // Mengecek apakah ada sertifikat aktif dan kontak untuk header/footer
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Fetch Global Settings (Master Switch)
                const settingsResponse = await fetch(`${API_BASE_URL}/settings`);
                let isMasterEnabled = true;

                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json();
                    if (settings && typeof settings.show_certificates !== 'undefined') {
                        isMasterEnabled = settings.show_certificates;
                    }
                }

                // 2. Fetch Sertifikat (Hanya untuk pengecekan data aktif jika master switch ON)
                const certResponse = await fetch(`${API_BASE_URL}/certificates`);
                if (certResponse.ok) {
                    const certData = await certResponse.json();

                    // Logika: 
                    // - Master Switch (Admin) harus ON
                    // - DAN (Data Kosong/Placeholder ATAU Ada minimal 1 yang aktif)
                    const hasActiveCert = Array.isArray(certData) && certData.length > 0 && certData.some(cert => !!cert.is_active);
                    const isEmpty = Array.isArray(certData) && certData.length === 0;

                    setHasCertificates(isMasterEnabled && (isEmpty || hasActiveCert));
                }

                // 2. Fetch Contacts untuk Navigasi (Header)
                const contactResponse = await fetch(`${API_BASE_URL}/contact`);
                if (contactResponse.ok) {
                    const contactData = await contactResponse.json();
                    if (Array.isArray(contactData)) {
                        const headerItems = contactData.filter(item => item.show_in_header === 1 || item.show_in_header === true);
                        setHeaderContacts(headerItems);
                    }
                }
            } catch (err) {
                console.error("Gagal memuat data awal Navbar", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50); // Scroll > 50px → solid background
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'; // Kunci scroll
        } else {
            document.body.style.overflow = 'unset'; // Lepas scroll
        }
    }, [isMenuOpen]);

    // Navbar transparan jika sedang di Home DAN belum di-scroll
    const isTransparent = isHome && !isScrolled;

    // Style untuk link navbar (active/inactive + transparent/solid mode)
    const activeStyle = ({ isActive }) => {
        const base = "text-sm font-medium transition-all duration-300 relative group";
        if (isTransparent) {
            return `${base} ${isActive ? 'text-white' : 'text-white/80 hover:text-white hover:scale-105'}`;
        }
        return `${base} ${isActive ? 'text-brand-blue' : 'text-stone-dark/60 hover:text-brand-cyan hover:scale-105'}`;
    };

    // Link Navbar — Tampilkan Sertifikasi jika tabel kosong (placeholder) ATAU ada sertifikat aktif.
    // Hanya disembunyikan jika ada data tapi semuanya non-aktif (dimatikan manual oleh admin).
    const navLinks = [
        { name: t('nav.products'), path: "/products" },
        { name: t('nav.about'), path: "/about" },
        { name: t('nav.gallery'), path: "/gallery" },
        ...(hasCertificates ? [{ name: t('nav.certificates'), path: "/certificates" }] : []),
        { name: t('nav.events'), path: "/events" },
        { name: t('nav.contact'), path: "/contact" }
    ];

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isTransparent
            ? 'bg-transparent border-transparent py-2'
            : 'bg-white/90 backdrop-blur-xl border-b border-stone-border/50 py-0 shadow-soft'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
                <Link to="/" className="flex gap-3 items-center group relative">
                    {/* Logo Glow Effect — Enhanced for WOW impact */}
                    <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/20 blur-2xl rounded-full transition-all duration-700 -z-10" />
                    <img
                        src="/images/pure logo pakuaty.png"
                        alt="Pakuaty"
                        className={`h-9 md:h-11 object-contain group-hover:scale-105 transition-all duration-500 ${isTransparent ? 'brightness-[1.2] contrast-[1.1]' : ''}`}
                    />
                </Link>

                {/* Navbar links — otomatis menyesuaikan berdasarkan hasCertificates */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path} className={activeStyle}>
                            {({ isActive }) => (
                                <>
                                    {link.name}
                                    {/* Zero-Shift Indicator Dot */}
                                    <motion.span
                                        initial={false}
                                        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                                        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isTransparent ? 'bg-white' : 'bg-brand-blue'}`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-4">

                    {/* Language Switcher */}
                    <div className={`flex items-center gap-1 p-1 rounded-full transition-all duration-500 border-2 ${isTransparent ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-border/30'}`}>
                        <button
                            onClick={() => switchLang('en')}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest transition-all duration-300 ${lang === 'en'
                                ? 'bg-brand-gold text-stone-dark shadow-sm'
                                : (isTransparent ? 'text-white/40 hover:text-white' : 'text-stone-dark/40 hover:text-stone-dark')
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => switchLang('id')}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest transition-all duration-300 ${lang === 'id'
                                ? 'bg-brand-gold text-stone-dark shadow-sm'
                                : (isTransparent ? 'text-white/40 hover:text-white' : 'text-stone-dark/40 hover:text-stone-dark')
                                }`}
                        >
                            ID
                        </button>
                    </div>

                    <Link
                        to="/contact"
                        className={`hidden lg:flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 shadow-xl active:scale-95 ${isTransparent
                            ? 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-brand-cyan hover:text-white hover:border-brand-cyan'
                            : 'bg-brand-blue text-white hover:bg-brand-cyan hover:shadow-brand-cyan/30 shadow-brand-blue/10'
                            }`}
                    >
                        {t('nav.partner')}
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden z-50 p-2 transition-all duration-500 rounded-full ${isMenuOpen ? 'bg-white/10 text-brand-gold rotate-90 shadow-[0_0_20px_rgba(255,237,0,0.2)]' : (isTransparent ? 'text-white' : 'text-stone-dark')}`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay — Floating Glassmorphism Experience */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 10, y: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: 10, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-20 right-4 w-[65vw] max-w-[240px] bg-white/75 backdrop-blur-3xl z-[120] md:hidden flex flex-col py-6 px-6 rounded-[1.5rem] border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden"
                    >
                        <div className="flex flex-col gap-2 relative z-10">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => `text-lg font-bold tracking-tight transition-all duration-300 flex items-center gap-2 ${isActive ? 'text-brand-cyan' : 'text-stone-dark hover:text-brand-cyan'}`}
                                    >
                                        <span className="text-[7px] font-black text-brand-gold">0{idx + 1}</span>
                                        {link.name}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-center gap-4 py-3 bg-stone-50/50 rounded-xl mb-4">
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${lang === 'en' ? 'bg-brand-gold text-stone-dark shadow-sm' : 'text-stone-dark/30'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => switchLang('id')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${lang === 'id' ? 'bg-brand-gold text-stone-dark shadow-sm' : 'text-stone-dark/30'}`}
                            >
                                ID
                            </button>
                        </div>


                        {/* Mobile Header Contacts — Restored Original Circle Style */}
                        {headerContacts.length > 0 && (
                            <div className="flex justify-center gap-4 mb-4 relative z-10">
                                {headerContacts.map((contact, idx) => {
                                    const BrandIcon = NavbarBrandIcons[contact.icon];
                                    return (
                                        <motion.a
                                            key={contact.id}
                                            href={(contact.value && contact.value.startsWith('http')) ? contact.value : (contact.icon === 'Phone' ? `tel:${contact.value}` : (contact.icon === 'Mail' ? `mailto:${contact.value}` : `https://${contact.value}`))}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + (idx * 0.05) }}
                                            className="p-2.5 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-stone-dark hover:scale-110 active:scale-95 transition-all"
                                        >
                                            {BrandIcon ? <BrandIcon /> : <NavbarBrandIcons.Default />}
                                        </motion.a>
                                    )
                                })}
                            </div>
                        )}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="relative z-10"
                        >
                            <Link to="/contact" className="w-full py-3 bg-brand-gold text-stone-dark rounded-full font-black text-[7px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
                                {t('nav.connect')}
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
