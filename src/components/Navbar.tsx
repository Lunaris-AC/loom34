
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, CircleUser } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // For accessibility
  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  const toggleFontSize = () => {
    const body = document.body;
    if (body.style.fontSize === '110%') {
      body.style.fontSize = '100%';
    } else {
      body.style.fontSize = '110%';
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-brown flex items-center gap-2 animate-fade-in"
        >
          <span className="text-gradient">Loom</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <ul className="flex space-x-1">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About Us</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/monsieur-ours">Monsieur Ours</NavLink></li>
            <li><NavLink to="/gallery">Gallery</NavLink></li>
            <li><NavLink to="/partners">Partners</NavLink></li>
          </ul>
        </nav>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Accessibility controls */}
          <button 
            onClick={toggleHighContrast} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle high contrast mode"
          >
            <span className="sr-only">High Contrast</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
              <path d="M2 12h20"></path>
            </svg>
          </button>
          
          <button 
            onClick={toggleFontSize} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle font size"
          >
            <span className="sr-only">Font Size</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <text x="6" y="18" fontSize="16" fontWeight="bold">A</text>
              <text x="12" y="14" fontSize="10" fontWeight="bold">A</text>
            </svg>
          </button>

          {/* Membership button */}
          <Link
            to="/membership"
            className="bg-brown text-white px-4 py-2 rounded-lg transition-all hover:bg-brown-dark hover-lift"
          >
            Membership
          </Link>

          {/* Login button */}
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brown/20 hover:bg-brown/5 transition-all"
          >
            <CircleUser size={18} />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-gray-600 hover:text-brown focus:outline-none focus:ring-2 focus:ring-brown rounded-md p-2"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} 
          fixed top-0 right-0 h-full w-full bg-white transform transition-all duration-300 ease-in-out z-40 md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleMenu}
            className="text-gray-600 hover:text-brown focus:outline-none focus:ring-2 focus:ring-brown rounded-md p-2"
          >
            <span className="sr-only">Close menu</span>
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-2 space-y-1">
          <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink to="/about" onClick={toggleMenu}>About Us</MobileNavLink>
          <MobileNavLink to="/events" onClick={toggleMenu}>Events</MobileNavLink>
          <MobileNavLink to="/shop" onClick={toggleMenu}>Shop</MobileNavLink>
          <MobileNavLink to="/monsieur-ours" onClick={toggleMenu}>Monsieur Ours</MobileNavLink>
          <MobileNavLink to="/gallery" onClick={toggleMenu}>Gallery</MobileNavLink>
          <MobileNavLink to="/partners" onClick={toggleMenu}>Partners</MobileNavLink>
          
          <div className="pt-4 border-t border-gray-200 mt-4">
            <MobileNavLink to="/membership" onClick={toggleMenu}>
              <span className="flex items-center">
                <span className="text-brown font-medium">Join Membership</span>
              </span>
            </MobileNavLink>
            <MobileNavLink to="/login" onClick={toggleMenu}>
              <span className="flex items-center gap-2">
                <CircleUser size={18} />
                <span>Login</span>
              </span>
            </MobileNavLink>
          </div>
          
          {/* Mobile accessibility controls */}
          <div className="pt-4 border-t border-gray-200 mt-4 flex space-x-4">
            <button 
              onClick={toggleHighContrast} 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                <path d="M2 12h20"></path>
              </svg>
              <span>High Contrast</span>
            </button>
            
            <button 
              onClick={toggleFontSize} 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <text x="6" y="18" fontSize="16" fontWeight="bold">A</text>
                <text x="12" y="14" fontSize="10" fontWeight="bold">A</text>
              </svg>
              <span>Font Size</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="relative px-3 py-2 rounded-md text-gray-700 hover:text-brown transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-brown after:transition-transform after:duration-300 hover:after:scale-x-100"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, onClick, children }: { to: string, onClick?: () => void, children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="block px-3 py-2 rounded-md text-gray-700 hover:text-brown hover:bg-brown/5 transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
