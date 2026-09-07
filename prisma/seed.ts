import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  MediaEntityType,
  VenueStatus,
  BookingStatus,
} from "@prisma/client";

import { addDays } from "date-fns";

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

  const categoriesData = [
    {
      name: "Hair",
      slug: "hair",
      icon: "Scissors",
      description: "Salons, barbers & stylists for all hair types.",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      status: "ACTIVE"
    },
    {
      name: "Nails",
      slug: "nails",
      icon: "Sparkles",
      description: "Manicures, pedicures and custom nail art.",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      status: "ACTIVE"
    },
    {
      name: "Beauty",
      slug: "beauty",
      icon: "HeartPulse",
      description: "Skincare, makeup and aesthetic treatments.",
      imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
      status: "ACTIVE"
    },
    {
      name: "Wellness",
      slug: "wellness",
      icon: "Flower",
      description: "Massage, spa and holistic wellbeing.",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?w=800",
      status: "ACTIVE"
    },
    {
      name: "Barber",
      slug: "barber",
      icon: "UserRound",
      description: "Precision cuts and grooming for men.",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
      status: "ACTIVE"
    },
    {
      name: "Fitness",
      slug: "fitness",
      icon: "Dumbbell",
      description: "Gyms, personal trainers and yoga classes.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      status: "ACTIVE"
    },
    {
      name: "Photography",
      slug: "photography",
      icon: "Camera",
      description: "Professional photographers and creative studios.",
      imageUrl: "https://images.unsplash.com/photo-1520853502340-599adeb22424?w=800",
      status: "ACTIVE"
    },
    {
      name: "Tutors",
      slug: "tutors",
      icon: "GraduationCap",
      description: "Academic support and skill development.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      status: "ACTIVE"
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const allCategories = await prisma.category.findMany();

  // ---------------------------------------------------------------------------
  // 2. Users
  // ---------------------------------------------------------------------------

  const admin = await prisma.user.upsert({
    where: { email: "admin@dailybookings.co.za" },
    update: { role: UserRole.PLATFORM_ADMIN, fullName: "DailyBookings Admin" },
    create: {
      email: "admin@dailybookings.co.za",
      fullName: "DailyBookings Admin",
      role: UserRole.PLATFORM_ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: { role: UserRole.CUSTOMER, fullName: "John Doe" },
    create: {
      email: "customer@example.com",
      fullName: "John Doe",
      role: UserRole.CUSTOMER,
      profile: {
        create: {
          bio: "Regular customer looking for local services.",
        },
      },
    },
  });

  const owners = [
    { email: "naledi@kutlwano.co.za", name: "Naledi Molapo", bio: "Passionate about beauty and community." },
    { email: "sipho@thebarber.co.za", name: "Sipho Khumalo", bio: "Master barber with 10 years experience." },
    { email: "claire@wellness.co.za", name: "Claire van Wyk", bio: "Holistic health and wellness advocate." },
  ];

  const ownersDb = [];
  for (const o of owners) {
    const user = await prisma.user.upsert({
      where: { email: o.email },
      update: { role: UserRole.BUSINESS_OWNER, fullName: o.name },
      create: {
        email: o.email,
        fullName: o.name,
        role: UserRole.BUSINESS_OWNER,
        profile: {
          create: {
            bio: o.bio,
          },
        },
      },
    });
    ownersDb.push(user);
  }

  // ---------------------------------------------------------------------------
  // 3. Businesses & Venues
  // ---------------------------------------------------------------------------

  const venuesData = [
    {
      ownerIdx: 0,
      slug: "kutlwano-hair-and-beauty",
      name: "Kutlwano Hair & Beauty",
      tagline: "Hair, nails and beauty in Soweto",
      catSlug: "hair",
      city: "Soweto",
      verified: true,
    },
    {
      ownerIdx: 1,
      slug: "the-gentlemans-barber-sandton",
      name: "The Gentleman's Barber",
      tagline: "Premium grooming in Sandton",
      catSlug: "barber",
      city: "Sandton",
      verified: true,
    },
    {
      ownerIdx: 2,
      slug: "zen-harmony-spa-stellenbosch",
      name: "Zen Harmony Spa",
      tagline: "Find your peace in Stellenbosch",
      catSlug: "wellness",
      city: "Stellenbosch",
      verified: true,
    },
  ];

  for (const v of venuesData) {
    const category = allCategories.find((c) => c.slug === v.catSlug);
    const owner = ownersDb[v.ownerIdx];

    const business = await prisma.business.upsert({
      where: { id: `${v.slug}-id` },
      update: { name: `${v.name} Group`, verified: v.verified },
      create: {
        id: `${v.slug}-id`,
        ownerId: owner.id,
        name: `${v.name} Group`,
        verified: v.verified,
      },
    });

    const venue = await prisma.venue.upsert({
      where: { slug: v.slug },
      update: {
        name: v.name,
        tagline: v.tagline,
        description: `A premier ${category?.name} venue located in ${v.city}. We pride ourselves on exceptional service and community values.`,
        categoryId: category!.id,
        status: VenueStatus.ACTIVE,
      },
      create: {
        businessId: business.id,
        slug: v.slug,
        name: v.name,
        tagline: v.tagline,
        description: `A premier ${category?.name} venue located in ${v.city}. We pride ourselves on exceptional service and community values.`,
        categoryId: category!.id,
        status: VenueStatus.ACTIVE,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 500) + 10,
        address: {
          create: {
            street: "123 Main Street",
            suburb: "Central",
            city: v.city,
            region: "Gauteng",
            postalCode: "2000",
          },
        },
        contact: {
          create: {
            phone: "+27 11 123 4567",
            email: `hello@${v.slug}.co.za`,
          },
        },
        bookingConfig: {
          create: {
            instantConfirmation: true,
            minimumNoticeMinutes: 60,
          },
        },
        schedules: {
          createMany: {
            data: [1, 2, 3, 4, 5].map((d) => ({ day: d, opens: "09:00", closes: "18:00" })),
          },
        },
        media: {
          create: {
            url: category?.imageUrl || "",
            entityType: MediaEntityType.VENUE,
            featured: true,
          },
        },
        serviceCategories: {
          create: {
            name: "Standard Services",
            services: {
              create: [
                { name: `${category?.name} Session`, durationMinutes: 60, price: 250 + Math.random() * 500, popular: true },
                { name: "Premium Treatment", durationMinutes: 90, price: 600 + Math.random() * 400 },
              ],
            },
          },
        },
        employees: {
          create: [
            {
              name: `Professional ${v.name.split(" ")[0]}`,
              title: "Senior Expert",
              rating: 4.8,
              schedules: {
                createMany: {
                  data: [1, 2, 3, 4, 5].map((d) => ({ day: d, startTime: "09:00", endTime: "18:00" })),
                },
              },
            },
          ],
        },
      },
    });

    // Seed some reviews if not already present
    const existingReviews = await prisma.review.count({ where: { venueId: venue.id } });
    if (existingReviews === 0) {
      await prisma.review.create({
        data: {
          userId: customer.id,
          venueId: venue.id,
          rating: 5,
          body: "Absolutely wonderful experience! Highly recommended.",
          verified: true,
        },
      });
    }

    // Seed some bookings if not already present
    const existingBookings = await prisma.booking.count({ where: { venueId: venue.id } });
    if (existingBookings === 0) {
      await prisma.booking.create({
        data: {
          userId: customer.id,
          venueId: venue.id,
          date: addDays(new Date(), 1),
          startTime: "10:00",
          endTime: "11:00",
          durationTotal: 60,
          priceTotal: 350,
          status: BookingStatus.CONFIRMED,
        },
      });
    }
  }

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
