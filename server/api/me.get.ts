import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  // 1. Try serverSupabaseUser first (standard module way)
  let user = await serverSupabaseUser(event);

  // 2. If it fails, try the client directly (more robust for headers)
  if (!user) {
    const client = await serverSupabaseClient(event);
    const { data: { user: clientUser } } = await client.auth.getUser();
    user = clientUser;
  }

  if (!user?.id) {
    const cookies = parseCookies(event);
    const headers = getHeaders(event);
    const sbCookie = Object.keys(cookies).find(n => n.includes('-auth-token'));

    console.warn(`API /me: Unauthorized.
      Cookie found: ${!!sbCookie}.
      Auth Header: ${!!headers['authorization']}.
      User Object: ${!!user}`);

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
            communities: true
          },
        },
        communities: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
    });

    if (!userData) {
      console.warn(`API /me: User ${user.id} not found in local database`);
      throw createError({
        statusCode: 404,
        statusMessage: "User not found in database",
      });
    }

    return userData;
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('API /me runtime error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
