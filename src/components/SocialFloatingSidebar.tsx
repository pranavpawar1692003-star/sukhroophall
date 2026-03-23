import { useState, useEffect } from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const SocialFloatingSidebar = () => {
  return (
    <div
      className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[50] flex flex-col gap-2 p-2"
    >
      <a
        href="https://www.facebook.com/share/17Bqq55zPE/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1877F2] text-white rounded-l-md shadow-lg hover:-translate-x-1 transition-transform"
        aria-label="Facebook"
      >
        <span className="absolute right-full mr-2 sm:mr-3 px-2 sm:px-3 py-1 bg-royal text-cream text-[9px] sm:text-[10px] uppercase tracking-widest rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Facebook
        </span>
        <Facebook size={18} sm:size={22} />
      </a>
      
      <a
        href="https://www.instagram.com/sukhrupgarden?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#E1306C] text-white rounded-l-md shadow-lg hover:-translate-x-1 transition-transform"
        aria-label="Instagram"
      >
        <span className="absolute right-full mr-2 sm:mr-3 px-2 sm:px-3 py-1 bg-royal text-cream text-[9px] sm:text-[10px] uppercase tracking-widest rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Instagram
        </span>
        <Instagram size={18} sm:size={22} />
      </a>
      
      <a
        href="https://wa.me/917304999009"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-l-md shadow-lg hover:-translate-x-1 transition-transform"
        aria-label="WhatsApp"
      >
        <span className="absolute right-full mr-2 sm:mr-3 px-2 sm:px-3 py-1 bg-royal text-cream text-[9px] sm:text-[10px] uppercase tracking-widest rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          WhatsApp
        </span>
        <MessageCircle size={18} sm:size={22} />
      </a>
    </div>
  );
};

export default SocialFloatingSidebar;
