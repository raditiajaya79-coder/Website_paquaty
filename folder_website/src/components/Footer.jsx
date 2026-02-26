import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

/**
 * Footer — PT. Bala Aditi Pakuaty
 */
const Footer = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-[#E7E5E4]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/images/pure logo pakuaty.png" alt="Pakuaty" className="h-10 object-contain" />
                        </div>
                        <p className="text-[#78716C] leading-relaxed mb-4">
                            Connecting the world's finest organic farmers with conscientious global markets. Quality, transparency, and trust in every shipment.
                        </p>
                        <p className="text-sm text-[#78716C] leading-relaxed">
                            {COMPANY_INFO.address}
                        </p>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-16 w-full md:w-auto md:ml-auto">
                        <div>
                            <h4 className="font-medium text-[#1C1917] mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><Link to="/about" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">About</Link></li>
                                <li><Link to="/products" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Products</Link></li>
                                <li><Link to="/contact" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#1C1917] mb-6">Contact</h4>
                            <ul className="space-y-4">
                                <li><a href="https://wa.me/6281287990370" target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Sales</a></li>
                                <li><a href="https://wa.me/6282142205147" target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Partnerships</a></li>
                                <li><a href={`mailto:${COMPANY_INFO.email}`} className="text-[#78716C] hover:text-[#A3B14B] transition-colors">{COMPANY_INFO.email}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#1C1917] mb-6">Legal</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Terms</a></li>
                                <li><a href="#" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E7E5E4] gap-4">
                    <p className="text-sm text-[#78716C]">© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href={COMPANY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-[#A3B14B]"><Instagram className="w-5 h-5" /></a>
                        <a href={COMPANY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-[#78716C] hover:text-[#A3B14B]"><Facebook className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
