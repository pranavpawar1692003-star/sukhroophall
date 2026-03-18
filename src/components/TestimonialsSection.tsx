import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Aniket Patil",
    event: "Grand Wedding",
    text: "Best in budget! Very professional service and excellent time management. The venue is perfect for grand celebrations and the team is highly coordinated.",
    rating: 5,
  },
  {
    name: "Sneha Deshmukh",
    event: "Wedding Ceremony",
    text: "The dedicated staff takes care of every little detail. Amenities like power backup and top-notch sound systems made our event seamless and stress-free.",
    rating: 5,
  },
  {
    name: "Rajesh Gore",
    event: "Engagement Reception",
    text: "Particularly impressed with the dining experience. The in-house catering team serves authentic local flavors that our guests absolutely loved.",
    rating: 5,
  },
  {
    name: "Sameer Kulkarni",
    event: "Family Function",
    text: "Very nice venue with good food. The overall experience was smooth and professional. It's one of the best multipurpose halls in the Haripur area.",
    rating: 4,
  },
  {
    name: "Vikas Shinde",
    event: "Cultural Event",
    text: "A perfect blend of style and comfort. The team handled our large guest list with ease and the facilities provided are top-notch for the price.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main reveal animation
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        clearProps: "all"
      });

      // Infinite marquee logic
      const marquee = marqueeRef.current;
      if (!marquee) return;

      const totalWidth = marquee.scrollWidth / 2;
      
      const animation = gsap.to(marquee, {
        x: -totalWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      marquee.addEventListener("mouseenter", () => animation.pause());
      marquee.addEventListener("mouseleave", () => animation.play());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Double the testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" ref={sectionRef} className="section-padding bg-maroon relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for depth */}
      <div className="container mx-auto text-center relative z-10">
        <div className="section-header mb-16 text-center">
          <p className="text-gold text-lg md:text-xl uppercase tracking-[0.25em] font-body mb-3 font-bold">
            Testimonials
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-6">
            Voices of Excellence
          </h2>
          <div className="gold-divider" />
        </div>
      </div>

      <div className="relative w-full">
        {/* Gradients for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-maroon to-transparent z-10 hidden md:block" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-maroon to-transparent z-10 hidden md:block" />

        <div 
          ref={marqueeRef}
          className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap will-change-transform"
          style={{ width: "max-content" }}
        >
          {duplicatedTestimonials.map((t, i) => (
            <div 
              key={i} 
              className="testimonial-card inline-block w-[280px] sm:w-[320px] md:w-[400px] lg:w-[500px] bg-white/5 backdrop-blur-sm p-4 sm:p-6 md:p-10 border border-gold/10 relative group hover:bg-white/10 transition-all duration-500 whitespace-normal"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-gold/20 group-hover:text-gold/40 transition-colors" />
              
              <div className="flex gap-1 mb-4 sm:mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
                ))}
              </div>

              <p className="font-body text-cream/90 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-10 italic relative z-10">
                "{t.text}"
              </p>

              <div className="mt-auto border-t border-gold/10 pt-4 sm:pt-6">
                <p className="font-display text-lg sm:text-xl font-bold text-gold mb-1">
                  {t.name}
                </p>
                <p className="text-cream/60 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-body">
                  {t.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
