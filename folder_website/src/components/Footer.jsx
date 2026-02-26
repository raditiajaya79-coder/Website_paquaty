import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

/**
 * Footer — Reverted to Template Design
 */
const Footer = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-[#E7E5E4]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-[#A3B14B] rounded-full"></div>
                            <span className="text-lg font-medium text-[#1C1917]">Pakuaty</span>
                        </div>
                        <p className="text-[#78716C] leading-relaxed">
                            Connecting the world's finest organic farmers with conscientious global markets. Quality, transparency, and trust in every shipment.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
                        <div>
                            <h4 className="font-medium text-[#1C1917] mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">About</a></li>
                                <li><a href="#" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">Careers</a></li>
                                <li><a href="#" className="text-[#78716C] hover:text-[#A3B14B] transition-colors">News</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#1C1917] mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" class="text-[#78716C] hover:text-[#A3B14B] transition-colors">Market Report</a></li>
                                <li><a href="#" class="text-[#78716C] hover:text-[#A3B14B] transition-colors">Shipping</a></li>
                                <li><a href="#" class="text-[#78716C] hover:text-[#A3B14B] transition-colors">Quality Guidelines</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-medium text-[#1C1917] mb-6">Legal</h4>
                            <ul className="space-y-4">
                                <li><a href="#" class="text-[#78716C] hover:text-[#A3B14B] transition-colors">Terms</a></li>
                                <li><a href="#" class="text-[#78716C] hover:text-[#A3B14B] transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E7E5E4] gap-4">
                    <p className="text-sm text-[#78716C]">© {new Date().getFullYear()} Pakuaty Global. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[#78716C] hover:text-[#A3B14B]"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="text-[#78716C] hover:text-[#A3B14B]"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-[#78716C] hover:text-[#A3B14B]"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
