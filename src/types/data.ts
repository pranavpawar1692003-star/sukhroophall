// Types for dynamic data

export interface HeroSlide {
  id?: string;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  order: number;
  createdAt?: Date;
}

export interface AboutContent {
  id?: string;
  title: string;
  description: string;
  stats: {
    icon: string;
    value: number;
    suffix: string;
    label: string;
  }[];
  createdAt?: Date;
}

export interface Facility {
  id?: string;
  icon: string;
  title: string;
  desc: string;
  order: number;
  createdAt?: Date;
}

export interface Service {
  id?: string;
  image: string;
  title: string;
  desc: string;
  order: number;
  createdAt?: Date;
}

export interface GalleryItem {
  id?: string;
  image: string;
  label: string;
  type: "image" | "video";
  order: number;
  createdAt?: Date;
}

export interface Testimonial {
  id?: string;
  image?: string;
  name: string;
  event: string;
  comment: string;
  rating: number;
  order: number;
  createdAt?: Date;
}

export interface ContactInfo {
  id?: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socialMedia: {
    platform: string;
    url: string;
  }[];
  timing: string;
  createdAt?: Date;
}

export interface BookingInfo {
  id?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  createdAt?: Date;
}

export interface FacilityExtras {
  id?: string;
  technicalExcellence: { label: string; value: string }[];
  specifications: string[];
  createdAt?: Date;
}
