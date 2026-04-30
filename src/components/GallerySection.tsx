import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight, Video, Image as ImageIcon } from "lucide-react";
import { useData } from "@/contexts/DataContext";

gsap.registerPlugin(ScrollTrigger);

const GallerySection = () => {
  const { galleryItems, loading } = useData();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (galleryItems.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".section-header > *", {
        scrollTrigger: { trigger: ".section-header", start: "top 95%" },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.2, clearProps: "all"
      });
      gsap.from(".gallery-item", {
        scrollTrigger: { trigger: ".gallery-grid", start: "top 95%" },
        opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.1, clearProps: "all"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [galleryItems.length]);

  if (!loading && galleryItems.length === 0) return null;


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
    setLightbox((lightbox + dir + galleryItems.length) % galleryItems.length);
  };

  const firstImage = galleryItems.find(item => item.type === "image")?.image || "";

  return (
    <section id="gallery" ref={sectionRef} className="section-padding bg-muted">
      <div className="container mx-auto text-center">
        <div className="section-header mb-12 text-center">
          <p className="section-subtitle mb-3 text-lg md:text-xl font-bold">Visual Tour</p>
          <h2 className="section-title mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Our Gallery</h2>
          <div className="gold-divider mb-10" />
          <p className="max-w-3xl mx-auto text-muted-foreground font-body leading-relaxed">
            Step into our world of elegance and grandeur. Our gallery showcases the
            stunning transformations, architectural beauty, and heartfelt moments that
            define the Sukhrup Garden experience.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, i) => (
            <div
              key={item.id || i}
              onClick={() => openLightbox(i)}
              className="break-inside-avoid gallery-item relative overflow-hidden cursor-pointer group rounded-xl border border-gold/10 bg-royal/5 hover:border-gold/30 transition-all duration-300"
            >
              {item.type === "video" ? (
                <div className="relative w-full">
                  <video
                    src={item.image}
                    className="w-full h-auto object-contain"
                    poster={firstImage || item.image}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Video className="text-gold w-6 h-6" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full">
                  <img
                    src={item.image}
                    alt={item.label || "Gallery Image"}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                      <ImageIcon className="text-gold w-5 h-5" />
                    </div>
                  </div>
                </div>
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
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          {galleryItems[lightbox].type === "video" ? (
            <div className="relative w-full max-w-5xl mx-2 sm:mx-4" onClick={(e) => e.stopPropagation()}>
              <video
                src={galleryItems[lightbox].image}
                controls
                className="w-full rounded-lg shadow-2xl"
                autoPlay
                playsInline
              />
            </div>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold"
              >
                <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
              </button>
              <img
                src={galleryItems[lightbox].image}
                alt="Gallery"
                className="max-w-[90vw] max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-gold"
              >
                <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default GallerySection;
