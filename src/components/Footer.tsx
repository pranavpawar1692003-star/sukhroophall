import { useData } from "@/contexts/DataContext";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  const { contactInfo } = useData();

  const whatsappLink = `https://wa.me/${contactInfo?.phone.replace(/\D/g, "") || "917304999009"}`;
  const instagramLink = contactInfo?.socialMedia.find(s => s.platform.toLowerCase() === "instagram")?.url || "https://instagram.com/sukhrupgarden";
  const facebookLink = contactInfo?.socialMedia.find(s => s.platform.toLowerCase() === "facebook")?.url || "https://facebook.com/sukhrupgarden";

  return (
    <footer className="bg-royal text-cream/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl font-bold !text-white mb-2">Sukhrup Garden</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] !text-white/80 font-body mb-4">
              Premium Wedding Venue
            </p>
            <p className="font-body text-base leading-relaxed text-cream/70 max-w-md">
              Creating unforgettable celebrations for over 25 years. Your dream event deserves
              a venue that matches your vision — and exceeds your expectations.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#1877F2] text-white hover:opacity-80 transition-all duration-300 rounded-sm"
              >
                <Facebook size={22} />
              </a>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#E1306C] text-white hover:opacity-80 transition-all duration-300 rounded-sm"
              >
                <Instagram size={22} />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white hover:opacity-80 transition-all duration-300 rounded-sm"
              >
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Facilities", "Services", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="font-body text-base text-cream/60 hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">Contact Info</h4>
            <ul className="space-y-3 font-body text-base text-cream/60">
              <li className="whitespace-pre-line">{contactInfo?.address || "Haripur Sangli Road, Haripur\nSangli, Maharashtra 416415"}</li>
              <li>{contactInfo?.phone ? contactInfo.phone.split(/[/,\n|;&]|\s{2,}/).filter(n => n.trim().length > 5).map((n, i) => (
                <span key={i} className="block">{n.trim()}</span>
              )) : "+91 7304999009"}</li>
              <li>{contactInfo?.email || "info@sukhrupgarden.com"}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs sm:text-sm text-cream/50 text-center md:text-left">
            © {new Date().getFullYear()} Sukhrup Garden. All rights reserved.
          </p>
          <p className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/50 text-center md:text-right">
            Developed by <span className="text-white/80">Infoyashonand Technology Pvt Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
