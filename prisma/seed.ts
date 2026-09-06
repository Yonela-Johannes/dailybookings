import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  MediaEntityType,
  MediaType,
  VenueStatus,
} from "@prisma/client";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not defined in your environment");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Start seeding...");

  // ---------------------------------------------------------------------------
  // 1. Categories
  // ---------------------------------------------------------------------------

  const categories = [
    { name: "Hair", slug: "hair", icon: "Scissors" },
    { name: "Nails", slug: "nails", icon: "Sparkles" },
    { name: "Beauty", slug: "beauty", icon: "HeartPulse" },
    { name: "Massage", slug: "massage", icon: "Flower" },
    { name: "Barber", slug: "barber", icon: "UserRound" },
    { name: "Fitness", slug: "fitness", icon: "Dumbbell" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        icon: category.icon,
      },
      create: category,
    });
  }

  const hairCategory = await prisma.category.findUnique({
    where: {
      slug: "hair",
    },
  });

  if (!hairCategory) {
    throw new Error("Hair category was not created");
  }

  // ---------------------------------------------------------------------------
  // 2. User
  // ---------------------------------------------------------------------------

  const owner = await prisma.user.upsert({
    where: {
      email: "owner@dailybookings.co.za",
    },
    update: {
      fullName: "Naledi Molapo",
      role: UserRole.BUSINESS_OWNER,
    },
    create: {
      email: "owner@dailybookings.co.za",
      fullName: "Naledi Molapo",
      role: UserRole.BUSINESS_OWNER,

      profile: {
        create: {
          avatarUrl:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600",
          bio: "Owner of Kutlwano Hair & Beauty",
          phone: "+27 71 234 5678",
        },
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 3. Business
  // ---------------------------------------------------------------------------

  const business = await prisma.business.upsert({
    where: {
      id: "kutlwano-business-id",
    },
    update: {
      ownerId: owner.id,
      name: "Kutlwano Group",
      verified: true,
    },
    create: {
      id: "kutlwano-business-id",
      ownerId: owner.id,
      name: "Kutlwano Group",
      verified: true,
    },
  });

  // ---------------------------------------------------------------------------
  // 4. Venue
  // ---------------------------------------------------------------------------

  const venue = await prisma.venue.upsert({
    where: {
      slug: "kutlwano-hair-and-beauty",
    },
    update: {
      businessId: business.id,
      name: "Kutlwano Hair & Beauty",
      tagline: "Hair, nails and beauty services in the heart of Orlando West.",
      description:
        "A neighbourhood beauty spot offering wash-and-styles, gel nails, waxing and skincare, run by a small team that knows most of its regulars by name.",
      categoryId: hairCategory.id,
      status: VenueStatus.ACTIVE,
      rating: 4.9,
      reviewCount: 214,
    },
    create: {
      businessId: business.id,
      slug: "kutlwano-hair-and-beauty",
      name: "Kutlwano Hair & Beauty",
      tagline: "Hair, nails and beauty services in the heart of Orlando West.",
      description:
        "A neighbourhood beauty spot offering wash-and-styles, gel nails, waxing and skincare, run by a small team that knows most of its regulars by name.",
      categoryId: hairCategory.id,
      status: VenueStatus.ACTIVE,
      rating: 4.9,
      reviewCount: 214,

      address: {
        create: {
          street: "12 Vilakazi Street",
          suburb: "Orlando West",
          city: "Soweto",
          region: "Gauteng",
          postalCode: "1804",
          country: "South Africa",
          lat: -26.2412,
          lng: 27.9247,
        },
      },

      contact: {
        create: {
          phone: "+27 71 234 5678",
          whatsapp: "+27 71 234 5678",
          email: "hello@kutlwano.co.za",
          instagram: "@kutlwanobeauty",
          facebook: "Kutlwano Hair & Beauty",
        },
      },

      bookingConfig: {
        create: {
          instantConfirmation: true,
          acceptsOnlinePayments: true,
          requiresDeposit: false,
          depositPercentage: 0,
          cancellationPolicy:
            "Free cancellation up to 24 hours before your appointment.",
          minimumNoticeMinutes: 60,
        },
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 5. Venue working hours
  // ---------------------------------------------------------------------------

  const hoursData = [
    {
      day: 1,
      opens: "09:00",
      closes: "18:00",
      closed: false,
    },
    {
      day: 2,
      opens: "09:00",
      closes: "18:00",
      closed: false,
    },
    {
      day: 3,
      opens: "09:00",
      closes: "18:00",
      closed: false,
    },
    {
      day: 4,
      opens: "09:00",
      closes: "18:00",
      closed: false,
    },
    {
      day: 5,
      opens: "09:00",
      closes: "19:00",
      closed: false,
    },
    {
      day: 6,
      opens: "08:00",
      closes: "16:00",
      closed: false,
    },
    {
      day: 0,
      opens: null,
      closes: null,
      closed: true,
    },
  ];

  for (const hours of hoursData) {
    await prisma.venueSchedule.upsert({
      where: {
        venueId_day: {
          venueId: venue.id,
          day: hours.day,
        },
      },
      update: {
        opens: hours.opens,
        closes: hours.closes,
        closed: hours.closed,
      },
      create: {
        venueId: venue.id,
        ...hours,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Service categories
  // ---------------------------------------------------------------------------

  const featuredServiceCategory = await prisma.serviceCategory.upsert({
    where: {
      venueId_name: {
        venueId: venue.id,
        name: "Featured",
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      name: "Featured",
    },
  });

  const nailsServiceCategory = await prisma.serviceCategory.upsert({
    where: {
      venueId_name: {
        venueId: venue.id,
        name: "Nails",
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      name: "Nails",
    },
  });

  // ---------------------------------------------------------------------------
  // 7. Services
  // ---------------------------------------------------------------------------

  const washCutBlowDry = await prisma.service.upsert({
    where: {
      id: "kutlwano-wash-cut-blowdry",
    },
    update: {
      serviceCategoryId: featuredServiceCategory.id,
      name: "Wash, cut & blow-dry",
      description: "A complete wash, precision cut and finished blow-dry.",
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 210,
      priceIsFrom: true,
      popular: true,
    },
    create: {
      id: "kutlwano-wash-cut-blowdry",
      serviceCategoryId: featuredServiceCategory.id,
      name: "Wash, cut & blow-dry",
      description: "A complete wash, precision cut and finished blow-dry.",
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 210,
      priceIsFrom: true,
      popular: true,
    },
  });

  const gelOverlayRemoval = await prisma.service.upsert({
    where: {
      id: "kutlwano-gel-overlay-removal",
    },
    update: {
      serviceCategoryId: featuredServiceCategory.id,
      name: "Gel overlay & removal",
      description: "Gel overlay with removal of existing product included.",
      durationMinutes: 75,
      bufferMinutes: 0,
      price: 370,
      priceIsFrom: false,
      popular: true,
    },
    create: {
      id: "kutlwano-gel-overlay-removal",
      serviceCategoryId: featuredServiceCategory.id,
      name: "Gel overlay & removal",
      description: "Gel overlay with removal of existing product included.",
      durationMinutes: 75,
      bufferMinutes: 0,
      price: 370,
      priceIsFrom: false,
      popular: true,
    },
  });

  const gelOverlay = await prisma.service.upsert({
    where: {
      id: "kutlwano-gel-overlay",
    },
    update: {
      serviceCategoryId: nailsServiceCategory.id,
      name: "Gel overlay",
      description: "Long-lasting gel overlay for natural nails.",
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 290,
      priceIsFrom: false,
      popular: true,
    },
    create: {
      id: "kutlwano-gel-overlay",
      serviceCategoryId: nailsServiceCategory.id,
      name: "Gel overlay",
      description: "Long-lasting gel overlay for natural nails.",
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 290,
      priceIsFrom: false,
      popular: true,
    },
  });

  // ---------------------------------------------------------------------------
  // 8. Employee
  // ---------------------------------------------------------------------------

  const naledi = await prisma.employee.upsert({
    where: {
      id: "kutlwano-naledi",
    },
    update: {
      venueId: venue.id,
      name: "Naledi",
      title: "Owner · Stylist",
      rating: 5,
      reviewCount: 86,
      imageUrl:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600",
    },
    create: {
      id: "kutlwano-naledi",
      venueId: venue.id,
      name: "Naledi",
      title: "Owner · Stylist",
      rating: 5,
      reviewCount: 86,
      imageUrl:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600",

      schedules: {
        createMany: {
          data: [
            {
              day: 1,
              startTime: "09:00",
              endTime: "18:00",
            },
            {
              day: 2,
              startTime: "09:00",
              endTime: "18:00",
            },
            {
              day: 3,
              startTime: "09:00",
              endTime: "18:00",
            },
            {
              day: 4,
              startTime: "09:00",
              endTime: "18:00",
            },
            {
              day: 5,
              startTime: "09:00",
              endTime: "19:00",
            },
            {
              day: 6,
              startTime: "08:00",
              endTime: "16:00",
            },
          ],
        },
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 9. Assign services to employee
  // ---------------------------------------------------------------------------

  await prisma.employee.update({
    where: {
      id: naledi.id,
    },
    data: {
      services: {
        connect: [
          {
            id: washCutBlowDry.id,
          },
          {
            id: gelOverlayRemoval.id,
          },
          {
            id: gelOverlay.id,
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------------
  // 10. Venue media
  // ---------------------------------------------------------------------------

  await prisma.media.createMany({
    data: [
      {
        venueId: venue.id,
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600",
        alt: "Interior of Kutlwano Hair & Beauty",
        type: MediaType.IMAGE,
        featured: true,
        entityType: MediaEntityType.VENUE,
        category: "gallery",
      },
      {
        venueId: venue.id,
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
        alt: "Nail station",
        type: MediaType.IMAGE,
        featured: false,
        entityType: MediaEntityType.VENUE,
        category: "gallery",
      },
    ],
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
