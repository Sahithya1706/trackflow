import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bug, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '#features' },
    { name: 'How It Works', path: '#how-it-works' },
    { name: 'About', path: '#about' },
  ];

  const handleScrollTo = (id) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
              <Bug className="text-primary" size={18} />
            </div>
            <Link to="/" className="text-xl font-bold text-white tracking-tight">TrackFlow</Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => link.path.startsWith('#') ? handleScrollTo(link.path) : null}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
            <div className="h-4 w-px bg-white/10" />
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log in</Link>
            <Link 
              to="/signup" 
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#09090b] border-b border-white/5 p-4 space-y-4 animate-in">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => link.path.startsWith('#') ? handleScrollTo(link.path) : null}
              className="block w-full text-left text-zinc-400 hover:text-white py-2"
            >
              {link.name}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <Link to="/login" className="flex items-center justify-center text-zinc-400 hover:text-white py-2">Log in</Link>
            <Link to="/signup" className="px-4 py-2 bg-primary text-white text-center rounded-xl font-bold text-sm">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
