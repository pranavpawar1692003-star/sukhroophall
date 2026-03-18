import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
const hero1 = "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq4SRh4A5G1dSQ3AjqBw-9C1Z5y7FE0nNLdHbIdPAWkXhC6Qkxk1ccBY-aP--eSqLV_7LKa3hKF0ASGIy7TTx5--8NSoJ_RkRStMiygL9xBU3zOmaelHKkvn-PUaEyGdRaATTs=w1600-h900-k-no";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    subtitle: "Welcome to",
    title: "Sukhrup Garden",
    description: "Where every celebration becomes an unforgettable experience",
  },
  {
    image: hero2,
    subtitle: "Exquisite",
    title: "Wedding Celebrations",
    description: "Create magical memories in our grand wedding halls",
  },
  {
    image: hero3,
    subtitle: "Enchanting",
    title: "Outdoor Venues",
    description: "Beautiful garden settings for your dream celebration",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const animateText = () => {
    if (!textRef.current) return;
    const els = textRef.current.children;
    gsap.fromTo(
      els,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }
    );
  };

  useEffect(() => {
    animateText();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    animateText();
  }, [current]);

  const goTo = (index: number) => {
    setCurrent(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="glass-overlay absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={textRef} className="text-center px-4 max-w-4xl">
          <p className="!text-white text-sm md:text-base uppercase tracking-[0.4em] font-body mb-4">
            {slides[current].subtitle}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold !text-white mb-6 leading-tight">
            {slides[current].title}
          </h1>
          <p className="!text-white/80 font-body text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto">
            {slides[current].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-gold">
              Book Your Event
            </a>
            <a href="#gallery" className="btn-outline border-cream/40 text-cream hover:bg-cream/10 hover:text-cream">
              View Gallery
            </a>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors"
      >
        <ChevronLeft size={24} sm:size={32} md:size={40} />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors"
      >
        <ChevronRight size={24} sm:size={32} md:size={40} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              i === current ? "bg-gold w-6 sm:w-8" : "bg-cream/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
