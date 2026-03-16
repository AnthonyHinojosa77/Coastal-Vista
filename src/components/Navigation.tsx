import { useEffect, useRef, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollYRef.current;
      
      // Show/hide based on scroll direction
      if (scrollingDown && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      // Add background when scrolled
      setScrolled(currentScrollY > 50);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-[#F4F6F8]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-[4vw] py-4">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-mono text-xs font-medium tracking-[0.08em] uppercase text-[#0B0F17] hover:opacity-70 transition-opacity"
        >
          COASTAL VISTA
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('showreels')}
            className="nav-link text-[#0B0F17]"
          >
            Work
          </button>
          <button
            onClick={() => scrollToSection('realestate')}
            className="nav-link text-[#0B0F17]"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('equipment')}
            className="nav-link text-[#0B0F17]"
          >
            Equipment
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="nav-link text-[#0B0F17]"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
