import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';

/**
 * Navbar — Template style with brand accents
 * Dynamic transparency on Home page
 */
const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparent = isHome && !isScrolled;

    const activeStyle = ({ isActive }) => {
        const base = "text-base font-normal transition-all duration-300";
        if (isTransparent) {
            return `${base} ${isActive ? 'text-brand-gold font-medium' : 'text-stone-300 hover:text-white'}`;
        }
        return `${base} ${isActive ? 'text-brand-blue font-medium' : 'text-[#57534E] hover:text-stone-dark'}`;
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isTransparent
            ? 'bg-transparent border-transparent py-4'
            : 'bg-stone-light/80 backdrop-blur-md border-b border-stone-border py-0'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex gap-3 items-center group">
                    <img
                        src="/images/pure logo pakuaty.png"
                        alt="Pakuaty"
                        className={`h-10 object-contain group-hover:scale-105 transition-all duration-500 ${isTransparent ? 'brightness-200 contrast-200' : ''}`}
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/products" className={activeStyle}>Products</NavLink>
                    <NavLink to="/about" className={activeStyle}>About</NavLink>
                    <NavLink to="/contact" className={activeStyle}>Contact</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <button className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-lg ${isTransparent
                        ? 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-stone-dark'
                        : 'bg-stone-dark text-white hover:bg-brand-gold hover:text-stone-dark shadow-neutral-200'
                        }`}>
                        Partner with us
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className={`md:hidden transition-colors ${isTransparent ? 'text-white' : 'text-stone-dark'}`}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
