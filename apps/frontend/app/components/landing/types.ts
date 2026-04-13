export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  category: string;
  warranty?: string | null;
  features: string[];
  isPublished: boolean;
  mainImageUrl?: string | null;
}

export interface SiteBanner {
  id?: string;
  imageUrl: string;
  targetUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface Testimonial {
  id?: string;
  authorName: string;
  authorRole?: string;
  content: string;
  avatarUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SiteSettings {
  mainHeadline?: string | null;
  subHeadline?: string | null;
  heroMediaUrl?: string | null;
  banners?: SiteBanner[];
  testimonials?: Testimonial[];
}

export interface LandingMetrics {
  totalProducts: number;
  startingPrice: number | null;
  activeTestimonials: number;
}
