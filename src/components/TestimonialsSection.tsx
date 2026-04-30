import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";
import { useData } from "@/contexts/DataContext";

gsap.registerPlugin(ScrollTrigger);
const TestimonialsSection = () => {
  const { testimonials } = useData();
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (testimonials.length === 0) return;
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
        duration: 60, // Slower for better readability
        ease: "none",
        repeat: -1,
      });

      marquee.addEventListener("mouseenter", () => animation.pause());
      marquee.addEventListener("mouseleave", () => animation.play());
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  // Double the testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" ref={sectionRef} className="section-padding bg-maroon relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
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
        <div 
          ref={marqueeRef}
          className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap will-change-transform"
          style={{ width: "max-content" }}
        >
          {duplicatedTestimonials.map((t, i) => (
            <div 
              key={i} 
              className="testimonial-card inline-block w-[280px] sm:w-[320px] md:w-[400px] lg:w-[500px] bg-white/5 backdrop-blur-sm p-4 sm:p-6 md:p-10 border border-gold/10 relative group hover:bg-white/10 transition-all duration-500 whitespace-normal rounded-xl"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-gold/20 group-hover:text-gold/40 transition-colors" />
              
              <div className="flex gap-1 mb-4 sm:mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
                ))}
              </div>

              <p className="font-body text-cream/90 text-sm md:text-base leading-relaxed mb-6 sm:mb-10 italic relative z-10">
                "{t.comment}"
              </p>

              <div className="mt-auto border-t border-gold/10 pt-4 sm:pt-6">
                <div>
                  <p className="font-display text-lg sm:text-xl font-bold text-gold">
                    {t.name}
                  </p>
                  <p className="text-cream/60 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-body">
                    {t.event}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
