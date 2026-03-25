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
    try {
      // Fetch hero slides
      const heroQuery = query(collection(db, "heroSlides"), orderBy("order"));
      const heroSnapshot = await getDocs(heroQuery);
      if (!heroSnapshot.empty) {
        setHeroSlides(heroSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as HeroSlide)));
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

      // Fetch about content
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

      // Fetch facilities
      const facilitiesQuery = query(collection(db, "facilities"), orderBy("order"));
      const facilitiesSnapshot = await getDocs(facilitiesQuery);
      if (!facilitiesSnapshot.empty) {
        setFacilities(facilitiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Facility)));
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

      // Fetch facility extras
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

      // Fetch services
      const servicesQuery = query(collection(db, "services"), orderBy("order"));
      const servicesSnapshot = await getDocs(servicesQuery);
      if (!servicesSnapshot.empty) {
        setServices(servicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service)));
      } else {
        setServices([]);
      }

      // Fetch gallery items
      const galleryQuery = query(collection(db, "galleryItems"), orderBy("order"));
      const gallerySnapshot = await getDocs(galleryQuery);
      if (!gallerySnapshot.empty) {
        setGalleryItems(gallerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryItem)));
      } else {
        setGalleryItems([]);
      }

      // Fetch testimonials
      const testimonialsQuery = query(collection(db, "testimonials"), orderBy("order"));
      const testimonialsSnapshot = await getDocs(testimonialsQuery);
      if (!testimonialsSnapshot.empty) {
        setTestimonials(testimonialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial)));
      } else {
        setTestimonials([
          {
            name: "Aniket Patil",
            event: "Grand Wedding",
            comment: "Best in budget! Very professional service and excellent time management. The venue is perfect for grand celebrations and the team is highly coordinated.",
            rating: 5,
            order: 0,
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"
          },
          {
            name: "Sneha Deshmukh",
            event: "Wedding Ceremony",
            comment: "The dedicated staff takes care of every little detail. Amenities like power backup and top-notch sound systems made our event seamless and stress-free.",
            rating: 5,
            order: 1,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
          },
          {
            name: "Rajesh Gore",
            event: "Engagement Reception",
            comment: "Particularly impressed with the dining experience. The in-house catering team serves authentic local flavors that our guests absolutely loved.",
            rating: 5,
            order: 2,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
          },
          {
            name: "Sameer Kulkarni",
            event: "Family Function",
            comment: "Very nice venue with good food. The overall experience was smooth and professional. It's one of the best multipurpose halls in the Haripur area.",
            rating: 4,
            order: 3,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
          },
          {
            name: "Vikas Shinde",
            event: "Cultural Event",
            comment: "A perfect blend of style and comfort. The team handled our large guest list with ease and the facilities provided are top-notch for the price.",
            rating: 5,
            order: 4,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
          }
        ]);
      }

      // Fetch contact info
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

      // Fetch booking info
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
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
