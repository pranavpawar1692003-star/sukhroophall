import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
const hero1 = "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq4SRh4A5G1dSQ3AjqBw-9C1Z5y7FE0nNLdHbIdPAWkXhC6Qkxk1ccBY-aP--eSqLV_7LKa3hKF0ASGIy7TTx5--8NSoJ_RkRStMiygL9xBU3zOmaelHKkvn-PUaEyGdRaATTs=w1600-h900-k-no";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import structureFront from "@/assets/structure-front.jpg";
import structurePerspective from "@/assets/structure-perspective.jpg";
import structureSide from "@/assets/structure-side.jpg";
import floorPlan from "@/assets/floor-plan.jpg";
import sitePlan from "@/assets/site-plan.jpg";
import weddingVideo from "@/assets/WhatsApp Video 2026-03-18 at 10.41.43 AM.mp4";

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: structureFront, label: "Main Entrance & Façade", type: "image" },
  { src: structurePerspective, label: "Grand Architectural View", type: "image" },
  { src: structureSide, label: "Hall Exterior Perspective", type: "image" },
  { src: sitePlan, label: "Comprehensive Site Layout", type: "image" },
  { src: floorPlan, label: "Second Floor Planning", type: "image" },
  { src: hero2, label: "Wedding Stage & Interiors", type: "image" },
  { src: hero1, label: "Grand Banquet Hall", type: "image" },
  { src: gallery2, label: "Mandap Decoration", type: "image" },
  { src: gallery3, label: "Venue Entrance Details", type: "image" },
  { src: weddingVideo, label: "Wedding Celebration Video", type: "video" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".gallery-item", {
        scrollTrigger: { trigger: ".gallery-grid", start: "top 95%" },
        opacity: 0, y: 20, duration: 0.5, stagger: 0.05, clearProps: "all"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const openLightbox = (i: number) => {
    setLightbox(i);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = "";
  };

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + images.length) % images.length);
  };

  return (
    <section id="gallery" ref={sectionRef} className="section-padding bg-muted">
      <div className="container mx-auto text-center">
        <div className="section-header mb-12 text-center">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">Visual Tour</p>
          <h2 className="section-title mb-6 text-5xl md:text-6xl lg:text-7xl font-bold">Our Gallery</h2>
          <div className="gold-divider mb-10" />
          <p className="max-w-3xl mx-auto text-muted-foreground font-body leading-relaxed">
            Step into our world of elegance and grandeur. Our gallery showcases the 
            stunning transformations, architectural beauty, and heartfelt moments that 
            define the Sukhrup Garden experience.
          </p>
        </div>

        <div className="gallery-grid grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((item, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className={`gallery-item relative overflow-hidden cursor-pointer group ${
                item.type === "video" ? "col-span-2 sm:col-span-3" : i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              {item.type === "video" ? (
                <div className="relative w-full">
                  <video
                    src={item.src}
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                    poster={gallery1}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 flex items-end">
                    <span className="text-cream font-body text-xs sm:text-sm uppercase tracking-wider p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={item.src}
                    alt={item.label}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      i === 0 ? "h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]" : "h-32 sm:h-48 md:h-56"
                    }`}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 flex items-end">
                    <span className="text-cream font-body text-xs sm:text-sm uppercase tracking-wider p-2 sm:p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-royal/95 flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 sm:top-6 right-4 sm:right-6 text-cream/70 hover:text-gold">
            <X size={24} sm:size={32} />
          </button>
          {images[lightbox].type === "video" ? (
            <div className="relative w-full max-w-5xl mx-2 sm:mx-4" onClick={(e) => e.stopPropagation()}>
              <video
                src={images[lightbox].src}
                controls
                className="w-full rounded-lg shadow-2xl"
                autoPlay
                playsInline
              />
              <p className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center text-cream font-body text-xs sm:text-sm uppercase tracking-wider">
                {images[lightbox].label}
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold"
              >
                <ChevronLeft size={24} sm:size={40} />
              </button>
              <img
                src={images[lightbox].src}
                alt={images[lightbox].label}
                className="max-w-[90vw] max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold"
              >
                <ChevronRight size={24} sm:size={40} />
              </button>
              <p className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center text-cream font-body text-xs sm:text-sm uppercase tracking-wider">
                {images[lightbox].label}
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default GallerySection;
