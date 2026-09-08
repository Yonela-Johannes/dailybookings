import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  MediaEntityType,
  VenueStatus,
  BookingStatus,
  CategoryStatus,
  MediaType,
} from "@prisma/client";

import { addDays, subDays, startOfToday, setHours, setMinutes, format } from "date-fns";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Deterministic IDs for testing
const CUSTOMER_ID = "00000000-0000-0000-0000-000000000001";
const BUSINESS_OWNER_ID = "00000000-0000-0000-0000-000000000002";
const ADMIN_ID = "00000000-0000-0000-0000-000000000003";

async function main() {
  console.log("Starting comprehensive production-grade seed...");

  // 1. CLEANUP
  // prisma db push might have already handled structure, but let's ensure data is clean for these specific IDs
  await prisma.comment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.bookingService.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.employeeSchedule.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.venueSchedule.deleteMany({});
  await prisma.venueAddress.deleteMany({});
  await prisma.venueContact.deleteMany({});
  await prisma.bookingConfig.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversationParticipant.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.community.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. COMMUNITIES
  console.log("Seeding Communities...");
  const communities = [
    { name: "Sandton Central", slug: "sandton-central", description: "The financial heart of Johannesburg, home to top-tier wellness and beauty spots.", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" },
    { name: "Gardens, Cape Town", slug: "gardens-ct", description: "A creative and vibrant community in the Mother City bowl.", imageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800" },
    { name: "Rosebank Hub", slug: "rosebank-hub", description: "A bustling cosmopolitan neighborhood with a focus on fitness and lifestyle.", imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800" },
  ];
  const commMap: Record<string, any> = {};
  for (const c of communities) {
    const record = await prisma.community.create({ data: { ...c, status: "ACTIVE" } });
    commMap[c.slug] = record;
  }

  // 3. CATEGORIES
  console.log("Seeding Categories...");
  const categories = [
    { name: "Hair", slug: "hair", icon: "Scissors", description: "Expert hair styling.", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800" },
    { name: "Barber", slug: "barber", icon: "Scissors", description: "Classic grooming.", imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800" },
    { name: "Beauty", slug: "beauty", icon: "HeartPulse", description: "Skincare and makeup.", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800" },
    { name: "Wellness", slug: "wellness", icon: "Sparkles", description: "Massage and spa.", imageUrl: "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?w=800" },
    { name: "Fitness", slug: "fitness", icon: "Dumbbell", description: "Gyms and trainers.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" },
  ];
  const catMap: Record<string, any> = {};
  for (const cat of categories) {
    const record = await prisma.category.create({ data: { ...cat, status: CategoryStatus.ACTIVE } });
    catMap[cat.slug] = record;
  }

  // 4. USERS
  console.log("Seeding Users...");
  const testUsers = [
    { id: CUSTOMER_ID, email: "customer@dailybookings.test", fullName: "John Customer", role: UserRole.CUSTOMER },
    { id: BUSINESS_OWNER_ID, email: "business@dailybookings.test", fullName: "Sarah Business", role: UserRole.BUSINESS_OWNER },
    { id: ADMIN_ID, email: "admin@dailybookings.test", fullName: "Platform Admin", role: UserRole.PLATFORM_ADMIN },
    { email: "owner2@example.com", fullName: "David Wellness", role: UserRole.BUSINESS_OWNER },
    { email: "client1@example.com", fullName: "Alice Client", role: UserRole.CUSTOMER },
  ];
  const userMap: Record<string, any> = {};
  for (const u of testUsers) {
    const record = await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        profile: { create: { bio: `Profile of ${u.fullName}` } }
      }
    });
    userMap[u.email] = record;
  }

  // 5. BUSINESSES & VENUES
  console.log("Seeding Businesses & Venues...");
  const venues = [
    {
      ownerEmail: "business@dailybookings.test",
      slug: "glow-beauty-bar",
      name: "Glow Beauty Bar",
      cat: "beauty",
      comm: "sandton-central",
      verified: true
    },
    {
      ownerEmail: "business@dailybookings.test",
      slug: "modern-cuts-ct",
      name: "Modern Cuts",
      cat: "barber",
      comm: "gardens-ct",
      verified: true
    },
    {
      ownerEmail: "owner2@example.com",
      slug: "zen-spa-rosebank",
      name: "Zen Spa & Wellness",
      cat: "wellness",
      comm: "rosebank-hub",
      verified: false
    }
  ];

  const venueMap: Record<string, any> = {};
  for (const v of venues) {
    const owner = userMap[v.ownerEmail];
    const biz = await prisma.business.create({
      data: {
        ownerId: owner.id,
        name: `${v.name} Enterprises`,
        verified: v.verified
      }
    });

    const record = await prisma.venue.create({
      data: {
        businessId: biz.id,
        name: v.name,
        slug: v.slug,
        categoryId: catMap[v.cat].id,
        communityId: commMap[v.comm].id,
        status: VenueStatus.ACTIVE,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: 1,
        address: {
          create: { street: "123 Professional Way", suburb: "Central", city: "Johannesburg", region: "Gauteng", postalCode: "2000" }
        },
        contact: {
          create: { phone: "0112345678", email: `info@${v.slug}.co.za` }
        },
        bookingConfig: { create: {} },
        schedules: {
          createMany: {
            data: [1, 2, 3, 4, 5].map(d => ({ day: d, opens: "08:00", closes: "17:00" }))
          }
        },
        media: {
          create: { url: catMap[v.cat].imageUrl, entityType: MediaEntityType.VENUE, featured: true }
        }
      }
    });
    venueMap[v.slug] = record;

    // Services
    const sc = await prisma.serviceCategory.create({ data: { venueId: record.id, name: "General" } });
    await prisma.service.create({
      data: {
        serviceCategoryId: sc.id,
        name: `${v.name} Signature Service`,
        price: 350,
        durationMinutes: 60,
        popular: true
      }
    });

    // Employee
    const emp = await prisma.employee.create({
      data: {
        venueId: record.id,
        name: `${v.name} Specialist`,
        title: "Senior Stylist",
        schedules: {
          createMany: {
            data: [1, 2, 3, 4, 5].map(d => ({ day: d, startTime: "08:00", endTime: "17:00" }))
          }
        }
      }
    });

    // Link service to employee
    const service = await prisma.service.findFirst({ where: { serviceCategoryId: sc.id } });
    if (service) {
      await prisma.employee.update({
        where: { id: emp.id },
        data: { services: { connect: { id: service.id } } }
      });
    }
  }

  // 6. BOOKINGS, REVIEWS, ENGAGEMENT
  console.log("Seeding Interactions...");
  const customer = userMap["customer@dailybookings.test"];
  const glow = venueMap["glow-beauty-bar"];
  const barber = venueMap["modern-cuts-ct"];
  const service = await prisma.service.findFirst({ where: { category: { venueId: glow.id } } });

  // Upcoming
  await prisma.booking.create({
    data: {
      userId: customer.id,
      venueId: glow.id,
      date: addDays(new Date(), 3),
      startTime: "10:00",
      endTime: "11:00",
      durationTotal: 60,
      priceTotal: 350,
      status: BookingStatus.CONFIRMED,
      services: {
        create: { serviceId: service!.id, price: 350, durationMinutes: 60 }
      }
    }
  });

  // Completed + Review
  const pastBooking = await prisma.booking.create({
    data: {
      userId: customer.id,
      venueId: glow.id,
      date: subDays(new Date(), 5),
      startTime: "09:00",
      endTime: "10:00",
      durationTotal: 60,
      priceTotal: 350,
      status: BookingStatus.COMPLETED,
      services: {
        create: { serviceId: service!.id, price: 350, durationMinutes: 60 }
      }
    }
  });

  const review = await prisma.review.create({
    data: {
      userId: customer.id,
      venueId: glow.id,
      rating: 5,
      body: "Excellent service and atmosphere!",
      verified: true
    }
  });

  // Reply from owner
  await prisma.comment.create({
    data: {
      userId: userMap["business@dailybookings.test"].id,
      reviewId: review.id,
      body: "Thank you for the kind words!"
    }
  });

  // Favorites & Likes
  await prisma.favorite.create({ data: { userId: customer.id, venueId: glow.id } });
  await prisma.like.create({ data: { userId: customer.id, venueId: barber.id } });

  // Community Membership
  await prisma.community.update({
    where: { id: commMap["sandton-central"].id },
    data: { members: { connect: { id: customer.id } } }
  });

  // Messages
  const convo = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: customer.id },
          { userId: userMap["business@dailybookings.test"].id }
        ]
      }
    }
  });
  await prisma.message.create({
    data: { conversationId: convo.id, senderId: customer.id, body: "Hello, do you have any specials?" }
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
