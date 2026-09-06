import type { Venue } from "~/types/venue";

export function useVenue(slug: string) {
  return useAsyncData<Venue>(`venue-${slug}`, async () => {
    // return await $fetch<Venue>(`/api/venues/${slug}`)
    return mockVenue;
  });
}

const mockVenue: Venue = {
  id: "1",
  slug: "kutlwano-hair-and-beauty",

  name: "Kutlwano Hair & Beauty",

  category: "Hair & Beauty",

  description:
    "A neighbourhood beauty spot offering wash-and-styles, gel nails, waxing and skincare, run by a small team that knows most of its regulars by name.",

  tagline: "Hair, nails and beauty services in the heart of Orlando West.",

  verified: true,

  status: "active",

  rating: 4.9,
  reviewCount: 214,

  reviewSummary:
    "Regulars call out the friendly, unhurried atmosphere and consistent nail work. The wash-and-blow-dry and gel overlays are the most booked services, and several reviews mention the team remembering preferences from previous visits.",

  tags: ["Featured", "Instant confirmation"],

  priceRange: "R150–R950",

  address: {
    street: "12 Vilakazi Street",
    suburb: "Orlando West",
    city: "Soweto",
    region: "Gauteng",
    postalCode: "1804",
    country: "South Africa",

    lat: -26.2412,
    lng: 27.9247,
  },

  contact: {
    phone: "+27 71 234 5678",
    whatsapp: "+27 71 234 5678",
    email: "hello@kutlwano.co.za",
  },

  booking: {
    instantConfirmation: true,
    acceptsOnlinePayments: true,
    requiresDeposit: false,
    depositPercentage: 0,

    cancellationPolicy:
      "Free cancellation up to 24 hours before your appointment.",

    minimumNoticeMinutes: 60,
  },

  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600",
      alt: "Interior of Kutlwano Hair & Beauty",
      type: "image",
      featured: true,
    },

    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
      alt: "Nail station",
      type: "image",
    },

    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?w=1200",
      alt: "Hair styling chairs",
      type: "image",
    },

    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200",
      alt: "Beauty products",
      type: "image",
    },

    {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200",
      alt: "Salon entrance",
      type: "image",
    },
  ],

  serviceCategories: [
    {
      id: "featured",
      name: "Featured",
      services: [
        {
          id: "s1",
          name: "Wash, cut & blow-dry",
          description: "A complete wash, precision cut and finished blow-dry.",
          durationMinutes: 60,
          price: 210,
          priceIsFrom: true,
          popular: true,
        },

        {
          id: "s2",
          name: "Gel overlay & removal",
          description: "Gel overlay with removal of existing product included.",
          durationMinutes: 75,
          price: 370,
          popular: true,
        },

        {
          id: "s3",
          name: "Deluxe pedicure",
          description:
            "A relaxing pedicure with exfoliation, treatment and polish.",
          durationMinutes: 60,
          price: 400,
        },
      ],
    },

    {
      id: "nails",
      name: "Nails",
      services: [
        {
          id: "s4",
          name: "Gel overlay",
          description: "Long-lasting gel overlay for natural nails.",
          durationMinutes: 60,
          price: 290,
          popular: true,
        },

        {
          id: "s5",
          name: "Nail fix",
          description: "Repair for one damaged or broken nail.",
          durationMinutes: 30,
          price: 50,
        },

        {
          id: "s6",
          name: "Deluxe manicure",
          description:
            "Complete manicure with cuticle care, treatment and finish.",
          durationMinutes: 90,
          price: 380,
        },
      ],
    },

    {
      id: "hair",
      name: "Hair",
      services: [
        {
          id: "s7",
          name: "Wash & blow-dry",
          description: "Professional wash and finished blow-dry.",
          durationMinutes: 45,
          price: 220,
          popular: true,
        },

        {
          id: "s8",
          name: "Full colour & blow-dry",
          description:
            "Full colour service followed by a professional blow-dry.",
          durationMinutes: 180,
          price: 920,
          priceIsFrom: true,
        },
      ],
    },

    {
      id: "beauty",
      name: "Beauty",
      services: [
        {
          id: "s9",
          name: "Brow shaping",
          description: "Professional brow shaping and finishing.",
          durationMinutes: 20,
          price: 100,
        },

        {
          id: "s10",
          name: "Full leg wax",
          description: "Full leg waxing using professional products.",
          durationMinutes: 45,
          price: 250,
        },
      ],
    },
  ],

  team: [
    {
      id: "e1",
      name: "Naledi",
      title: "Owner · Stylist",
      rating: 5,
      reviewCount: 86,
      image: {
        url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600",
        alt: "Naledi",
      },
    },

    {
      id: "e2",
      name: "Karabo",
      title: "Nail Technician",
      rating: 4.9,
      reviewCount: 64,
      image: {
        url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600",
        alt: "Karabo",
      },
    },

    {
      id: "e3",
      name: "Thandi",
      title: "Senior Stylist",
      rating: 5,
      reviewCount: 48,
      image: {
        url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600",
        alt: "Thandi",
      },
    },

    {
      id: "e4",
      name: "Ame",
      title: "Beauty Therapist",
      rating: 4.8,
      reviewCount: 32,
      image: {
        url: "https://images.unsplash.com/photo-1595959183082-7bce31b7b7d2?w=600",
        alt: "Ame",
      },
    },
  ],

  reviews: [
    {
      id: "r1",
      authorName: "Zanele M",
      rating: 5,
      body: "Naledi always gets my colour right on the first try. The salon feels like home.",
      serviceName: "Full colour & blow-dry",
      employeeName: "Naledi",
      postedAt: "3 days ago",
      verified: true,
    },

    {
      id: "r2",
      authorName: "Palesa K",
      rating: 5,
      body: "Karabo did an amazing gel overlay, lasted three weeks without a single chip.",
      serviceName: "Gel overlay",
      employeeName: "Karabo",
      postedAt: "1 week ago",
      verified: true,
    },

    {
      id: "r3",
      authorName: "Refilwe S",
      rating: 4,
      body: "Great service, a little bit of a wait on a Saturday morning but worth it.",
      postedAt: "2 weeks ago",
      verified: true,
    },

    {
      id: "r4",
      authorName: "Boitumelo D",
      rating: 5,
      body: "Best pedicure in Orlando West, hands down. Clean, relaxing, and affordable.",
      serviceName: "Deluxe pedicure",
      postedAt: "3 weeks ago",
      verified: true,
    },
  ],

  portfolio: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      alt: "Nail art",
      category: "Nails",
    },

    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      alt: "Braids",
      category: "Hair",
    },

    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800",
      alt: "Blowout",
      category: "Hair",
    },
  ],

  hours: [
    {
      day: "Monday",
      opens: "9:00 AM",
      closes: "6:00 PM",
    },

    {
      day: "Tuesday",
      opens: "9:00 AM",
      closes: "6:00 PM",
    },

    {
      day: "Wednesday",
      opens: "9:00 AM",
      closes: "6:00 PM",
    },

    {
      day: "Thursday",
      opens: "9:00 AM",
      closes: "6:00 PM",
    },

    {
      day: "Friday",
      opens: "9:00 AM",
      closes: "7:00 PM",
    },

    {
      day: "Saturday",
      opens: "8:00 AM",
      closes: "4:00 PM",
    },

    {
      day: "Sunday",
      closed: true,
    },
  ],

  amenities: [
    "Free WiFi",
    "Card payments accepted",
    "Kid-friendly",
    "Woman-owned",
  ],

  social: {
    instagram: "@kutlwanobeauty",
    facebook: "Kutlwano Hair & Beauty",
  },
};
