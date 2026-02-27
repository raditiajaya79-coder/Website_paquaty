import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

/**
 * Footer — Template style, compact, with brand accents
 */
const Footer = () => {
    return (
        <footer className="bg-white pt-14 pb-8 border-t border-stone-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/images/pure logo pakuaty.png" alt="Pakuaty" className="h-10 object-contain" />
                        </div>
                        <p className="text-[#78716C] leading-relaxed text-sm">
                            Connecting the world's finest organic farmers with conscientious global markets. Quality, transparency, and trust in every shipment.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-12">
                        <div>
                            <h4 className="font-medium text-stone-dark mb-4 text-sm">Company</h4>
                            <ul className="space-y-3">
                                <li><Link to="/about" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">About</Link></li>
                                <li><Link to="/products" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Products</Link></li>
                                <li><Link to="/contact" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-stone-dark mb-4 text-sm">Contact</h4>
                            <ul className="space-y-3">
                                <li><a href="https://wa.me/6281287990370" target="_blank" rel="noopener noreferrer" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Sales</a></li>
                                <li><a href="https://wa.me/6282142205147" target="_blank" rel="noopener noreferrer" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Partnerships</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-stone-dark mb-4 text-sm">Legal</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Terms</a></li>
                                <li><a href="#" className="text-[#78716C] text-sm hover:text-brand-blue transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-stone-border gap-4">
                    <p className="text-sm text-[#78716C]">© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href={COMPANY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-brand-blue transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href={COMPANY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-brand-blue transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#78716C] hover:text-brand-blue transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
