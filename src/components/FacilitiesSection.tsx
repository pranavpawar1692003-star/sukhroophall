import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Snowflake, Car, UtensilsCrossed, BedDouble, Theater, Zap, Lock, Coffee, Users, Utensils, Star, Info
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { useData } from "@/contexts/DataContext";

const iconMap: { [key: string]: any } = {
  Snowflake,
  Car,
  UtensilsCrossed,
  BedDouble,
  Theater,
  Zap,
  Lock,
  Coffee,
  Users,
  Utensils,
  Star,
  Info
};

const FacilitiesSection = () => {
  const { facilities, facilityExtras } = useData();
  const sectionRef = useRef<HTMLElement>(null);

  const technicalExcellence = facilityExtras?.technicalExcellence || [
    { label: "Main Hall Area", value: "12,000 Sq. Ft." },
    { label: "Dining Area", value: "4000 Sq. Ft." },
    { label: "Kitchen Area", value: "2200 Sq. Ft." },
    { label: "AC Capacity", value: "150 Tons Total" },
  ];

  const specifications = facilityExtras?.specifications || [
    "Pillar-less hall for unobstructed 360° visibility",
    "Dedicated fire-safety systems with smoke detectors",
    "Eco-friendly rainwater harvesting setup",
    "Centrally located with easy highway access",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", { // Target children of section-header for staggered animation
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".facility-card", {
        scrollTrigger: { trigger: ".facility-grid", start: "top 95%" },
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1, clearProps: "all"
      });
      gsap.from(".technical-content", {
        scrollTrigger: { trigger: ".technical-content", start: "top 95%" },
        opacity: 0, y: 20, duration: 0.8, clearProps: "all"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="facilities" ref={sectionRef} className="section-padding bg-muted">
      <div className="container mx-auto text-center">
        <div className="section-header mb-12">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">World-Class Amenities</p>
          <h2 className="section-title mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Our Facilities</h2>
          <div className="gold-divider mb-10" />
          <p className="max-w-3xl mx-auto text-muted-foreground font-body leading-relaxed">
            Experience the perfect blend of tradition and modernity. At Sukhrup Garden,
            we provide state-of-the-art infrastructure designed to host grand celebrations
            with absolute comfort and royal sophistication.
          </p>
        </div>

        <div className="facility-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-12 sm:mb-20">
          {facilities.map((f: any) => {
            const IconComponent = typeof f.icon === 'string' ? (iconMap[f.icon] || Info) : f.icon;
            return (
              <div key={f.title} className="facility-card card-premium p-6 sm:p-10 text-left group border-gold/10 hover:border-gold/30">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-gold/20 transition-all duration-500">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  {f.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical Excellence & Quick Facts */}
        <div className="technical-content mt-12 sm:mt-24 py-10 sm:py-20 border-t border-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-stretch text-left">
            <div className="bg-white/40 backdrop-blur-md p-6 sm:p-10 md:p-12 border border-gold/20 rounded-lg shadow-sm">
              <p className="section-subtitle mb-2 text-sm sm:text-base">Specifications</p>
              <h2 className="section-title mb-6 !text-3xl sm:!text-5xl md:!text-6xl">Technical Excellence</h2>
              <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed mb-8 sm:mb-12">
                Beyond the aesthetics, we take pride in our facility's technical superiority.
                Our venue is engineered for large-scale logistics, ensuring that even the
                most complex events run smoothly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                {technicalExcellence.map((spec: any) => (
                  <div key={spec.label} className="border-l-2 border-gold pl-4 sm:pl-6 py-2">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                      {spec.label}
                    </p>
                    <p className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-royal p-8 sm:p-12 md:p-16 relative overflow-hidden group rounded-lg shadow-sm flex flex-col justify-center min-h-[400px]">
              {/* Decorative background flare */}
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gold/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-gold/20 transition-all duration-700" />

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-gold mb-6 sm:mb-8">Facility Quick Facts</h3>
              <ul className="space-y-4 sm:space-y-6">
                {specifications.map((fact: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                    <p className="text-cream/90 font-body text-sm sm:text-base leading-relaxed">
                      {fact}
                    </p>
                  </li>
                ))} 
              </ul>
              <div className="mt-10 sm:mt-12">
                <a
                  href="#contact"
                  className="inline-block border-b-2 border-gold text-gold font-body text-xs sm:text-sm uppercase tracking-[0.25em] font-bold pb-2 hover:text-white hover:border-white transition-all duration-300"
                >
                  Request Floor Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );          
};

export default FacilitiesSection;