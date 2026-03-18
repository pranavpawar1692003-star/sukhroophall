import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloating = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after slight delay for a nice entry
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "917304999009"; 
  const message = "Hello! I'm interested in booking Sukhrup Garden for an event. Can you please provide more details?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[60] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_-5px_#25d36666] hover:scale-110 transition-transform active:scale-95"
      >
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-4 py-2 bg-royal text-cream text-xs font-bold uppercase tracking-widest rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat with us
        </span>

        {/* Pulsing effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-0 transition-opacity" />
        
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default WhatsAppFloating;
