import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import BookingBanner from "@/components/BookingBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SocialFloatingSidebar from "@/components/SocialFloatingSidebar";
import WhatsAppFloating from "@/components/WhatsAppFloating";

import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Force browser to start at top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Immediate scroll to top
    window.scrollTo(0, 0);

    // Clear hash immediately to prevent scroll-to-id
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // Repeat after a short delay to ensure everything is loaded and rendered
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <Navbar />
      <HeroSlider />
      <AboutSection />
      <FacilitiesSection />
      <ServicesSection />
      <GallerySection />
      <BookingBanner />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <SocialFloatingSidebar />
      <WhatsAppFloating />

    </main>
  );
};

export default Index;
