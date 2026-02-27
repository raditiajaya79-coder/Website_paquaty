import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';

/**
 * Navbar — Template style with brand accents
 */
const Navbar = () => {
    const activeStyle = ({ isActive }) =>
        `text-base font-normal transition-colors ${isActive ? 'text-brand-blue font-medium' : 'text-[#57534E] hover:text-stone-dark'}`;

    return (
        <nav className="fixed top-0 w-full z-50 bg-stone-light/80 backdrop-blur-md border-b border-stone-border">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex gap-3 items-center group">
                    <img src="/images/pure logo pakuaty.png" alt="Pakuaty" className="h-10 object-contain group-hover:scale-105 transition-transform" />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/products" className={activeStyle}>Products</NavLink>
                    <NavLink to="/about" className={activeStyle}>About</NavLink>
                    <NavLink to="/contact" className={activeStyle}>Contact</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 bg-stone-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-gold hover:text-stone-dark transition-all duration-300 shadow-lg shadow-neutral-200">
                        Partner with us
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className="md:hidden text-stone-dark">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
