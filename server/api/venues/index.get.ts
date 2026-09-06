import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { category, search, limit } = query;
  const prisma = new PrismaClient();

  const where: any = {
    status: "active",
    deletedAt: null,
  };

  if (category) {
    where.category = {
      slug: String(category),
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: "insensitive" } },
      { description: { contains: String(search), mode: "insensitive" } },
    ];
  }

  try {
    const venues = await prisma.venue.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      include: {
        category: true,
        media: {
          where: {
            featured: true,
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });

    return venues;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
