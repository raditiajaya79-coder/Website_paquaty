import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';

/**
 * Navbar — Reverted to Template Design + Pakuaty Branding
 */
const Navbar = () => {
    const activeStyle = ({ isActive }) =>
        `text-base font-normal transition-colors ${isActive ? 'text-[#A3B14B] font-medium' : 'text-[#57534E] hover:text-[#1C1917]'}`;

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#E7E5E4]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex gap-3 items-center group">
                    <div className="w-8 h-8 bg-[#A3B14B] rounded-full group-hover:scale-110 transition-transform"></div>
                    <span className="text-xl font-medium tracking-tight text-[#292524]">Pakuaty</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/products" className={activeStyle}>Products</NavLink>
                    <NavLink to="/about" className={activeStyle}>About</NavLink>
                    <NavLink to="/contact" className={activeStyle}>Contact</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#A3B14B] transition-all duration-300 shadow-lg shadow-neutral-200">
                        Partner with us
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className="md:hidden text-[#1C1917]">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
