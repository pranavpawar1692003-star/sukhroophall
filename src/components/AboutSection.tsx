import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "@/contexts/DataContext";
import { Award, Heart, Users, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: { [key: string]: any } = {
  Calendar,
  Heart,
  Users,
  Award
};

const AboutSection = () => {
  const { aboutContent } = useData();
  const sectionRef = useRef<HTMLElement>(null);

  const mainImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80";

  const displayStats = aboutContent?.stats || [
    { icon: "Calendar", value: 24, suffix: " years", label: "of Excellence" },
    { icon: "Heart", value: 1000, suffix: "+", label: "Happy Celebrations" },
    { icon: "Users", value: 500, suffix: " to 2000", label: "Capacity" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".about-content > *", {
        scrollTrigger: { trigger: ".about-content", start: "top 95%" },
        opacity: 0, x: -30, duration: 0.8, stagger: 0.1, clearProps: "all"
      });
      gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-image", start: "top 95%" },
        opacity: 0, x: 30, duration: 0.8, clearProps: "all"
      });
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: ".stat-card", start: "top 95%" },
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1, clearProps: "all"
      });

      // Incremental counter logic
      const counters = document.querySelectorAll(".stat-number");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            const currentVal = Math.floor(obj.value);
            const el = counter as HTMLElement;
            if (el) {
              el.innerText = target >= 1000 ? currentVal.toLocaleString() : currentVal.toString();
            }
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [displayStats]);

  return (
    <section id="about" ref={sectionRef} className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">
          <div className="about-content order-2 lg:order-1">
            <div className="section-header">
              <p className="section-subtitle mb-2 text-sm sm:text-base md:text-lg font-bold">About Sukhrup Garden</p>
              <h2 className="section-title mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                {aboutContent?.title || "A Legacy of Grandeur"}
              </h2>
            </div>
            <div className="gold-divider !mx-0 mb-6 sm:mb-8" />

            {aboutContent?.description ? (
              <div className="space-y-4 sm:space-y-5">
                {aboutContent.description.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                  <p key={i} className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                  Founded on the principles of hospitality and heritage, Sukhrup Garden has stood as a
                  beacon of celebration for 24 years. We don't just provide a venue; we provide a
                  canvas where your most cherished dreams are painted with strokes of elegance and tradition.
                </p>
                <p className="about-text text-muted-foreground font-body text-sm sm:text-base leading-relaxed">
                  Our architectural design seamlessly blends the timeless charm of traditional Indian
                  aesthetics with the sophisticated requirements of modern luxury.
                </p>
              </>
            )}
          </div>
          <div className="about-image relative">
            <img
              src={aboutContent?.imageUrl || mainImage}
              alt="Sukhrup Garden Grand Hall"
              className="w-full h-auto object-contain shadow-[var(--shadow-elegant)] rounded-lg"
            />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 sm:w-48 sm:h-48 border-2 border-gold/30 hidden xl:block -z-10" />
            <div className="absolute -top-4 -right-4 w-32 h-32 sm:w-48 sm:h-48 border-2 border-gold/30 hidden xl:block -z-10" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-24">
          {displayStats.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Calendar;
            return (
              <div
                key={stat.label}
                className="stat-card text-center p-5 sm:p-8 bg-card border border-border rounded-sm hover:border-gold/30 transition-colors"
              >
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gold mx-auto mb-3" />
                <div className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1">
                  <span className="stat-number" data-target={stat.value}>{stat.value}</span>{stat.suffix}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-body">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
