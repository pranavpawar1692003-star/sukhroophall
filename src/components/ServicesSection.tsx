import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "@/contexts/DataContext";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const { services: dynamicServices, loading } = useData();
  const sectionRef = useRef<HTMLElement>(null);

  const fallbackServices = [
    { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", title: "Grand Weddings", desc: "Transform your dream wedding into a royal reality. From traditional Vedic ceremonies to modern fusion weddings, we handle every detail including mandap design, guest management, and specialized rituals." },
    { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80", title: "Royal Receptions", desc: "Host a spectacular post-wedding celebration with our customizable grand stages, professional mood lighting, and cinematic entry setups that will leave your guests in awe." },
    { image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80", title: "Intimate Engagements", desc: "Celebrate your first step towards a new life in an intimate yet sophisticated setting. We offer bespoke floral décor and curated seating arrangements for a memorable ring ceremony." },
    { image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80", title: "Corporate Excellence", desc: "Elevate your business events with our professional setup for conferences, seminars, and award ceremonies, featuring high-speed connectivity and premium audiovisual support." },
    { image: "https://images.unsplash.com/photo-1515281239448-2aba355a6d3f?auto=format&fit=crop&q=80", title: "Cultural Festivals", desc: "The perfect venue for traditional festivals and community gatherings. We provide the authentic atmosphere and logistical support required for large-scale cultural programs." },
    { image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80", title: "Social Celebrations", desc: "From landmark birthdays to anniversary parties and baby showers, we create a joyful and vibrant atmosphere with themed decorations and gourmet catering tailored to your preference." },
  ];

  const displayServices = (!loading && dynamicServices.length > 0 && dynamicServices[0].id) 
    ? dynamicServices 
    : (loading ? [] : fallbackServices);

  useEffect(() => {
    if (displayServices.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".service-card", {
        scrollTrigger: { trigger: ".services-grid", start: "top 95%" },
        opacity: 0, scale: 0.98, duration: 0.6, stagger: 0.1, clearProps: "all"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [displayServices.length]);

  if (loading && dynamicServices.length === 0) {
    return (
       <section id="services" className="section-padding bg-background">
         <div className="container mx-auto">
            <div className="animate-pulse flex flex-col items-center">
               <div className="h-8 w-48 bg-gold/20 rounded mb-4"></div>
               <div className="h-12 w-64 bg-primary/20 rounded mb-12"></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-64 bg-card border border-border rounded-xl"></div>
                  ))}
               </div>
            </div>
         </div>
       </section>
    );
  }

  if (displayServices.length === 0) return null;

  return (
    <section id="services" ref={sectionRef} className="section-padding bg-background">
      <div className="container mx-auto text-center">
        <div className="section-header mb-12 text-center">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">What We Offer</p>
          <h2 className="section-title mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Our Services</h2>
          <div className="gold-divider mb-10" />
          <p className="max-w-3xl mx-auto text-muted-foreground font-body leading-relaxed">
            From the first ritual to the final farewell, we provide end-to-end event management
            solutions. Our team of specialists ensures that every ceremony is executed with
            flawless precision and unmatched creativity.
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayServices.map((s) => (
            <div key={s.title} className="service-card card-premium group cursor-pointer">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300" />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
