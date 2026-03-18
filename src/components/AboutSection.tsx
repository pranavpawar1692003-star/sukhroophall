import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Heart, Users, Calendar } from "lucide-react";
const hero1 = "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq4SRh4A5G1dSQ3AjqBw-9C1Z5y7FE0nNLdHbIdPAWkXhC6Qkxk1ccBY-aP--eSqLV_7LKa3hKF0ASGIy7TTx5--8NSoJ_RkRStMiygL9xBU3zOmaelHKkvn-PUaEyGdRaATTs=w1600-h900-k-no";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Calendar, value: 24, suffix: " years", label: "of Excellence" },
  { icon: Heart, value: 1000, suffix: "+", label: "Happy Celebrations" },
  { icon: Users, value: 500, suffix: " to 2000", label: "Capacity" },

];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
            (counter as HTMLElement).innerText = target >= 1000 ? currentVal.toLocaleString() : currentVal.toString();
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          <div className="about-content">
            <div className="section-header">
              <p className="section-subtitle mb-3 text-base sm:text-lg md:text-xl font-bold">About Sukhrup Garden</p>
              <h2 className="section-title mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">A Legacy of Grandeur</h2>
            </div>
            <div className="gold-divider !mx-0 mb-6 sm:mb-8" />
            <p className="text-muted-foreground font-body leading-relaxed mb-4 sm:mb-6">
              Founded on the principles of hospitality and heritage, Sukhrup Garden has stood as a
              beacon of celebration for 24 years. We don't just provide a venue; we provide a
              canvas where your most cherished dreams are painted with strokes of elegance and tradition.
              Our legacy is built on thousands of successful stories and a reputation for unmatched
              excellence in every detail.
            </p>
            <p className="about-text text-muted-foreground font-body leading-relaxed mb-4 sm:mb-6">
              Our architectural design seamlessly blends the timeless charm of traditional Indian
              aesthetics with the sophisticated requirements of modern luxury. Every corner of our
              sprawling estate is meticulously maintained to provide the perfect backdrop for your
              monumental moments, ensuring that your heritage is celebrated with the grandeur it deserves.
            </p>
            <p className="about-text text-muted-foreground font-body leading-relaxed">
              From our culinary masterpieces prepared by master chefs to our bespoke décor services,
              we take pride in offering a comprehensive event experience. Our mission is to allow you
              to focus on your celebration while we discreetly manage every nuance of the logistics,
              delivering a flawless event that echoes our commitment to perfection.
            </p>
          </div>
          <div className="about-image relative">
            <img
              src={hero1}
              alt="Sukhrup Garden Grand Hall"
              className="w-full h-64 sm:h-80 md:h-[300px] lg:h-[500px] object-cover shadow-[var(--shadow-elegant)]"
            />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 sm:w-48 sm:h-48 border-2 border-gold/30 hidden lg:block" />
            <div className="absolute -top-4 -right-4 w-32 h-32 sm:w-48 sm:h-48 border-2 border-gold/30 hidden lg:block" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card text-center p-4 sm:p-6 bg-card border border-border rounded-sm"
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gold mx-auto mb-2 sm:mb-3" />
              <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
                <span className="stat-number" data-target={stat.value}>{stat.value}</span>{stat.suffix}
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
