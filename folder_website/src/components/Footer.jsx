import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

/**
 * Footer — Template style, compact, with brand accents
 */
import { useLanguage } from '../context/LanguageContext';

/**
 * Footer — Template style, compact, with brand accents
 */
const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-brand-cream pt-20 pb-4 border-t border-brand-gold/20 relative overflow-hidden">
            {/* Subtle Brand Mesh Fragment */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 blur-[100px] rounded-full -mr-20 -mb-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-blue/5 blur-[80px] rounded-full -ml-32 -mt-32 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/images/pure logo pakuaty.png" alt="Pakuaty" className="h-10 object-contain" />
                        </div>
                        <p className="text-[#78716C] leading-relaxed text-sm">
                            {t('footer.desc')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-16">
                        <div>
                            <h4 className="font-bold text-stone-dark mb-8 text-[10px] uppercase tracking-[0.3em]">{t('footer.col1_title')}</h4>
                            <ul className="space-y-4">
                                <li><Link to="/about" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300 flex items-center gap-2 group/link"><div className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity" /> {t('footer.link_about')}</Link></li>
                                <li><Link to="/products" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300 flex items-center gap-2 group/link"><div className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity" /> {t('footer.link_products')}</Link></li>
                                <li><Link to="/gallery" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300 flex items-center gap-2 group/link"><div className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity" /> {t('footer.link_gallery')}</Link></li>
                                <li><Link to="/contact" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300 flex items-center gap-2 group/link"><div className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity" /> {t('footer.link_contact')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-dark mb-8 text-[10px] uppercase tracking-[0.3em]">{t('footer.col2_title')}</h4>
                            <ul className="space-y-4">
                                <li><a href="https://wa.me/6281287990370" target="_blank" rel="noopener noreferrer" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300">{t('footer.inquiry_sales')}</a></li>
                                <li><a href="https://wa.me/6282142205147" target="_blank" rel="noopener noreferrer" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300">{t('footer.inquiry_global')}</a></li>
                                <li><Link to="/certificates" className="text-stone-dark/70 text-sm hover:text-brand-cyan transition-all duration-300">{t('footer.inquiry_certs')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-dark mb-8 text-[10px] uppercase tracking-[0.3em]">{t('footer.col3_title')}</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-stone-dark/60 text-sm hover:text-brand-blue transition-all duration-300">{t('footer.legal_terms')}</a></li>
                                <li><a href="#" className="text-stone-dark/60 text-sm hover:text-brand-blue transition-all duration-300">{t('footer.legal_privacy')}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-stone-border/30 gap-6">
                    <p className="text-xs font-bold text-stone-dark/30 uppercase tracking-widest">© {new Date().getFullYear()} {COMPANY_INFO.name}. {t('footer.motto_suffix')} {t('footer.copyright')}</p>
                    <div className="flex gap-4">
                        <a href={COMPANY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-50 border border-stone-border/30 flex items-center justify-center text-stone-dark hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"><Instagram className="w-4 h-4" /></a>
                        <a href={COMPANY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-50 border border-stone-border/30 flex items-center justify-center text-stone-dark hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"><Facebook className="w-4 h-4" /></a>
                        <a href={`mailto:${COMPANY_INFO.email}`} className="w-10 h-10 rounded-full bg-neutral-50 border border-stone-border/30 flex items-center justify-center text-stone-dark hover:bg-stone-dark hover:text-white hover:border-stone-dark transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"><Mail className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
