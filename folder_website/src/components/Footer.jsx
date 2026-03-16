import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';
const Footer = () => {
    const { t } = useLanguage();
    const [footerContacts, setFooterContacts] = useState([]);

    // Custom SVG Logo Mapping for Footer (Slightly larger and branded)
    const FooterBrandIcons = {
        Instagram: () => (
            <svg viewBox="0 0 24 24" fill="url(#ig-grad-footer)" className="w-5 h-5">
                <defs>
                    <linearGradient id="ig-grad-footer" x1="100%" y1="0%" x2="0%" y2="100%">
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
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        WhatsApp: () => (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]">
                <rect width="24" height="24" rx="5.5" fill="currentColor" />
                <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
            </svg>
        ),
        Tiktok: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.63 3.26-1.78 4.41-1.24 1.25-3.03 1.96-4.8 1.89-1.76-.08-3.41-.89-4.54-2.2-1.17-1.35-1.72-3.17-1.52-4.94.2-1.76 1.11-3.32 2.51-4.4 1.41-1.09 3.22-1.52 4.96-1.19.16.03.32.07.48.11V5.09c0-1.69.01-3.38.01-5.07zm-2.02 8.71c-1.47.01-2.92.57-4 1.55-1.03.95-1.63 2.34-1.67 3.75-.02 1.48.51 2.92 1.48 4.02.99 1.11 2.45 1.75 3.96 1.79 1.5.03 2.97-.53 4.07-1.53 1.05-.96 1.67-2.33 1.72-3.76.01-1.89.01-3.79.02-5.69-.17-.03-.35-.06-.52-.08-1.5-.15-3.02.02-4.4.67-.23.11-.44.24-.66.38z" />
            </svg>
        ),
        Twitter: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        Mail: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-dark">
                <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
            </svg>
        ),
        // Phone: ikon telepon klasik (gagang telepon), BUKAN WhatsApp
        Phone: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        MessageCircle: () => (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]">
                <rect width="24" height="24" rx="5.5" fill="currentColor" />
                <path fill="white" d="M12.022 5.09a7.221 7.221 0 0 0-6.173 10.98L5 19.182l3.201-.849A7.222 7.222 0 1 0 12.022 5.09zm3.84 9.873c-.167.472-.962.9-1.332.964-.343.06-.807.135-2.288-.445-1.78-.696-2.91-2.522-2.997-2.639-.089-.116-.714-.954-.714-1.819 0-.866.452-1.292.612-1.464.159-.172.348-.215.464-.215.116 0 .231.002.334.007.108.005.253-.042.395.302.146.353.498 1.221.543 1.312.046.091.076.198.018.314-.058.116-.089.186-.176.288-.088.102-.186.216-.264.301-.083.089-.172.188-.073.359.1.171.445.735.955 1.192.658.59 1.218.775 1.391.861.173.086.275.073.376-.044.101-.116.435-.508.551-.682.115-.174.23-.145.388-.086.159.059 1.003.473 1.176.56.173.085.289.128.332.2.043.071.043.411-.124.883z" />
            </svg>
        ),
        // Shopee logo oranye
        Shopee: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#EE4D2D]">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.537-.194 1.006.131.828.94z" />
            </svg>
        ),
        // Globe ikon generik
        Globe: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-brand-blue">
                <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
            </svg>
        )
    };

    useEffect(() => {
        const fetchFooterContacts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/contact`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        // Filter yang show_in_footer
                        const footerItems = data.filter(item => item.show_in_footer === 1 || item.show_in_footer === true);
                        setFooterContacts(footerItems);
                    }
                }
            } catch (err) {
                console.error("Gagal memuat kontak di Footer", err);
            }
        };
        fetchFooterContacts();
    }, []);

    return (
        <footer className="bg-[#F1E4C3] pt-16 pb-12 border-t-2 border-brand-gold/60 relative overflow-hidden">
            {/* Soft Ambient Glows */}
            <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-8">
                    <div className="max-w-md">
                        <Link to="/" className="inline-block mb-3 group">
                            <img
                                src="/images/pure logo pakuaty.png"
                                alt="Pakuaty"
                                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        </Link>
                        <p className="text-stone-dark/70 leading-relaxed text-sm font-light max-w-sm mb-4">
                            {t('footer.desc')}
                        </p>

                        {/* Dynamic Social Icons in main footer area */}
                        <div className="flex gap-4">
                            {footerContacts.map(contact => {
                                const BrandIcon = FooterBrandIcons[contact.icon];
                                // Smart URL generator: admin cukup masukkan data mentah
                                const val = (contact.value || '').trim();
                                let href = val; // Default: pakai value apa adanya
                                // Jika sudah URL lengkap, langsung pakai
                                if (!val.startsWith('http://') && !val.startsWith('https://')) {
                                    // Generate URL berdasarkan platform
                                    if (contact.icon === 'Mail') href = `mailto:${val}`;
                                    else if (contact.icon === 'WhatsApp' || contact.icon === 'MessageCircle') {
                                        let num = val.replace(/\D/g, '');
                                        if (num.startsWith('0')) num = '62' + num.slice(1);
                                        href = `https://wa.me/${num}`;
                                    }
                                    else if (contact.icon === 'Phone') {
                                        let num = val.replace(/\D/g, '');
                                        if (num.startsWith('0')) num = '62' + num.slice(1);
                                        href = `tel:+${num}`;
                                    }
                                    else if (contact.icon === 'Instagram') href = `https://instagram.com/${val.replace(/^@/, '')}`;
                                    else if (contact.icon === 'Facebook') href = `https://facebook.com/${val.replace(/^@/, '')}`;
                                    else if (contact.icon === 'Tiktok') href = `https://tiktok.com/${val.startsWith('@') ? val : '@' + val}`;
                                    else if (contact.icon === 'Twitter') href = `https://x.com/${val.replace(/^@/, '')}`;
                                    else if (contact.icon === 'Shopee' || contact.icon === 'ShoppingBag') href = `https://shopee.co.id/${val}`;
                                    else href = `https://${val}`;
                                }
                                return (
                                    <a
                                        key={contact.id}
                                        href={href}
                                        target={contact.icon === 'Mail' || contact.icon === 'Phone' ? '_self' : '_blank'}
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-brand-gold/30 group"
                                    >
                                        {BrandIcon ? <BrandIcon /> : <div className="w-5 h-5 bg-stone-200 rounded-full" />}
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-12 sm:gap-x-20">
                        <div>
                            <h4 className="font-bold text-brand-blue mb-4 text-[10px] uppercase tracking-[0.3em]">{t('footer.col1_title')}</h4>
                            <ul className="space-y-4">
                                <li><Link to="/about" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.link_about')}</Link></li>
                                <li><Link to="/products" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.link_products')}</Link></li>
                                <li><Link to="/gallery" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.link_gallery')}</Link></li>
                                <li><Link to="/contact" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.link_contact')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-blue mb-4 text-[10px] uppercase tracking-[0.3em]">{t('footer.col2_title')}</h4>
                            <ul className="space-y-4">
                                <li><a href="https://wa.me/6281287990370" target="_blank" rel="noopener noreferrer" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.inquiry_sales')}</a></li>
                                <li><a href="https://wa.me/6282142205147" target="_blank" rel="noopener noreferrer" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.inquiry_global')}</a></li>
                                <li><Link to="/certificates" className="text-stone-dark/60 text-sm hover:text-brand-gold font-medium transition-colors">{t('footer.inquiry_certs')}</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-bold text-brand-blue mb-4 text-[10px] uppercase tracking-[0.3em]">{t('footer.col3_title')}</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-stone-dark/50 text-sm hover:text-brand-gold transition-colors">{t('footer.legal_terms')}</a></li>
                                <li><a href="#" className="text-stone-dark/50 text-sm hover:text-brand-gold transition-colors">{t('footer.legal_privacy')}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t-2 border-brand-gold/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-stone-dark/30 uppercase tracking-[0.2em] text-center md:text-left">
                        © {new Date().getFullYear()} {COMPANY_INFO.name}.
                        <span className="hidden sm:inline mx-2">•</span>
                        {t('footer.motto_suffix')}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-brand-gold animate-pulse"></div>
                        <p className="text-[9px] font-black text-stone-dark/40 uppercase tracking-widest">{t('footer.copyright')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
