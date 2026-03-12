import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
const Navbar = () => {
    const { lang, switchLang, t } = useLanguage();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Set true agar link "Sertifikasi" tetap muncul di mode statis
    const [hasCertificates, setHasCertificates] = useState(true);

    // Scroll listener untuk efek transparansi
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
            return `${base} ${isActive ? 'text-brand-blue' : 'text-stone-dark/80 hover:text-brand-cyan hover:scale-105'}`;
        }
        return `${base} ${isActive ? 'text-brand-blue' : 'text-stone-dark/60 hover:text-brand-cyan hover:scale-105'}`;
    };

    // Daftar link navbar — filter "Sertifikasi" jika tidak ada sertifikat aktif
    const navLinks = [
        { name: t('nav.products'), path: "/products" },
        { name: t('nav.about'), path: "/about" },
        { name: t('nav.gallery'), path: "/gallery" },
        // Hanya tampilkan "Sertifikasi" jika ada sertifikat aktif
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
                        className={`md:hidden z-50 p-2 transition-all duration-500 rounded-full ${isMenuOpen ? 'bg-white/10 text-brand-gold rotate-90 shadow-[0_0_20_rgba(255,237,0,0.2)]' : (isTransparent ? 'text-white' : 'text-stone-dark')}`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay — Floating Glassmorphism Experience */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 10, y: -10 }}
                animate={{
                    opacity: isMenuOpen ? 1 : 0,
                    scale: isMenuOpen ? 1 : 0.95,
                    x: isMenuOpen ? 0 : 10,
                    y: isMenuOpen ? 0 : -10,
                    pointerEvents: isMenuOpen ? 'auto' : 'none'
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-20 right-4 w-[65vw] max-w-[240px] bg-white/75 backdrop-blur-3xl z-[120] md:hidden flex flex-col py-6 px-6 rounded-[1.5rem] border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden"
            >
                {/* Mobile nav links — juga otomatis menyesuaikan */}
                <div className="flex flex-col gap-2 relative z-10">
                    {navLinks.map((link, idx) => (
                        <motion.div
                            key={link.path}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 5 }}
                            transition={{ delay: 0.05 + (idx * 0.03) }}
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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMenuOpen ? 1 : 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-4 relative z-10"
                >
                    <button className="w-full py-3 bg-brand-gold text-stone-dark rounded-full font-black text-[7px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
                        Connect
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </motion.div>
            </motion.div >
        </nav >
    );
};

export default Navbar;
