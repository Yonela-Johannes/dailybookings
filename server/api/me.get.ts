import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user?.id) {
    console.warn('API /me: No Supabase user found in event context');
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        businesses: {
          include: {
            venues: {
              select: {
                slug: true,
              },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!userData) {
      console.warn(`API /me: User ${user.id} not found in database`);
      throw createError({
        statusCode: 404,
        statusMessage: "User not found in database",
      });
    }

    return userData;
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('API /me error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
