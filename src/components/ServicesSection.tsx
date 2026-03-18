import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { image: gallery2, title: "Grand Weddings", desc: "Transform your dream wedding into a royal reality. From traditional Vedic ceremonies to modern fusion weddings, we handle every detail including mandap design, guest management, and specialized rituals." },
  { image: gallery5, title: "Royal Receptions", desc: "Host a spectacular post-wedding celebration with our customizable grand stages, professional mood lighting, and cinematic entry setups that will leave your guests in awe." },
  { image: gallery1, title: "Intimate Engagements", desc: "Celebrate your first step towards a new life in an intimate yet sophisticated setting. We offer bespoke floral décor and curated seating arrangements for a memorable ring ceremony." },
  { image: gallery4, title: "Corporate Excellence", desc: "Elevate your business events with our professional setup for conferences, seminars, and award ceremonies, featuring high-speed connectivity and premium audiovisual support." },
  { image: gallery3, title: "Cultural Festivals", desc: "The perfect venue for traditional festivals and community gatherings. We provide the authentic atmosphere and logistical support required for large-scale cultural programs." },
  { image: gallery2, title: "Social Celebrations", desc: "From landmark birthdays to anniversary parties and baby showers, we create a joyful and vibrant atmosphere with themed decorations and gourmet catering tailored to your preference." },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section-padding bg-background">
      <div className="container mx-auto text-center">
        <div className="section-header mb-12 text-center">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">What We Offer</p>
          <h2 className="section-title mb-6 text-5xl md:text-6xl lg:text-7xl font-bold">Our Services</h2>
          <div className="gold-divider mb-10" />
          <p className="max-w-3xl mx-auto text-muted-foreground font-body leading-relaxed">
            From the first ritual to the final farewell, we provide end-to-end event management 
            solutions. Our team of specialists ensures that every ceremony is executed with 
            flawless precision and unmatched creativity.
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="service-card card-premium group cursor-pointer">
              <div className="relative overflow-hidden h-56">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground font-body text-base leading-relaxed">
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
