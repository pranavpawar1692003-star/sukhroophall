import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db, collection, getDocs, query, orderBy, serverTimestamp } from "../lib/firebase";
import {
  HeroSlide,
  AboutContent,
  Facility,
  Service,
  GalleryItem,
  Testimonial,
  ContactInfo,
  BookingInfo,
  FacilityExtras
} from "../types/data";

interface DataContextType {
  heroSlides: HeroSlide[];
  aboutContent: AboutContent | null;
  facilities: Facility[];
  facilityExtras: FacilityExtras | null;
  services: Service[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo | null;
  bookingInfo: BookingInfo | null;
  loading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityExtras, setFacilityExtras] = useState<FacilityExtras | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    
    // Fetch hero slides
    try {
      const heroSnapshot = await getDocs(collection(db, "heroSlides"));
      if (!heroSnapshot.empty) {
        const items = heroSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as HeroSlide));
        setHeroSlides(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setHeroSlides([
          {
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
            subtitle: "Premium Wedding & Event Venue",
            title: "Sukhrup Garden & Multipurpose Hall",
            description: "Experience the epitome of luxury and elegance for your special celebrations. With world-class amenities and exceptional service, we make your events unforgettable.",
            order: 0
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      setHeroSlides([{
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
        subtitle: "Premium Wedding & Event Venue",
        title: "Sukhrup Garden & Multipurpose Hall",
        description: "Experience the epitome of luxury and elegance for your special celebrations.",
        order: 0
      }]);
    }

    // Fetch about content
    try {
      const aboutSnapshot = await getDocs(collection(db, "aboutContent"));
      if (!aboutSnapshot.empty) {
        const aboutDoc = aboutSnapshot.docs[0];
        setAboutContent({ id: aboutDoc.id, ...aboutDoc.data() } as AboutContent);
      } else {
        setAboutContent({
          title: "A Legacy of Excellence in Hospitality",
          description: "Sukhrup Garden & Multipurpose Hall has been the preferred destination for grand weddings and corporate events for over 24 years. We offer a perfect blend of modern luxury and traditional charm, ensuring every celebration is handled with the utmost care and professionalism.",
          stats: [
            { icon: "Calendar", value: 24, suffix: " years", label: "of Excellence" },
            { icon: "Heart", value: 1000, suffix: "+", label: "Happy Celebrations" },
            { icon: "Users", value: 500, suffix: " to 2000", label: "Capacity" },
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
    }

    // Fetch facilities
    try {
      const facilitiesSnapshot = await getDocs(collection(db, "facilities"));
      if (!facilitiesSnapshot.empty) {
        const items = facilitiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Facility));
        setFacilities(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setFacilities([
          { icon: "Snowflake", title: "AC Banquet Hall", desc: "Our majestic, pillar-less ballroom features centralized climate control, accommodating up to 500 guests in a truly royal setting with exquisite chandeliers.", order: 0 },
          { icon: "Car", title: "Parking", desc: "Stress-free arrival for your guests with our expansive parking facility for 200+ vehicles, managed by a professional and courteous valet team.", order: 1 },
          { icon: "UtensilsCrossed", title: "Grand Dining Hall", desc: "A sprawling, separate dining area designed for comfort, featuring custom buffet setups and live counter spaces to suit every culinary preference.", order: 2 },
          { icon: "BedDouble", title: "Luxury Guest Rooms", desc: "12 opulent guest suites featuring premium linens, modern attached bathrooms, and traditional aesthetic touches for your family's comfort.", order: 3 },
          { icon: "Theater", title: "Designer Stage", desc: "A massive, custom-built performance stage equipped with programmable LED ambient lighting and cinematic acoustics for a spectacular visual experience.", order: 4 },
          { icon: "Zap", title: "Uninterrupted Power", desc: "Dual industrial-grade silent generators ensure your celebrations continue flawlessly with 100% power backup for all lighting and AC systems.", order: 5 },
          { icon: "Lock", title: "Elite Security", desc: "Peace of mind with 24/7 CCTV surveillance and a team of professional security personnel monitoring all entrances and common areas.", order: 6 },
          { icon: "Coffee", title: "Pre-Function Area", desc: "An elegant lounge space for early arrivals, perfect for welcome drinks and intimate conversations before the main event begins.", order: 7 },
          { icon: "Users", title: "Bridal Suites", desc: "Private, high-security mirror-lined changing rooms with dedicated restrooms, designed specifically for the bridal party's comfort and privacy.", order: 8 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      // Ensure full fallbacks are set even on error
      setFacilities([
        { icon: "Snowflake", title: "AC Banquet Hall", desc: "Our majestic, pillar-less ballroom features centralized climate control, accommodating up to 500 guests in a truly royal setting with exquisite chandeliers.", order: 0 },
        { icon: "Car", title: "Parking", desc: "Stress-free arrival for your guests with our expansive parking facility for 200+ vehicles, managed by a professional and courteous valet team.", order: 1 },
        { icon: "UtensilsCrossed", title: "Grand Dining Hall", desc: "A sprawling, separate dining area designed for comfort, featuring custom buffet setups and live counter spaces to suit every culinary preference.", order: 2 },
        { icon: "BedDouble", title: "Luxury Guest Rooms", desc: "12 opulent guest suites featuring premium linens, modern attached bathrooms, and traditional aesthetic touches for your family's comfort.", order: 3 },
        { icon: "Theater", title: "Designer Stage", desc: "A massive, custom-built performance stage equipped with programmable LED ambient lighting and cinematic acoustics for a spectacular visual experience.", order: 4 },
        { icon: "Zap", title: "Uninterrupted Power", desc: "Dual industrial-grade silent generators ensure your celebrations continue flawlessly with 100% power backup for all lighting and AC systems.", order: 5 },
        { icon: "Lock", title: "Elite Security", desc: "Peace of mind with 24/7 CCTV surveillance and a team of professional security personnel monitoring all entrances and common areas.", order: 6 },
        { icon: "Coffee", title: "Pre-Function Area", desc: "An elegant lounge space for early arrivals, perfect for welcome drinks and intimate conversations before the main event begins.", order: 7 },
        { icon: "Users", title: "Bridal Suites", desc: "Private, high-security mirror-lined changing rooms with dedicated restrooms, designed specifically for the bridal party's comfort and privacy.", order: 8 },
      ]);
    }

    // Fetch facility extras
    try {
      const extrasSnapshot = await getDocs(collection(db, "facilityExtras"));
      if (!extrasSnapshot.empty) {
        setFacilityExtras({ id: extrasSnapshot.docs[0].id, ...extrasSnapshot.docs[0].data() } as FacilityExtras);
      } else {
        setFacilityExtras({
          technicalExcellence: [
            { label: "Main Hall Area", value: "12,000 Sq. Ft." },
            { label: "Dining Area", value: "4000 Sq. Ft." },
            { label: "Kitchen Area", value: "2200 Sq. Ft." },
            { label: "AC Capacity", value: "150 Tons Total" },
            { label: "CCTV Cameras", value: "64 High-Res Units" },
            { label: "Generator Set", value: "2x 250 kVA Silent" },
          ],
          specifications: [
            "Pillar-less hall for unobstructed 360° visibility",
            "Dedicated fire-safety systems with smoke detectors",
            "Eco-friendly rainwater harvesting setup",
            "Centrally located with easy highway access",
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching facility extras:", error);
    }

    // Fetch services
    try {
      const servicesSnapshot = await getDocs(collection(db, "services"));
      if (!servicesSnapshot.empty) {
        const items = servicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service));
        setServices(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }

    // Fetch gallery items
    try {
      const gallerySnapshot = await getDocs(collection(db, "galleryItems"));
      if (!gallerySnapshot.empty) {
        const items = gallerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryItem));
        // Sort client-side to be safe with indices
        setGalleryItems(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setGalleryItems([
          { image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80", label: "Grand Ballroom", type: "image", order: 0 },
          { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", label: "Wedding Decor", type: "image", order: 1 },
          { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80", label: "Reception Stage", type: "image", order: 2 },
          { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", label: "Dining Hall", type: "image", order: 3 },
          { image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=crop&q=80", label: "Outdoor Garden", type: "image", order: 4 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setGalleryItems([
        { image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80", label: "Grand Ballroom", type: "image", order: 0 },
        { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", label: "Wedding Decor", type: "image", order: 1 },
      ]);
    }

    // Fetch testimonials
    try {
      const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
      if (!testimonialsSnapshot.empty) {
        const items = testimonialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setTestimonials([
          {
            name: "Aniket Patil",
            event: "Grand Wedding",
            comment: "Best in budget! Very professional service and excellent time management.",
            rating: 5,
            order: 0,
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"
          },
          {
            name: "Sneha Deshmukh",
            event: "Wedding Ceremony",
            comment: "The dedicated staff takes care of every little detail.",
            rating: 5,
            order: 1,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([
        {
          name: "Aniket Patil",
          event: "Grand Wedding",
          comment: "Best in budget! Very professional service and excellent time management.",
          rating: 5,
          order: 0,
          image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"
        }
      ]);
    }

    // Fetch contact info
    try {
      const contactSnapshot = await getDocs(collection(db, "contactInfo"));
      if (!contactSnapshot.empty) {
        const contactDoc = contactSnapshot.docs[0];
        setContactInfo({ id: contactDoc.id, ...contactDoc.data() } as ContactInfo);
      } else {
        setContactInfo({
          phone: "+91 9152433919",
          email: "info@sukhroopgardan.com",
          address: "Sukhrup Garden, Main Highway Road, 416001",
          mapUrl: "https://goo.gl/maps/example",
          socialMedia: [
            { platform: "Instagram", url: "https://instagram.com/sukhrupgarden" },
            { platform: "Facebook", url: "https://facebook.com/sukhrupgarden" }
          ],
          timing: "Mon - Sun: 9:00 AM - 9:00 PM"
        });
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }

    // Fetch booking info
    try {
      const bookingSnapshot = await getDocs(collection(db, "bookingInfo"));
      if (!bookingSnapshot.empty) {
        const bookingDoc = bookingSnapshot.docs[0];
        setBookingInfo({ id: bookingDoc.id, ...bookingDoc.data() } as BookingInfo);
      } else {
        setBookingInfo({
          title: "Ready to Plan Your Event?",
          subtitle: "Book your date today and experience the luxury of Sukhrup Garden.",
          ctaText: "Enquire Now",
          ctaLink: "#contact"
        });
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{
      heroSlides,
      aboutContent,
      facilities,
      facilityExtras,
      services,
      galleryItems,
      testimonials,
      contactInfo,
      bookingInfo,
      loading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
