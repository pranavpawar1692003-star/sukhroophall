import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Facilities", href: "#facilities" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-royal/95 backdrop-blur-md shadow-lg py-3"
        : "bg-transparent py-5"
        }`}
    >

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 flex items-center justify-between">
        <a href="#home" className="flex flex-col">
          <span className="font-display text-xl sm:text-2xl font-bold !text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
            Sukhrup Garden
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] !text-white/80 font-body">
            Premium Wedding Venue
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white drop-shadow-sm hover:text-gold text-sm uppercase tracking-[0.2em] font-body font-bold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            className="flex items-center gap-2 bg-gold text-royal px-5 py-2.5 text-xs uppercase tracking-wider font-body font-bold transition-all duration-300 hover:bg-gold-light"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-full transition-all duration-300 ${scrolled
            ? "text-white hover:text-gold"
            : "text-royal bg-gold/80 backdrop-blur-md hover:bg-gold" // Enhanced visibility for light backgrounds
            }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-royal/98 backdrop-blur-lg border-t border-gold/20 animate-fade-up">
          <div className="w-full px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-white drop-shadow-sm hover:text-gold text-base uppercase tracking-[0.2em] font-body font-bold py-3 border-b border-gold/10 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-gold text-royal py-4 text-sm uppercase tracking-wider font-body font-bold transition-all active:scale-95 mt-4"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
