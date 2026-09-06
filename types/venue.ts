export interface VenueAddress {
  street: string
  suburb: string
  city: string
  region: string
  postalCode: string
  lat: number
  lng: number
}

export interface VenueImage {
  url: string
  alt: string
}

export interface VenueService {
  id: string
  name: string
  description?: string
  durationMinutes: number
  price: number
  priceIsFrom?: boolean
}

export interface VenueServiceCategory {
  id: string
  name: string
  services: VenueService[]
}

export interface VenueEmployee {
  id: string
  name: string
  title?: string
  rating?: number
  avatarUrl?: string
}

export interface VenueReview {
  id: string
  authorName: string
  authorAvatarUrl?: string
  rating: number
  body: string
  serviceName?: string
  employeeName?: string
  postedAt: string
}

export interface OpeningHours {
  day: string
  opens?: string
  closes?: string
  closed?: boolean
}

export interface Venue {
  id: string
  slug: string
  name: string
  tagline?: string
  description: string
  rating: number
  reviewCount: number
  reviewSummary?: string
  tags: string[]
  address: VenueAddress
  phone?: string
  images: VenueImage[]
  serviceCategories: VenueServiceCategory[]
  team: VenueEmployee[]
  reviews: VenueReview[]
  portfolio: VenueImage[]
  hours: OpeningHours[]
  amenities: string[]
}
