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
    "Centralized VRF AC Systems",
    "Professional Acoustic Treatment",
    "Programmable LED Ambience",
    "High-Resolution CCTV Matrix"
  ];

  const specifications = facilityExtras?.specifications || [
    "25,000 Sq. Ft. Operational Area",
    "1,500 Guest Combined Capacity",
    "200+ Vehicle Secured Parking",
    "100% DG Set Power Backup"
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

        <div className="facility-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {facilities.map((f: any) => {
            const IconComponent = typeof f.icon === 'string' ? (iconMap[f.icon] || Info) : f.icon;
            return (
              <div key={f.title} className="facility-card card-premium p-6 sm:p-8 text-left group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">
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
        <div className="technical-content mt-12 py-8 sm:py-12 border-t border-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch text-left">
            <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 md:p-10 border border-gold/20 rounded-lg shadow-sm">
              <p className="section-subtitle mb-3 text-base sm:text-lg">Specifications</p>
              <h2 className="section-title mb-6 !text-3xl sm:!text-4xl md:!text-5xl">Technical Excellence</h2>
              <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed mb-8">
                Beyond the aesthetics, we take pride in our facility's technical superiority.
                Our venue is engineered for large-scale logistics, ensuring that even the
                most complex events run smoothly without a single technical glitch.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {technicalExcellence.map((spec: any) => (
                  <div key={spec.label} className="border-l-2 border-gold pl-3 sm:pl-4 py-2">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      {spec.label}
                    </p>
                    <p className="font-display text-lg sm:text-xl font-semibold text-foreground">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-royal p-6 sm:p-8 md:p-12 relative overflow-hidden group rounded-lg shadow-sm flex flex-col justify-center">
              {/* Decorative background flare */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gold/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-gold/20 transition-all duration-700" />

              <h3 className="font-display text-xl sm:text-2xl font-bold text-gold mb-4 sm:mb-6">Facility Quick Facts</h3>
              <ul className="space-y-3 sm:space-y-4">
                {specifications.map((fact: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gold shrink-0" />
                    <p className="text-cream/80 font-body text-xs sm:text-sm leading-tight">
                      {fact}
                    </p>
                  </li>
                ))} 
              </ul>
              <div className="mt-8 sm:mt-10">
                <a
                  href="#contact"
                  className="inline-block border-b-2 border-gold text-gold font-body text-xs uppercase tracking-[0.2em] font-bold pb-1 hover:text-white hover:border-white transition-all duration-300"
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
  