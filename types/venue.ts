export interface VenueAddress {
  street: string
  suburb: string
  city: string
  region: string
  postalCode: string
  lat: number
  lng: number
}

export interface Media {
  id: string
  venueId: string
  url: string
  alt?: string
  type: 'image' | 'video'
  featured: boolean
  entityType: 'VENUE' | 'EMPLOYEE' | 'PORTFOLIO' | 'BLOG'
  category?: string
  createdAt: string
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
  imageUrl?: string
}

export interface VenueReview {
  id: string
  authorName: string
  authorAvatarUrl?: string
  rating: number
  body: string
  serviceName?: string
  employeeName?: string
  verified?: boolean
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
  verified?: boolean
  rating: number
  reviewCount: number
  reviewSummary?: string
  category: {
    id: string
    name: string
    slug: string
    icon?: string
  }
  tags: string[]
  address: VenueAddress
  phone?: string
  media: Media[]
  serviceCategories: VenueServiceCategory[]
  team: VenueEmployee[]
  reviews: VenueReview[]
  hours: OpeningHours[]
  amenities: string[]
}
