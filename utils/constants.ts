export const NAVIGATION_PATHS = {
  HOME: "/",
  DISCOVER: "/discover",
  SEARCH: "/search",

  CATEGORY: (slug: string) => `/category/${slug}`,
  VENUE: (slug: string) => `/venue/${slug}`,

  BUSINESS: "/business",
  BUSINESS_HOW_IT_WORKS: "/business/how-it-works",
  BUSINESS_FEATURES: "/business/features",
  BUSINESS_PRICING: "/business/pricing",

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
