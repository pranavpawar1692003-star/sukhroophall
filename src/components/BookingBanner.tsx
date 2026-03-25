import { useData } from "@/contexts/DataContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, CalendarCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const BookingBanner = () => {
  const { bookingInfo, contactInfo } = useData();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => { 
      gsap.from(".banner-content > *", {
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-16 bg-gold relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>
      <div className="container mx-auto px-4 text-center banner-content relative z-10">
        <CalendarCheck className="w-10 h-10 text-royal mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-royal mb-3">
          {bookingInfo?.title || "Ready to Plan Your Dream Event?"}
        </h2>
        <p className="font-body text-royal/80 mb-8 max-w-xl mx-auto">
          {bookingInfo?.subtitle || "Contact us today to check availability and book your preferred dates."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={bookingInfo?.ctaLink || "#contact"} className="btn-primary bg-royal text-cream hover:bg-primary">
            {bookingInfo?.ctaText || "Book Now"}
          </a>
          <a
            href={`tel:${contactInfo?.phone.replace(/\s/g, "") || "+917304999009"}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-royal text-royal font-body font-medium text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:bg-royal hover:text-cream"
          >
            <Phone size={16} />
            {contactInfo?.phone || "+91 73049 99009"}

          </a>
        </div>
      </div>
    </section>
  );
};

export default BookingBanner;
