import {
  BriefcaseBusiness,
  Camera,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  House,
  Scissors,
  Sparkles,
} from "lucide-vue-next";

export const NAVIGATION_PATHS = {
  HOME: "/",
  DISCOVER: "/discover",
  SEARCH: "/search",

  CATEGORY: (slug: string) => `/category/${slug}`,
  VENUE: (slug: string) => `/venues/${slug}`,

  BUSINESS: "/business",

  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  BLOG: "/blog",
  ABOUT: "/about",
  CONTACT: "/contact",
  HELP: "/help",

  TERMS: "/terms",
  PRIVACY: "/privacy",
  COOKIES: "/cookies",

  CAREERS: "/careers",
} as const;

export const CATEGORIES = [
  {
    name: "Beauty",
    slug: "beauty",
    description: "Nails, skincare, makeup & more",
    image: "/images/categories/beauty.jpg",
    icon: Sparkles,
    services: ["Nails", "Skincare", "Makeup", "Waxing", "Eyelashes"],
  },
  {
    name: "Hair",
    slug: "hair",
    description: "Salons, barbers & stylists",
    image: "/images/categories/hair.jpg",
    icon: Scissors,
    services: [
      "Haircuts",
      "Hair Colouring",
      "Styling",
      "Barbering",
      "Braiding",
    ],
  },
  {
    name: "Wellness",
    slug: "wellness",
    description: "Massage, spa & wellbeing",
    image: "/images/categories/wellness.jpg",
    icon: HeartPulse,
    services: ["Massage", "Therapy", "Yoga", "Spa", "Nutrition"],
  },
  {
    name: "Fitness",
    slug: "fitness",
    description: "Trainers, gyms & classes",
    image: "/images/categories/fitness.jpg",
    icon: Dumbbell,
    services: ["Personal Training", "Gym Classes", "Pilates", "CrossFit"],
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Photographers & studios",
    image: "/images/categories/photography.jpg",
    icon: Camera,
    services: [
      "Wedding Photography",
      "Portraits",
      "Event Photography",
      "Commercial",
    ],
  },
  {
    name: "Tutors",
    slug: "tutors",
    description: "Learn from trusted local experts",
    image: "/images/categories/tutors.jpg",
    icon: GraduationCap,
    services: [
      "Maths Tutoring",
      "Language Lessons",
      "Music Lessons",
      "Academic Support",
    ],
  },
  {
    name: "Home Services",
    slug: "home-services",
    description: "Trusted help for your home",
    image: "/images/categories/home-services.jpg",
    icon: House,
    services: ["Cleaning", "Gardening", "Handymen", "Plumbing", "Electrical"],
  },
  {
    name: "Business",
    slug: "business",
    description: "Professional services for businesses",
    image: "/images/categories/business.jpg",
    icon: BriefcaseBusiness,
    services: ["Consulting", "Accounting", "Legal", "Marketing"],
  },
] as const;

export const POPULAR_SERVICES = [
  "Haircuts",
  "Barbers",
  "Massage",
  "Nails",
  "Personal Training",
  "Home Cleaning",
  "Photography",
  "Tutoring",
] as const;

export const LOCATIONS = [
  "Cape Town",
  "Johannesburg",
  "Sandton",
  "Pretoria",
  "Durban",
  "Soweto",
  "Stellenbosch",
  "Somerset West",
] as const;
